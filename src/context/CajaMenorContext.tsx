import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ExpenseCategory,
  CashRequest,
  InvoiceDocument,
  FundReplenishment,
  CashAuditCount,
  PHVAItem,
  AuditLog,
  INITIAL_CATEGORY_BUDGETS,
  FIXED_FUND_TOTAL,
  MAX_PURCHASE_LIMIT,
  RequestStatus,
  InvoiceStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_REQUESTS,
  INITIAL_INVOICES,
  INITIAL_REPLENISHMENTS,
  INITIAL_AUDIT_COUNTS,
  INITIAL_PHVA_ITEMS,
  INITIAL_LOGS,
} from '../data/initialData';

export interface SystemAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionTab?: string;
}

interface CajaMenorContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  requests: CashRequest[];
  invoices: InvoiceDocument[];
  replenishments: FundReplenishment[];
  auditCounts: CashAuditCount[];
  phvaItems: PHVAItem[];
  logs: AuditLog[];
  categoryBudgets: Record<ExpenseCategory, number>;

  // Computed Financials
  fondoFijoTotal: number;
  gastosAprobadosTotal: number;
  anticiposEntregadosTotal: number;
  efectivoDisponibleEnCaja: number;
  porcentajeConsumido: number;
  gastosPorCategoria: Record<ExpenseCategory, { ejecutado: number; presupuestado: number; porcentaje: number }>;
  systemAlerts: SystemAlert[];

  // Actions
  createRequest: (data: Omit<CashRequest, 'id' | 'code' | 'createdAt' | 'status'>) => { success: boolean; message: string; id?: string };
  reviewRequest: (id: string, status: 'aprobada' | 'rechazada', notes?: string) => void;
  deliverCash: (id: string, notes?: string) => void;
  createInvoice: (data: Omit<InvoiceDocument, 'id' | 'code' | 'createdAt' | 'status'>) => { success: boolean; message: string; id?: string };
  reviewInvoice: (id: string, status: InvoiceStatus, notes?: string) => void;
  requestReplenishment: (notes?: string) => { success: boolean; message: string };
  executeReplenishment: (id: string, paymentMethod: string, bankReference: string) => void;
  createAuditCount: (audit: Omit<CashAuditCount, 'id'>) => CashAuditCount;
  updatePHVAItem: (id: string, updates: Partial<PHVAItem>) => void;
  resetToDemoData: () => void;
  exportDatabase: () => void;
}

const CajaMenorContext = createContext<CajaMenorContextType | undefined>(undefined);

const STORAGE_KEY = 'cajauno_somos_uno_v1';

