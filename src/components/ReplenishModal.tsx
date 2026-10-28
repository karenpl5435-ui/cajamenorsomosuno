import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { FIXED_FUND_TOTAL } from '../types';
import {
  X,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Building,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

interface ReplenishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReplenishModal: React.FC<ReplenishModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    invoices,
    efectivoDisponibleEnCaja,
    requestReplenishment,
    executeReplenishment,
    replenishments,
  } = useCajaMenor();

  const approvedInvoices = invoices.filter((i) => i.status === 'aprobada');
  const totalAmountToReimburse = approvedInvoices.reduce((s, i) => s + i.totalAmount, 0);

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancolombia Cta Cte 451-928192-01');
  const [bankReference, setBankReference] = useState(`TR-${Math.floor(Math.random() * 900000 + 100000)}`);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestReplenishment(notes.trim() || undefined);
    if (res.success) {
      setStatusMessage(res.message);
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1500);
    }
  };

  // Find any pending replenishment waiting for Gerente approval
  const pendingReplenishment = replenishments.find((r) => r.status === 'solicitada');

  const handleImmediateExecution = (replenishmentId: string) => {
    executeReplenishment(replenishmentId, paymentMethod, bankReference);
    setStatusMessage('¡Fondo restablecido exitosamente a $2.000.000 COP!');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Reposición del Fondo de Caja Menor</h2>
              <p className="text-xs text-slate-300">
                Paso 9 del ciclo: Restablecimiento del fondo fijo a $2.000.000 COP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Mathematical Reconciliation Summary */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide block">
              Liquidación de Reposición (Regla del Fondo Fijo)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-white border border-emerald-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Efectivo Actual:</span>
                <strong className="text-slate-800 font-mono text-sm">
                  ${efectivoDisponibleEnCaja.toLocaleString('es-CO')}
                </strong>
              </div>
              <div className="p-2.5 bg-white border border-emerald-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Gastos a Reintegrar:</span>
                <strong className="text-emerald-700 font-mono text-sm">
                  +${totalAmountToReimburse.toLocaleString('es-CO')}
                </strong>
              </div>
              <div className="p-2.5 bg-white border border-emerald-300 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Fondo Restablecido:</span>
                <strong className="text-emerald-800 font-mono text-sm">
                  = ${FIXED_FUND_TOTAL.toLocaleString('es-CO')}
                </strong>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Al procesar la reposición, la tesorería gira a la persona custodio de la caja menor el valor exacto de los gastos aprobados con facturas legales, restableciendo el saldo en efectivo al límite estipulado.
            </p>
          </div>

          {/* Table of invoices to reimburse */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Facturas Soportadas a Reintegrar ({approvedInvoices.length})
              </span>
              <span className="text-slate-500 font-mono">
                Total: ${totalAmountToReimburse.toLocaleString('es-CO')} COP
              </span>
            </div>

            {approvedInvoices.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No hay facturas aprobadas pendientes de reposición. Registre o apruebe gastos primero en el módulo de Facturas.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="py-2 px-3">Código</th>
                      <th className="py-2 px-3">Proveedor</th>
                      <th className="py-2 px-3">Categoría</th>
                      <th className="py-2 px-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvedInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">{inv.code}</td>
                        <td className="py-2 px-3 text-slate-900 truncate max-w-[150px]">{inv.supplierName}</td>
                        <td className="py-2 px-3 text-slate-600">{inv.category}</td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                          ${inv.totalAmount.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending approval section or new request */}
          {pendingReplenishment ? (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  Solicitud en Trámite: {pendingReplenishment.code}
                </span>
                <span className="text-xs text-amber-700 font-mono font-semibold">
                  ${pendingReplenishment.requestedAmount.toLocaleString('es-CO')} COP
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Solicitada por {pendingReplenishment.requestedBy}. Esperando desembolso de Gerencia.
              </p>

              {(currentUser.role === 'gerente' || currentUser.role === 'coordinador') ? (
                <div className="pt-2 border-t border-amber-200 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Medio de Pago</label>
                      <input
                        type="text"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">N° Comprobante / Transf.</label>
                      <input
                        type="text"
                        value={bankReference}
                        onChange={(e) => setBankReference(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleImmediateExecution(pendingReplenishment.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Autorizar y Desembolsar Reposición (Restablecer Fondo)
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  Para autorizar el desembolso cambie al rol de Gerente o Coordinadora desde la barra superior.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notas u Observaciones para Gerencia (opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre el periodo de gastos y justificación de la reposición..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={totalAmountToReimburse <= 0}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generar Solicitud de Reposición
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
