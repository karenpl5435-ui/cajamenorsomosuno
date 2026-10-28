export type UserRole = 'gerente' | 'coordinador' | 'custodio' | 'colaborador' | 'contador';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatar: string;
  email: string;
}

export type ExpenseCategory =
  | 'Papelería y útiles'
  | 'Transporte y movilización'
  | 'Materiales para actividades comunitarias'
  | 'Aseo y cafetería'
  | 'Impresiones y fotocopias'
  | 'Gastos imprevistos autorizados';

export const INITIAL_CATEGORY_BUDGETS: Record<ExpenseCategory, number> = {
  'Papelería y útiles': 300000,
  'Transporte y movilización': 400000,
  'Materiales para actividades comunitarias': 500000,
  'Aseo y cafetería': 250000,
  'Impresiones y fotocopias': 150000,
  'Gastos imprevistos autorizados': 400000,
};

export const FIXED_FUND_TOTAL = 2000000; // $2.000.000 COP
export const MAX_PURCHASE_LIMIT = 300000; // $300.000 COP

export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada' | 'entregada' | 'legalizada';

export interface CashRequest {
  id: string;
  code: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  areaOrProject: string;
  justification: string;
  estimatedAmount: number;
  category: ExpenseCategory;
  status: RequestStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  deliveredBy?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
  associatedInvoiceId?: string;
}

export type DocumentType =
  | 'factura_electronica'
  | 'documento_soporte'
  | 'documento_equivalente'
  | 'comprobante_caja';

export type InvoiceStatus =
  | 'registrada'
  | 'en_revision'
  | 'aprobada'
  | 'rechazada'
  | 'pendiente_correccion';

export interface InvoiceDocument {
  id: string;
  code: string;
  requestId: string;
  requestCode: string;
  invoiceNumber: string;
  issueDate: string;
  supplierName: string;
  supplierNit: string;
  concept: string;
  category: ExpenseCategory;
  amountBeforeTax: number;
  taxAmount: number;
  totalAmount: number;
  buyerName: string;
  areaOrProject: string;
  documentType: DocumentType;
  supportFileName?: string;
  xmlFileName?: string;
  supportFileType?: 'pdf' | 'image' | 'xml';
  status: InvoiceStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  dianValidationStatus?: 'valido' | 'en_proceso' | 'no_requerido';
}

export interface FundReplenishment {
  id: string;
  code: string;
  requestDate: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: 'solicitada' | 'aprobada' | 'ejecutada';
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  paymentMethod?: string;
  bankReference?: string;
  invoiceCount: number;
  invoiceIds: string[];
  notes?: string;
}

export interface CashAuditCount {
  id: string;
  auditDate: string;
  auditorName: string;
  custodianName: string;
  bills: {
    100000: number;
    50000: number;
    20000: number;
    10000: number;
    5000: number;
    2000: number;
  };
  coins: {
    1000: number;
    500: number;
    200: number;
    100: number;
    50: number;
  };
  totalCountedCash: number;
  theoreticalCashInBox: number;
  pendingAdvancesAmount: number;
  approvedLegalizedAmount: number;
  difference: number; // positive = sobrante, negative = faltante, 0 = exacto
  observations: string;
  status: 'conforme' | 'con_observaciones' | 'diferencia_critica';
}

export interface PHVAItem {
  id: string;
  stage: 'P' | 'H' | 'V' | 'A';
  stageName: string;
  title: string;
  description: string;
  responsible: string;
  status: 'completado' | 'en_progreso' | 'programado';
  frequency: string;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  target: string;
  details: string;
}
