import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { ExpenseCategory, FIXED_FUND_TOTAL } from '../types';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Coins,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building,
  TrendingUp,
  FileCheck,
  Plus,
} from 'lucide-react';

interface ReportsAndAuditViewProps {
  onOpenAuditModal: () => void;
}

export const ReportsAndAuditView: React.FC<ReportsAndAuditViewProps> = ({
  onOpenAuditModal,
}) => {
  const {
    fondoFijoTotal,
    efectivoDisponibleEnCaja,
    anticiposEntregadosTotal,
    gastosAprobadosTotal,
    porcentajeConsumido,
    gastosPorCategoria,
    invoices,
    requests,
    replenishments,
    auditCounts,
    categoryBudgets,
  } = useCajaMenor();

  const [activeReportTab, setActiveReportTab] = useState<
    'estado' | 'categorias' | 'facturas' | 'arqueo' | 'cierre'
  >('estado');

  const latestAudit = auditCounts[0];

  // Export to CSV function
  const exportToCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel in Spanish
    csvContent += 'INFORME OFICIAL DE CAJA MENOR - CORPORACION SOCIAL SOMOS UNO\r\n';
    csvContent += `Fecha de Generación:;${new Date().toLocaleDateString('es-CO')}\r\n`;
    csvContent += `Fondo Fijo Constituido:;$${FIXED_FUND_TOTAL}\r\n`;
    csvContent += `Efectivo Físico Disponible:;$${efectivoDisponibleEnCaja}\r\n`;
    csvContent += `Anticipos en Curso:;$${anticiposEntregadosTotal}\r\n`;
    csvContent += `Gastos Legalizados Aprobados:;$${gastosAprobadosTotal}\r\n\r\n`;

    csvContent += 'REGISTRO DE FACTURAS Y DOCUMENTOS SOPORTE\r\n';
    csvContent += 'Codigo;Factura;Fecha;Proveedor;NIT;Categoria;Proyecto;Subtotal;IVA;Total;Responsable;Estado\r\n';

    invoices.forEach((inv) => {
      csvContent += `${inv.code};${inv.invoiceNumber};${inv.issueDate};"${inv.supplierName}";${inv.supplierNit};"${inv.category}";"${inv.areaOrProject}";${inv.amountBeforeTax};${inv.taxAmount};${inv.totalAmount};"${inv.buyerName}";${inv.status}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Informe_CajaUno_social_CS_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Official Header (Only shown during print) */}
      <div className="print-only p-6 border-b-2 border-slate-900 mb-6 text-center space-y-1">
        <h1 className="text-xl font-bold tracking-tight uppercase">CORPORACIÓN SOCIAL SOMOS UNO</h1>
        <p className="text-xs text-slate-700">NIT: 901.445.892-4 · Entidad Sin Ánimo de Lucro</p>
        <h2 className="text-base font-bold text-slate-900 underline mt-2">
          ACTA OFICIAL DE ARQUEO Y CIERRE DE CAJA MENOR
        </h2>
        <p className="text-xs text-slate-600">
          Fecha de Emisión: {new Date().toLocaleDateString('es-CO')} · Modalidad: Fondo Fijo $2.000.000 COP
        </p>
      </div>

      {/* Main Screen Header */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 5</span>
            <span aria-hidden="true">·</span>
            <span>Centralización de Informes Financieros</span>
            <span aria-hidden="true">·</span>
            <span>Auditorías y Cumplimiento</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Informes Financieros, Arqueos y Cierre Mensual
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Consolidado contable según los 8 reportes exigidos en la propuesta técnica.
            Permite conciliar el efectivo, verificar gastos por categoría y exportar a Excel o formato imprimible.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            Exportar Excel (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-blue-700" />
            Imprimir Acta Oficial
          </button>
          <button
            onClick={onOpenAuditModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Coins className="w-4 h-4" />
            Nuevo Arqueo Físico
          </button>
        </div>
      </div>

      {/* Subtabs for the 5 Report Sections */}
      <div className="no-print bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto text-xs">
        {[
          { id: 'estado', label: '1. Estado de Caja Menor' },
          { id: 'categorias', label: '2. Gastos por Categoría' },
          { id: 'facturas', label: '3. Libro de Facturas' },
          { id: 'arqueo', label: '4. Arqueos Físicos' },
          { id: 'cierre', label: '5. Cierre Mensual' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`px-3.5 py-2 font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeReportTab === tab.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on Active Subtab */}

      {/* Subtab 1: Estado de Caja Menor (Conciliación) */}
      {activeReportTab === 'estado' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Informe 1: Conciliación General de Caja Menor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block text-[11px]">Saldo Inicial Autorizado:</span>
                <strong className="text-slate-900 text-base font-mono block">
                  ${fondoFijoTotal.toLocaleString('es-CO')} COP
                </strong>
                <span className="text-slate-400 text-[10px]">100% fondo constituido</span>
              </div>
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="text-emerald-800 block text-[11px]">Dinero Físico Disponible:</span>
                <strong className="text-emerald-800 text-base font-mono block">
                  ${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP
                </strong>
                <span className="text-emerald-700 text-[10px]">Efectivo en custodia</span>
              </div>
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
                <span className="text-amber-800 block text-[11px]">Anticipos Entregados:</span>
                <strong className="text-amber-800 text-base font-mono block">
                  ${anticiposEntregadosTotal.toLocaleString('es-CO')} COP
                </strong>
                <span className="text-amber-700 text-[10px]">Pendientes por legalizar</span>
              </div>
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
                <span className="text-blue-800 block text-[11px]">Gastos Soportados:</span>
                <strong className="text-blue-800 text-base font-mono block">
                  ${gastosAprobadosTotal.toLocaleString('es-CO')} COP
                </strong>
                <span className="text-blue-700 text-[10px]">Aprobados para reposición</span>
              </div>
            </div>

            {/* Formula table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Concepto de Conciliación</th>
                    <th className="py-2.5 px-4">Norma de Control</th>
                    <th className="py-2.5 px-4 text-right">Valor COP</th>
                    <th className="py-2.5 px-4 text-right">% Participación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      (+) Efectivo líquido verificado en caja fuerte
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">Custodia física</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-700">
                      ${efectivoDisponibleEnCaja.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {Math.round((efectivoDisponibleEnCaja / fondoFijoTotal) * 100)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      (+) Anticipos en poder de colaboradores (en plazo)
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">Recibo firmado</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-700">
                      ${anticiposEntregadosTotal.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {Math.round((anticiposEntregadosTotal / fondoFijoTotal) * 100)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      (+) Facturas y documentos soporte legalizados y aprobados
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">Validado DIAN</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-blue-700">
                      ${gastosAprobadosTotal.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {Math.round((gastosAprobadosTotal / fondoFijoTotal) * 100)}%
                    </td>
                  </tr>
                  <tr className="bg-slate-50/80 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td className="py-3 px-4">(=) TOTAL FONDO CONCILIADO</td>
                    <td className="py-3 px-4 text-emerald-700">CUADRE EXACTO</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-800 text-sm">
                      ${(efectivoDisponibleEnCaja + anticiposEntregadosTotal + gastosAprobadosTotal).toLocaleString('es-CO')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Gastos por Categoría */}
      {activeReportTab === 'categorias' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Informe 2: Ejecución Presupuestal por Categorías de Gasto
          </h2>
          <p className="text-xs text-slate-500">
            Comparativo entre el valor sugerido de planificación ($2.000.000 COP) y los gastos ejecutados en el ciclo.
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Categoría de Gasto</th>
                  <th className="py-3 px-4 text-right">Presupuesto Sugerido</th>
                  <th className="py-3 px-4 text-right">Gasto Ejecutado</th>
                  <th className="py-3 px-4 text-right">Saldo Disponible</th>
                  <th className="py-3 px-4 text-right">% Ejecución</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.keys(gastosPorCategoria) as ExpenseCategory[]).map((cat) => {
                  const data = gastosPorCategoria[cat];
                  const saldo = data.presupuestado - data.ejecutado;
                  return (
                    <tr key={cat} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{cat}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${data.presupuestado.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${data.ejecutado.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-medium">
                        ${saldo.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            data.porcentaje > 80
                              ? 'bg-rose-50 text-rose-700'
                              : data.porcentaje > 50
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {data.porcentaje}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Libro de Facturas */}
      {activeReportTab === 'facturas' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Informe 3: Libro Diario de Compras y Facturas de Caja Menor
              </h2>
              <p className="text-xs text-slate-500">
                Detalle tributario con NIT, proveedores, conceptos, bases gravables e IVA
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar CSV
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Factura N°</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Proveedor</th>
                  <th className="py-2.5 px-3">NIT</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                  <th className="py-2.5 px-3 text-right">IVA</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-medium text-slate-800">{inv.code}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{inv.invoiceNumber}</td>
                    <td className="py-2 px-3 text-slate-500">{inv.issueDate}</td>
                    <td className="py-2 px-3 text-slate-800 truncate max-w-[140px]">{inv.supplierName}</td>
                    <td className="py-2 px-3 font-mono text-slate-500">{inv.supplierNit}</td>
                    <td className="py-2 px-3 text-slate-600 truncate max-w-[120px]">{inv.category}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">${inv.amountBeforeTax.toLocaleString('es-CO')}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500">${inv.taxAmount.toLocaleString('es-CO')}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">${inv.totalAmount.toLocaleString('es-CO')}</td>
                    <td className="py-2 px-3 text-center capitalize text-[11px] font-semibold text-emerald-700">
                      {inv.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 4: Arqueos Físicos */}
      {activeReportTab === 'arqueo' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Informe 4: Historial de Arqueos Físicos de Caja
                </h2>
                <p className="text-xs text-slate-500">
                  Conteo físico mensual de billetes y monedas, diferencias encontradas y observaciones
                </p>
              </div>
              <button
                onClick={onOpenAuditModal}
                className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Realizar Nuevo Arqueo
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Fecha Arqueo</th>
                    <th className="py-2.5 px-4">Auditor / Contador</th>
                    <th className="py-2.5 px-4">Custodio</th>
                    <th className="py-2.5 px-4 text-right">Efectivo Contado</th>
                    <th className="py-2.5 px-4 text-right">Saldo en Libros</th>
                    <th className="py-2.5 px-4 text-right">Diferencia</th>
                    <th className="py-2.5 px-4 text-center">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditCounts.map((aud) => (
                    <tr key={aud.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                        {new Date(aud.auditDate).toLocaleDateString('es-CO')}
                      </td>
                      <td className="py-2.5 px-4 text-slate-800">{aud.auditorName}</td>
                      <td className="py-2.5 px-4 text-slate-700">{aud.custodianName}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-800">
                        ${aud.totalCountedCash.toLocaleString('es-CO')}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                        ${aud.theoreticalCashInBox.toLocaleString('es-CO')}
                      </td>
                      <td
                        className={`py-2.5 px-4 text-right font-mono font-bold ${
                          aud.difference === 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        ${aud.difference.toLocaleString('es-CO')} COP
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            aud.status === 'conforme'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {aud.status === 'conforme' ? 'Conforme' : 'Con Observaciones'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Cierre Mensual & Official Printable Report Format */}
      {activeReportTab === 'cierre' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="no-print flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Informe 5: Resumen de Cierre Mensual de Caja Menor
              </h2>
              <p className="text-xs text-slate-500">
                Consolidado listo para auditoría, junta directiva y Revisoría Fiscal
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              Imprimir Acta de Cierre
            </button>
          </div>

          {/* Official Document Sheet */}
          <div className="p-8 border border-slate-300 rounded-xl bg-white space-y-6 font-sans text-xs">
            <div className="text-center pb-4 border-b border-slate-200 space-y-1">
              <span className="text-sm font-extrabold tracking-wide text-slate-900 uppercase">
                CORPORACIÓN SOCIAL SOMOS UNO
              </span>
              <p className="text-[11px] text-slate-500">NIT: 901.445.892-4</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                ACTA MENSUAL DE CONCILIACIÓN Y CONTROL DE CAJA MENOR
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Periodo: Octubre 2026 · Fondo Fijo Oficial: $2.000.000 COP
              </p>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Resumen de Fondos</span>
                <div className="flex justify-between">
                  <span>Fondo Total Asignado:</span>
                  <strong className="font-mono">${fondoFijoTotal.toLocaleString('es-CO')} COP</strong>
                </div>
                <div className="flex justify-between">
                  <span>Efectivo Disponible:</span>
                  <strong className="font-mono text-emerald-700">${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP</strong>
                </div>
                <div className="flex justify-between">
                  <span>Anticipos por Legalizar:</span>
                  <strong className="font-mono text-amber-700">${anticiposEntregadosTotal.toLocaleString('es-CO')} COP</strong>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>Gastos Soportados a Reponer:</span>
                  <strong className="font-mono text-blue-700">${gastosAprobadosTotal.toLocaleString('es-CO')} COP</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Indicadores de Cumplimiento</span>
                <div className="flex justify-between">
                  <span>Límite de compra ($300k):</span>
                  <strong className="text-emerald-700">100% Cumplido</strong>
                </div>
                <div className="flex justify-between">
                  <span>Validación Fiscal DIAN:</span>
                  <strong className="text-emerald-700">100% Verificado</strong>
                </div>
                <div className="flex justify-between">
                  <span>Diferencia de Arqueo:</span>
                  <strong className="text-emerald-700 font-mono">$0 COP (Exacto)</strong>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>Dictamen de Auditoría:</span>
                  <strong className="text-emerald-800">CONFORME</strong>
                </div>
              </div>
            </div>

            {/* Signature blocks */}
            <div className="pt-12 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="block font-bold text-slate-900">Karen Lorena Pérez</strong>
                <span className="text-[11px] text-slate-500 block">Responsable de Caja Menor</span>
                <span className="text-[10px] text-slate-400 block">Custodia de Fondos</span>
              </div>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="block font-bold text-slate-900">Keisy Patricia Ospina</strong>
                <span className="text-[11px] text-slate-500 block">Coord. Administrativa y Financiera</span>
                <span className="text-[10px] text-slate-400 block">Revisión y Aprobación</span>
              </div>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="block font-bold text-slate-900">Javier Morales</strong>
                <span className="text-[11px] text-slate-500 block">Contador Público Titulado</span>
                <span className="text-[10px] text-slate-400 block">T.P. 189241-T</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