export const CajaMenorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [categoryBudgets] = useState(INITIAL_CATEGORY_BUDGETS);

  const [requests, setRequests] = useState<CashRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [invoices, setInvoices] = useState<InvoiceDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [replenishments, setReplenishments] = useState<FundReplenishment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_replenishments`);
    return saved ? JSON.parse(saved) : INITIAL_REPLENISHMENTS;
  });

  const [auditCounts, setAuditCounts] = useState<CashAuditCount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audits`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_COUNTS;
  });

  const [phvaItems, setPhvaItems] = useState<PHVAItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_phva`);
    return saved ? JSON.parse(saved) : INITIAL_PHVA_ITEMS;
  });

  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_replenishments`, JSON.stringify(replenishments));
  }, [replenishments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audits`, JSON.stringify(auditCounts));
  }, [auditCounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_phva`, JSON.stringify(phvaItems));
  }, [phvaItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(logs));
  }, [logs]);

  // Log helper
  const addLog = (action: string, target: string, details: string) => {
    const newEntry: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action,
      target,
      details,
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  // Financial calculations strictly according to proposal page 5:
  // Fondo Fijo = $2.000.000 COP
  // Gastos soportados y legalizados aprobados del ciclo (pendientes de reposición)
  // Anticipos entregados pendientes de legalizar
  // Efectivo físico disponible = Fondo Fijo - Gastos aprobados - Anticipos entregados

  const gastosAprobadosTotal = invoices
    .filter((inv) => inv.status === 'aprobada')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const anticiposEntregadosTotal = requests
    .filter((req) => req.status === 'entregada')
    .reduce((sum, req) => sum + req.estimatedAmount, 0);

  const efectivoDisponibleEnCaja = Math.max(
    0,
    FIXED_FUND_TOTAL - gastosAprobadosTotal - anticiposEntregadosTotal
  );

  const totalComprometido = gastosAprobadosTotal + anticiposEntregadosTotal;
  const porcentajeConsumido = Math.min(100, Math.round((totalComprometido / FIXED_FUND_TOTAL) * 100));

  // Category breakdown
  const gastosPorCategoria: Record<ExpenseCategory, { ejecutado: number; presupuestado: number; porcentaje: number }> = {
    'Papelería y útiles': { ejecutado: 0, presupuestado: categoryBudgets['Papelería y útiles'], porcentaje: 0 },
    'Transporte y movilización': { ejecutado: 0, presupuestado: categoryBudgets['Transporte y movilización'], porcentaje: 0 },
    'Materiales para actividades comunitarias': { ejecutado: 0, presupuestado: categoryBudgets['Materiales para actividades comunitarias'], porcentaje: 0 },
    'Aseo y cafetería': { ejecutado: 0, presupuestado: categoryBudgets['Aseo y cafetería'], porcentaje: 0 },
    'Impresiones y fotocopias': { ejecutado: 0, presupuestado: categoryBudgets['Impresiones y fotocopias'], porcentaje: 0 },
    'Gastos imprevistos autorizados': { ejecutado: 0, presupuestado: categoryBudgets['Gastos imprevistos autorizados'], porcentaje: 0 },
  };

  invoices
    .filter((inv) => inv.status === 'aprobada')
    .forEach((inv) => {
      if (gastosPorCategoria[inv.category]) {
        gastosPorCategoria[inv.category].ejecutado += inv.totalAmount;
      }
    });

  // Calculate percentages per category
  (Object.keys(gastosPorCategoria) as ExpenseCategory[]).forEach((cat) => {
    const item = gastosPorCategoria[cat];
    item.porcentaje = Math.round((item.ejecutado / item.presupuestado) * 100);
  });

  // System alerts computation
  const systemAlerts: SystemAlert[] = [];

  if (efectivoDisponibleEnCaja <= 500000) {
    systemAlerts.push({
      id: 'alt_saldo_bajo',
      type: 'warning',
      title: 'Saldo bajo en Caja Menor',
      message: `El efectivo disponible es de $${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP (${100 - porcentajeConsumido}% del fondo). Se recomienda tramitar la reposición del fondo a Gerencia.`,
      actionTab: 'fondo',
    });
  }

  const solicitudesPendientes = requests.filter((r) => r.status === 'pendiente');
  if (solicitudesPendientes.length > 0) {
    systemAlerts.push({
      id: 'alt_sol_pendientes',
      type: 'info',
      title: `${solicitudesPendientes.length} solicitud(es) pendiente(s) de revisión`,
      message: 'Hay solicitudes de compra esperando autorización del área administrativa.',
      actionTab: 'solicitudes',
    });
  }

  const facturasPendientes = invoices.filter((i) => i.status === 'en_revision' || i.status === 'registrada');
  if (facturasPendientes.length > 0) {
    systemAlerts.push({
      id: 'alt_fac_revision',
      type: 'info',
      title: `${facturasPendientes.length} factura(s) por verificar`,
      message: 'Existen comprobantes y facturas que requieren validación de soportes por el área financiera.',
      actionTab: 'facturas',
    });
  }

  const anticiposActivos = requests.filter((r) => r.status === 'entregada');
  if (anticiposActivos.length > 0) {
    systemAlerts.push({
      id: 'alt_anticipos_activos',
      type: 'info',
      title: `${anticiposActivos.length} anticipo(s) en curso por legalizar`,
      message: `Total en manos de colaboradores: $${anticiposEntregadosTotal.toLocaleString('es-CO')} COP. Plazo máximo de legalización: 48 horas tras la compra.`,
      actionTab: 'facturas',
    });
  }

  // Create cash request
  const createRequest = (data: Omit<CashRequest, 'id' | 'code' | 'createdAt' | 'status'>) => {
    if (data.estimatedAmount > MAX_PURCHASE_LIMIT) {
      return {
        success: false,
        message: `El valor solicitado ($${data.estimatedAmount.toLocaleString('es-CO')} COP) supera el límite máximo permitido por compra de $${MAX_PURCHASE_LIMIT.toLocaleString('es-CO')} COP estipulado en el reglamento de Caja Menor.`,
      };
    }

    if (data.estimatedAmount > efectivoDisponibleEnCaja) {
      return {
        success: false,
        message: `El valor excede el saldo en efectivo disponible actualmente en la caja ($${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP). Se debe solicitar primero la reposición del fondo.`,
      };
    }

    const nextNumber = requests.length + 1;
    const code = `SOL-2026-${String(nextNumber).padStart(3, '0')}`;
    const id = `req_${Date.now()}`;

    const newRequest: CashRequest = {
      ...data,
      id,
      code,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    addLog(
      'Creación de Solicitud',
      code,
      `Solicitud registrada por ${data.requesterName} para '${data.areaOrProject}' por valor de $${data.estimatedAmount.toLocaleString('es-CO')} COP.`
    );

    return {
      success: true,
      message: `Solicitud ${code} creada exitosamente. Ha sido enviada a Coordinación Administrativa para su revisión.`,
      id,
    };
  };

  // Review request
  const reviewRequest = (id: string, status: 'aprobada' | 'rechazada', notes?: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
            reviewNotes: notes || (status === 'aprobada' ? 'Aprobada conforme a políticas' : 'Rechazada'),
          };
        }
        return req;
      })
    );

    const targetReq = requests.find((r) => r.id === id);
    addLog(
      status === 'aprobada' ? 'Autorización de Solicitud' : 'Rechazo de Solicitud',
      targetReq?.code || id,
      `Solicitud ${status} por ${currentUser.name} (${currentUser.roleTitle}). ${notes ? `Observación: ${notes}` : ''}`
    );
  };

  // Deliver cash
  const deliverCash = (id: string, notes?: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: 'entregada',
            deliveredBy: currentUser.name,
            deliveredAt: new Date().toISOString(),
            deliveryNotes: notes || 'Entrega física de efectivo realizada con constancia.',
          };
        }
        return req;
      })
    );

    const targetReq = requests.find((r) => r.id === id);
    addLog(
      'Entrega de Efectivo (Anticipo)',
      targetReq?.code || id,
      `Custodio ${currentUser.name} entregó $${targetReq?.estimatedAmount.toLocaleString('es-CO')} COP al solicitante ${targetReq?.requesterName}.`
    );
  };

  // Create invoice / legalization
  const createInvoice = (data: Omit<InvoiceDocument, 'id' | 'code' | 'createdAt' | 'status'>) => {
    // Check duplicate: same NIT and invoiceNumber
    const duplicate = invoices.find(
      (inv) =>
        inv.supplierNit.trim().toLowerCase() === data.supplierNit.trim().toLowerCase() &&
        inv.invoiceNumber.trim().toLowerCase() === data.invoiceNumber.trim().toLowerCase()
    );

    if (duplicate) {
      return {
        success: false,
        message: `¡ALERTA DE DUPLICIDAD! Ya existe una factura registrada con el NIT ${data.supplierNit} y el número consecutivo ${data.invoiceNumber} (Código: ${duplicate.code}). Verifique el soporte físico para evitar dobles pagos.`,
      };
    }

    if (data.totalAmount > MAX_PURCHASE_LIMIT) {
      return {
        success: false,
        message: `El valor total de la factura ($${data.totalAmount.toLocaleString('es-CO')} COP) supera el límite máximo institucional de $${MAX_PURCHASE_LIMIT.toLocaleString('es-CO')} COP por compra.`,
      };
    }

    const nextNumber = invoices.length + 1;
    const code = `FAC-2026-${String(nextNumber).padStart(3, '0')}`;
    const id = `inv_${Date.now()}`;

    const newInvoice: InvoiceDocument = {
      ...data,
      id,
      code,
      status: 'en_revision',
      createdAt: new Date().toISOString(),
      dianValidationStatus: data.documentType === 'comprobante_caja' ? 'no_requerido' : 'valido',
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Update associated request status to 'legalizada' if linked
    if (data.requestId) {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === data.requestId) {
            return {
              ...req,
              status: 'legalizada',
              associatedInvoiceId: id,
            };
          }
          return req;
        })
      );
    }

    addLog(
      'Registro y Legalización de Factura',
      code,
      `Factura ${data.invoiceNumber} de ${data.supplierName} (NIT: ${data.supplierNit}) por $${data.totalAmount.toLocaleString('es-CO')} COP legalizada por ${data.buyerName}.`
    );

    return {
      success: true,
      message: `Comprobante ${code} registrado correctamente en estado 'En Revisión'.`,
      id,
    };
  };

  // Review invoice
  const reviewInvoice = (id: string, status: InvoiceStatus, notes?: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          return {
            ...inv,
            status,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
            reviewNotes: notes,
          };
        }
        return inv;
      })
    );

    const targetInv = invoices.find((i) => i.id === id);
    addLog(
      `Revisión de Factura (${status.toUpperCase()})`,
      targetInv?.code || id,
      `Comprobante marcado como '${status}' por ${currentUser.name}. ${notes ? `Nota: ${notes}` : ''}`
    );
  };

  // Request fund replenishment
  const requestReplenishment = (notes?: string) => {
    const approvedInvoices = invoices.filter((inv) => inv.status === 'aprobada');
    const totalToReimburse = approvedInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    if (totalToReimburse <= 0) {
      return {
        success: false,
        message: 'No hay facturas aprobadas pendientes de reposición en este momento.',
      };
    }

    const nextNumber = replenishments.length + 1;
    const code = `REP-2026-${String(nextNumber).padStart(3, '0')}`;
    const id = `rep_${Date.now()}`;

    const newReplenishment: FundReplenishment = {
      id,
      code,
      requestDate: new Date().toISOString(),
      requestedAmount: totalToReimburse,
      status: 'solicitada',
      requestedBy: currentUser.name,
      invoiceCount: approvedInvoices.length,
      invoiceIds: approvedInvoices.map((i) => i.id),
      notes: notes || `Solicitud formal de reposición de ${approvedInvoices.length} facturas aprobadas por $${totalToReimburse.toLocaleString('es-CO')} COP.`,
    };

    setReplenishments((prev) => [newReplenishment, ...prev]);
    addLog(
      'Solicitud de Reposición de Fondo',
      code,
      `Solicitud de reintegro por $${totalToReimburse.toLocaleString('es-CO')} COP enviada a Gerencia General.`
    );

    return {
      success: true,
      message: `Solicitud de reposición ${code} generada exitosamente por un total de $${totalToReimburse.toLocaleString('es-CO')} COP.`,
    };
  };

  // Execute replenishment (restoring fund to $2.000.000 COP)
  const executeReplenishment = (id: string, paymentMethod: string, bankReference: string) => {
    const replenishment = replenishments.find((r) => r.id === id);
    if (!replenishment) return;

    setReplenishments((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          return {
            ...rep,
            status: 'ejecutada',
            approvedAmount: rep.requestedAmount,
            approvedBy: currentUser.name,
            approvedAt: new Date().toISOString(),
            paymentMethod,
            bankReference,
          };
        }
        return rep;
      })
    );

    // Archive or update the reimbursed invoices so they no longer count as pending
    // We clear or archive by marking their reviewed notes or archiving them into historical records
    // In our model, we can archive reimbursed invoices or mark them 'reembolsada' so the box resets back to $2.000.000 full!
    setInvoices((prev) =>
      prev.map((inv) => {
        if (replenishment.invoiceIds.includes(inv.id)) {
          return {
            ...inv,
            reviewNotes: `Reembolsada mediante reposición ${replenishment.code} - Ref: ${bankReference}`,
            // Invoices stay visible for history & DIAN auditing
          };
        }
        return inv;
      })
    );

    addLog(
      'Reposición Ejecutada y Fondo Restablecido',
      replenishment.code,
      `Fondo de caja menor restablecido exitosamente a $${FIXED_FUND_TOTAL.toLocaleString('es-CO')} COP mediante ${paymentMethod} (${bankReference}). Autorizado por ${currentUser.name}.`
    );
  };

  // Create Cash Audit Count (Arqueo Físico)
  const createAuditCount = (auditData: Omit<CashAuditCount, 'id'>) => {
    const id = `aud_${Date.now()}`;
    const newAudit: CashAuditCount = {
      ...auditData,
      id,
    };

    setAuditCounts((prev) => [newAudit, ...prev]);
    addLog(
      'Arqueo Físico de Caja',
      `Arqueo ${new Date(auditData.auditDate).toLocaleDateString('es-CO')}`,
      `Total contado: $${auditData.totalCountedCash.toLocaleString('es-CO')} COP. Diferencia: $${auditData.difference.toLocaleString('es-CO')} COP. Estado: ${auditData.status.toUpperCase()}.`
    );

    return newAudit;
  };

  // Update PHVA Item
  const updatePHVAItem = (id: string, updates: Partial<PHVAItem>) => {
    setPhvaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString().slice(0, 10) } : item))
    );
    addLog('Actualización Ciclo PHVA', id, `Modificación de actividad del ciclo de calidad.`);
  };

  // Reset to initial demo data
  const resetToDemoData = () => {
    setRequests(INITIAL_REQUESTS);
    setInvoices(INITIAL_INVOICES);
    setReplenishments(INITIAL_REPLENISHMENTS);
    setAuditCounts(INITIAL_AUDIT_COUNTS);
    setPhvaItems(INITIAL_PHVA_ITEMS);
    setLogs(INITIAL_LOGS);
    localStorage.clear();
    addLog('Reinicio de Sistema', 'Base de Datos', 'Datos restaurados a los valores iniciales de la propuesta técnica.');
  };

  // Export full database to JSON file
  const exportDatabase = () => {
    const dump = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      entity: 'Corporación Social Somos Uno',
      platform: 'CajaUno@social.CS',
      fixedFundTotal: FIXED_FUND_TOTAL,
      maxPurchaseLimit: MAX_PURCHASE_LIMIT,
      requests,
      invoices,
      replenishments,
      auditCounts,
      phvaItems,
      logs,
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CajaUno_social_CS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CajaMenorContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        requests,
        invoices,
        replenishments,
        auditCounts,
        phvaItems,
        logs,
        categoryBudgets,
        fondoFijoTotal: FIXED_FUND_TOTAL,
        gastosAprobadosTotal,
        anticiposEntregadosTotal,
        efectivoDisponibleEnCaja,
        porcentajeConsumido,
        gastosPorCategoria,
        systemAlerts,
        createRequest,
        reviewRequest,
        deliverCash,
        createInvoice,
        reviewInvoice,
        requestReplenishment,
        executeReplenishment,
        createAuditCount,
        updatePHVAItem,
        resetToDemoData,
        exportDatabase,
      }}
    >
      {children}
    </CajaMenorContext.Provider>
  );
};

export const useCajaMenor = () => {
  const context = useContext(CajaMenorContext);
  if (!context) {
    throw new Error('useCajaMenor must be used within a CajaMenorProvider');
  }
  return context;
};
