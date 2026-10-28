import React from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { FIXED_FUND_TOTAL, MAX_PURCHASE_LIMIT } from '../types';
import {
  Wallet,
  Coins,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  AlertTriangle,
  Building2,
  UserCheck,
} from 'lucide-react';

interface FundAdminViewProps {
  onOpenReplenishModal: () => void;
  onOpenAuditModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const FundAdminView: React.FC<FundAdminViewProps> = ({
  onOpenReplenishModal,
  onOpenAuditModal,
  onNavigateTab,
}) => {
  const {
    currentUser,
    fondoFijoTotal,
    efectivoDisponibleEnCaja,
    anticiposEntregadosTotal,
    gastosAprobadosTotal,
    porcentajeConsumido,
    replenishments,
    requests,
    invoices,
  } = useCajaMenor();

  const activeAdvances = requests.filter((r) => r.status === 'entregada');
  const approvedInvoicesPending = invoices.filter((i) => i.status === 'aprobada');

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 3</span>
            <span aria-hidden="true">·</span>
            <span>Custodia y Reposición de Fondos</span>
            <span aria-hidden="true">·</span>
            <span>Corporación Social Somos Uno</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administración del Fondo Fijo y Reposiciones
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Supervisión integral de los $2.000.000 COP asignados por Gerencia. Garantiza que el efectivo físico,
            los anticipos activos y los gastos soportados sumen exactamente el fondo fijo institucional.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAuditModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4 text-amber-600" />
            Arqueo Físico
          </button>
          <button
            onClick={onOpenReplenishModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Tramitar Reposición
          </button>
        </div>
      </div>

      {/* Fundamental Parameters of the Fund (Page 4 table from proposal) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Parámetros Oficiales del Fondo de Caja Menor (Aprobados)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Fondo Inicial Autorizado:</span>
            <strong className="text-slate-900 text-sm font-mono block">
              ${FIXED_FUND_TOTAL.toLocaleString('es-CO')} COP
            </strong>
            <span className="text-slate-400 text-[10px]">Modalidad Fondo Fijo</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Tope Máximo por Compra:</span>
            <strong className="text-slate-900 text-sm font-mono block">
              ${MAX_PURCHASE_LIMIT.toLocaleString('es-CO')} COP
            </strong>
            <span className="text-slate-400 text-[10px]">Restricción del sistema</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Frecuencia de Arqueo Físico:</span>
            <strong className="text-slate-900 text-sm block">Mensual Obligatorio</strong>
            <span className="text-slate-400 text-[10px]">Con presencia del Contador</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Responsable de Custodia:</span>
            <strong className="text-slate-900 text-sm block truncate">Karen Lorena Pérez</strong>
            <span className="text-slate-400 text-[10px]">Designada por Gerencia</span>
          </div>
        </div>
      </div>

      {/* Triple Conciliation Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box 1: Efectivo en Custodia */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">1. Efectivo Físico en Caja</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            ${efectivoDisponibleEnCaja.toLocaleString('es-CO')}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dinero líquido resguardado en caja fuerte disponible para nuevos desembolsos autorizados.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Custodia: Karen Lorena P.</span>
            <button
              onClick={onOpenAuditModal}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Realizar Arqueo →
            </button>
          </div>
        </div>

        {/* Box 2: Anticipos en Tránsito */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">2. Anticipos en Tránsito</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">
            ${anticiposEntregadosTotal.toLocaleString('es-CO')}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Efectivo entregado a colaboradores para compras en ejecución, pendiente de legalización formal con facturas.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">{activeAdvances.length} anticipos en curso</span>
            <button
              onClick={() => onNavigateTab('solicitudes')}
              className="text-amber-700 font-semibold hover:underline"
            >
              Ver Solicitudes →
            </button>
          </div>
        </div>

        {/* Box 3: Gastos Soportados a Reponer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">3. Facturas Aprobadas (A Reponer)</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-800">
            ${gastosAprobadosTotal.toLocaleString('es-CO')}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Compras debidamente legalizadas con factura electrónica o documento soporte DIAN listas para cobro ante tesorería.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">{approvedInvoicesPending.length} facturas soportadas</span>
            <button
              onClick={onOpenReplenishModal}
              className="text-blue-700 font-semibold hover:underline"
            >
              Liquidar Reposición →
            </button>
          </div>
        </div>
      </div>

      {/* Active Advances Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Control de Anticipos Entregados (Seguimiento de Legalización)
            </h2>
            <p className="text-xs text-slate-500">
              Plazo normativo: Máximo 48 horas hábiles para presentar facturas de soporte
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-700">
            Total en manos de colaboradores: ${anticiposEntregadosTotal.toLocaleString('es-CO')} COP
          </span>
        </div>

        {activeAdvances.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No hay anticipos pendientes de legalización en este momento. Todos los desembolsos cuentan con su respectiva factura o el dinero permanece en caja.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Colaborador</th>
                  <th className="py-2.5 px-3">Proyecto</th>
                  <th className="py-2.5 px-3">Fecha Entrega</th>
                  <th className="py-2.5 px-3 text-right">Valor Entregado</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeAdvances.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{adv.code}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{adv.requesterName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{adv.areaOrProject}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {adv.deliveredAt ? new Date(adv.deliveredAt).toLocaleDateString('es-CO') : 'Hoy'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                      ${adv.estimatedAmount.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onNavigateTab('facturas')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                      >
                        Legalizar Factura →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Replenishments History */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Historial de Reposiciones del Fondo Fijo
            </h2>
            <p className="text-xs text-slate-500">
              Registro histórico de reintegros bancarios que restablecen la caja a $2.000.000 COP
            </p>
          </div>
          <button
            onClick={onOpenReplenishModal}
            className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
          >
            Nueva Reposición →
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
              <tr>
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Fecha Solicitud</th>
                <th className="py-2.5 px-3">Solicitante</th>
                <th className="py-2.5 px-3">Autorizado Por</th>
                <th className="py-2.5 px-3">Medio de Pago / Ref.</th>
                <th className="py-2.5 px-3 text-right">Valor Repuesto</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {replenishments.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{rep.code}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {new Date(rep.requestDate).toLocaleDateString('es-CO')}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{rep.requestedBy}</td>
                  <td className="py-2.5 px-3 text-slate-700">{rep.approvedBy || 'En trámite'}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] truncate max-w-[200px]">
                    {rep.paymentMethod || 'Pendiente'} {rep.bankReference ? `(${rep.bankReference})` : ''}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ${rep.requestedAmount.toLocaleString('es-CO')}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        rep.status === 'ejecutada'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rep.status === 'ejecutada' ? 'Fondo Restablecido' : 'En Trámite'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
