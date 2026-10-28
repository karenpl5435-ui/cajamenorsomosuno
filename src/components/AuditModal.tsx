import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import {
  X,
  Coins,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileCheck,
} from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BILL_VALUES = [100000, 50000, 20000, 10000, 5000, 2000] as const;
const COIN_VALUES = [1000, 500, 200, 100, 50] as const;

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    fondoFijoTotal,
    efectivoDisponibleEnCaja,
    anticiposEntregadosTotal,
    gastosAprobadosTotal,
    createAuditCount,
  } = useCajaMenor();

  // Denominations state
  const [bills, setBills] = useState<Record<number, number>>({
    100000: Math.floor(efectivoDisponibleEnCaja / 100000),
    50000: Math.floor((efectivoDisponibleEnCaja % 100000) / 50000),
    20000: Math.floor((efectivoDisponibleEnCaja % 50000) / 20000),
    10000: 0,
    5000: 0,
    2000: 0,
  });

  const [coins, setCoins] = useState<Record<number, number>>({
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
  });

  const [auditorName, setAuditorName] = useState(currentUser.name);
  const [custodianName, setCustodianName] = useState('Karen Lorena Pérez');
  const [observations, setObservations] = useState(
    'Arqueo físico mensual regular realizado conforme a la propuesta y manual de control interno de la Corporación Social Somos Uno.'
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Totals calculation
  const totalBills = BILL_VALUES.reduce((sum, v) => sum + v * (bills[v] || 0), 0);
  const totalCoins = COIN_VALUES.reduce((sum, v) => sum + v * (coins[v] || 0), 0);
  const totalPhysicalCash = totalBills + totalCoins;

  // Triple Reconciliation Formula from proposal page 5:
  // Fondo Fijo ($2.000.000) = Efectivo Físico + Anticipos por Legalizar + Gastos Aprobados Soportados
  const totalConciliado = totalPhysicalCash + anticiposEntregadosTotal + gastosAprobadosTotal;
  const difference = totalPhysicalCash - efectivoDisponibleEnCaja;

  let auditStatus: 'conforme' | 'con_observaciones' | 'diferencia_critica' = 'conforme';
  if (difference !== 0) {
    auditStatus = Math.abs(difference) > 10000 ? 'diferencia_critica' : 'con_observaciones';
  }

  const handleBillChange = (val: number, count: number) => {
    setBills((prev) => ({ ...prev, [val]: Math.max(0, count) }));
  };

  const handleCoinChange = (val: number, count: number) => {
    setCoins((prev) => ({ ...prev, [val]: Math.max(0, count) }));
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    createAuditCount({
      auditDate: new Date().toISOString(),
      auditorName,
      custodianName,
      bills: bills as any,
      coins: coins as any,
      totalCountedCash: totalPhysicalCash,
      theoreticalCashInBox: efectivoDisponibleEnCaja,
      pendingAdvancesAmount: anticiposEntregadosTotal,
      approvedLegalizedAmount: gastosAprobadosTotal,
      difference,
      observations: observations.trim(),
      status: auditStatus,
    });

    setSuccessMessage('¡Acta de Arqueo Físico registrada y firmada en el sistema!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Arqueo Físico Mensual de Caja Menor</h2>
              <p className="text-xs text-slate-300">
                Paso 10 del ciclo: Conteo físico de dinero y conciliación contra soportes
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
        <form onSubmit={handleSaveAudit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Stats Reconciliation Header */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Fondo Autorizado:</span>
              <strong className="text-slate-900 font-mono text-sm block">
                ${fondoFijoTotal.toLocaleString('es-CO')} COP
              </strong>
              <span className="text-slate-400 text-[10px]">Fondo fijo legal</span>
            </div>
            <div>
              <span className="text-slate-500 block">Efectivo Teórico en Libros:</span>
              <strong className="text-slate-900 font-mono text-sm block">
                ${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP
              </strong>
              <span className="text-slate-400 text-[10px]">Saldo que debe existir</span>
            </div>
            <div>
              <span className="text-slate-500 block">Efectivo Físico Contado:</span>
              <strong className="text-emerald-700 font-mono text-sm block font-bold">
                ${totalPhysicalCash.toLocaleString('es-CO')} COP
              </strong>
              <span className="text-slate-400 text-[10px]">Suma de billetes y monedas</span>
            </div>
            <div>
              <span className="text-slate-500 block">Diferencia de Arqueo:</span>
              <strong
                className={`font-mono text-sm block font-bold ${
                  difference === 0
                    ? 'text-emerald-700'
                    : difference > 0
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {difference === 0
                  ? '$0 COP (Exacto)'
                  : `${difference > 0 ? '+' : ''}$${difference.toLocaleString('es-CO')} COP (${
                      difference > 0 ? 'Sobrante' : 'Faltante'
                    })`}
              </strong>
              <span className="text-slate-400 text-[10px]">
                {difference === 0 ? 'Conforme 100%' : 'Requiere justificación'}
              </span>
            </div>
          </div>

          {/* Denominations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bills */}
            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-slate-800">Billetes en Custodia</span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  Subtotal: ${totalBills.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="space-y-2">
                {BILL_VALUES.map((val) => (
                  <div key={val} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 w-24">
                      ${val.toLocaleString('es-CO')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">x</span>
                      <input
                        type="number"
                        min={0}
                        value={bills[val] || 0}
                        onChange={(e) => handleBillChange(val, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center font-mono border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                      <span className="font-mono font-semibold text-slate-800 w-24 text-right">
                        = ${((bills[val] || 0) * val).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coins */}
            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-slate-800">Monedas en Custodia</span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  Subtotal: ${totalCoins.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="space-y-2">
                {COIN_VALUES.map((val) => (
                  <div key={val} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 w-24">
                      ${val.toLocaleString('es-CO')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">x</span>
                      <input
                        type="number"
                        min={0}
                        value={coins[val] || 0}
                        onChange={(e) => handleCoinChange(val, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center font-mono border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                      <span className="font-mono font-semibold text-slate-800 w-24 text-right">
                        = ${((coins[val] || 0) * val).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conciliation Formula Breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <span className="font-bold text-slate-800 block">
              Conciliación Triple de Caja Menor (Comprobación Fiscal)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">1. Efectivo Contado:</span>
                <strong className="font-mono">${totalPhysicalCash.toLocaleString('es-CO')} COP</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">2. Anticipos en Tránsito:</span>
                <strong className="font-mono">+${anticiposEntregadosTotal.toLocaleString('es-CO')} COP</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">3. Facturas Soportadas:</span>
                <strong className="font-mono">+${gastosAprobadosTotal.toLocaleString('es-CO')} COP</strong>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-semibold">
              <span className="text-slate-700">Total Fondo Conciliado (1 + 2 + 3):</span>
              <span className="font-mono text-emerald-800 text-sm">
                ${totalConciliado.toLocaleString('es-CO')} COP / ${fondoFijoTotal.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          {/* Auditor and Custodian signers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auditor / Revisor Contable *
              </label>
              <input
                type="text"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Custodio Responsable de Caja *
              </label>
              <input
                type="text"
                value={custodianName}
                onChange={(e) => setCustodianName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones y Dictamen del Arqueo
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              Guardar y Certificar Arqueo Físico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
