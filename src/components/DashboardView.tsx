import React from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { ExpenseCategory, FIXED_FUND_TOTAL, MAX_PURCHASE_LIMIT } from '../types';
import {
  Wallet,
  Coins,
  Receipt,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  FileCheck2,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Building2,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenRequestModal: () => void;
  onOpenInvoiceModal: () => void;
  onOpenReplenishModal: () => void;
  onOpenAuditModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenRequestModal,
  onOpenInvoiceModal,
  onOpenReplenishModal,
  onOpenAuditModal,
}) => {
  const {
    currentUser,
    fondoFijoTotal,
    efectivoDisponibleEnCaja,
    anticiposEntregadosTotal,
    gastosAprobadosTotal,
    porcentajeConsumido,
    gastosPorCategoria,
    systemAlerts,
    requests,
    invoices,
    logs,
  } = useCajaMenor();

  const pctDisponible = Math.round((efectivoDisponibleEnCaja / fondoFijoTotal) * 100);
  const pctAnticipos = Math.round((anticiposEntregadosTotal / fondoFijoTotal) * 100);
  const pctGastos = Math.round((gastosAprobadosTotal / fondoFijoTotal) * 100);

  const pendingRequests = requests.filter((r) => r.status === 'pendiente');
  const deliveredRequests = requests.filter((r) => r.status === 'entregada');
  const reviewingInvoices = invoices.filter(
    (i) => i.status === 'en_revision' || i.status === 'registrada'
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Context Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Corporación Social Somos Uno</span>
            <span aria-hidden="true">·</span>
            <span>Sistema Integral de Caja Menor</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">Fondo Fijo $2.000.000 COP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Panel de Control y Trazabilidad Financiera
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Bienvenido, <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.roleTitle}).
            Supervisión en tiempo real del fondo fijo, autorizaciones, compras con límite de $300.000 COP y arqueos mensuales.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenRequestModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Nueva Solicitud
          </button>
          <button
            onClick={onOpenInvoiceModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            Registrar Factura
          </button>
          <button
            onClick={onOpenAuditModal}
            className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4 text-amber-600" />
            Arqueo Físico
          </button>
          <button
            onClick={onOpenReplenishModal}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Solicitar Reposición
          </button>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="space-y-2">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs transition-colors ${
                alert.type === 'danger' || alert.type === 'warning'
                  ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                  : 'bg-blue-50/70 border-blue-200 text-blue-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 ${
                    alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                  }`}
                />
                <div>
                  <strong className="font-semibold block">{alert.title}</strong>
                  <span className="text-slate-600">{alert.message}</span>
                </div>
              </div>
              {alert.actionTab && (
                <button
                  onClick={() => onNavigateTab(alert.actionTab!)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1"
                >
                  Ver detalles
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4 Core Financial Metric Cards (Strictly aligned to page 2 & 5 of the proposal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fondo Fijo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Fondo Fijo Constituido</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              ${fondoFijoTotal.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-500 font-sans">
              Tope máx. por compra: <strong className="text-slate-700 font-mono">${MAX_PURCHASE_LIMIT.toLocaleString('es-CO')}</strong>
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Modalidad Fondo Fijo</span>
            <span className="font-semibold text-emerald-700">100% Auditado</span>
          </div>
        </div>

        {/* Card 2: Efectivo Físico Disponible */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Efectivo Disponible en Caja</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-700">
              ${efectivoDisponibleEnCaja.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-500 font-sans">
              {pctDisponible}% de liquidez física para compras urgentes
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>En custodia de Tesorería</span>
            <button
              onClick={onOpenAuditModal}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Hacer Arqueo →
            </button>
          </div>
        </div>

        {/* Card 3: Anticipos Entregados en Curso */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Anticipos en Manos de Equipo</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-700">
              ${anticiposEntregadosTotal.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-500 font-sans">
              {deliveredRequests.length} solicitud(es) entregada(s) por legalizar
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Plazo máx: 48 horas</span>
            <button
              onClick={() => onNavigateTab('facturas')}
              className="text-amber-700 font-semibold hover:underline"
            >
              Legalizar →
            </button>
          </div>
        </div>

        {/* Card 4: Gastos Legalizados Aprobados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Gastos Aprobados a Reponer</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-blue-800">
              ${gastosAprobadosTotal.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-500 font-sans">
              {pctGastos}% del fondo soportado con facturas
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Soportes validados DIAN</span>
            <button
              onClick={onOpenReplenishModal}
              className="text-blue-700 font-semibold hover:underline"
            >
              Reponer Fondo →
            </button>
          </div>
        </div>
      </div>

      {/* Triple Conciliation Status Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Estado de Conciliación Matemática del Fondo Fijo ($2.000.000 COP)
            </h2>
            <p className="text-xs text-slate-500">
              Efectivo Físico (${efectivoDisponibleEnCaja.toLocaleString('es-CO')}) + Anticipos (${anticiposEntregadosTotal.toLocaleString('es-CO')}) + Gastos Aprobados (${gastosAprobadosTotal.toLocaleString('es-CO')}) = Fondo Fijo ($2.000.000 COP)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            Consumo total: {porcentajeConsumido}%
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${pctDisponible}%` }}
            className="bg-emerald-500 h-full transition-all duration-300"
            title={`Efectivo Disponible: $${efectivoDisponibleEnCaja.toLocaleString('es-CO')} (${pctDisponible}%)`}
          />
          <div
            style={{ width: `${pctAnticipos}%` }}
            className="bg-amber-400 h-full transition-all duration-300"
            title={`Anticipos en Curso: $${anticiposEntregadosTotal.toLocaleString('es-CO')} (${pctAnticipos}%)`}
          />
          <div
            style={{ width: `${pctGastos}%` }}
            className="bg-blue-600 h-full transition-all duration-300"
            title={`Gastos Soportados: $${gastosAprobadosTotal.toLocaleString('es-CO')} (${pctGastos}%)`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600">
              Efectivo Disponible: <strong className="text-slate-900 font-mono">${efectivoDisponibleEnCaja.toLocaleString('es-CO')}</strong> ({pctDisponible}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-600">
              Anticipos por Legalizar: <strong className="text-slate-900 font-mono">${anticiposEntregadosTotal.toLocaleString('es-CO')}</strong> ({pctAnticipos}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
            <span className="text-slate-600">
              Gastos Listos para Reponer: <strong className="text-slate-900 font-mono">${gastosAprobadosTotal.toLocaleString('es-CO')}</strong> ({pctGastos}%)
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Category Budgets vs Recent Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Category Budget Execution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ejecución Presupuestal por Categoría
              </h2>
              <p className="text-xs text-slate-500">
                Distribución sugerida aprobada en la propuesta técnica (Página 4)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('informes')}
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              Ver Informe
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {(Object.keys(gastosPorCategoria) as ExpenseCategory[]).map((cat) => {
              const data = gastosPorCategoria[cat];
              const isOver = data.ejecutado > data.presupuestado;
              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-600">
                      <strong className="text-slate-900">${data.ejecutado.toLocaleString('es-CO')}</strong> / ${data.presupuestado.toLocaleString('es-CO')}
                      <span className={`ml-1.5 font-bold ${isOver ? 'text-rose-600' : 'text-slate-500'}`}>
                        ({data.porcentaje}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, data.porcentaje)}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : data.porcentaje > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: The 10 Steps of the Petty Cash Cycle */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Flujo Paso a Paso de Caja Menor (Somos Uno)
              </h2>
              <p className="text-xs text-slate-500">
                Garantiza que ningún dinero salga sin solicitud previa ni factura válida
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('phva')}
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              Ciclo PHVA
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1-2
              </span>
              <div>
                <span className="font-bold text-slate-900 block">Constitución & Solicitud de Dinero</span>
                <p className="text-slate-600 text-[11px]">
                  Fondo de $2.000.000 COP activo. Colaboradores registran requerimientos con tope de $300.000 COP.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3-5
              </span>
              <div>
                <span className="font-bold text-slate-900 block">Revisión, Autorización & Entrega</span>
                <p className="text-slate-600 text-[11px]">
                  Coordinación aprueba con trazabilidad de firma. Custodio entrega efectivo y registra anticipo.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                6-8
              </span>
              <div>
                <span className="font-bold text-slate-900 block">Compra, Legalización & Verificación DIAN</span>
                <p className="text-slate-600 text-[11px]">
                  Carga de factura electrónica / documento soporte con XML/PDF y detección de duplicados.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                9-10
              </span>
              <div>
                <span className="font-bold text-slate-900 block">Reposición del Fondo & Arqueo Mensual</span>
                <p className="text-slate-600 text-[11px]">
                  Reintegro bancario por los gastos soportados para volver a $2.000.000 y conteo físico de monedas y billetes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Audit Stream */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Historial de Auditoría y Trazabilidad Reciente
            </h2>
            <p className="text-xs text-slate-500">
              Registro inmutable de quién creó, autorizó, entregó o legalizó operaciones
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{logs.length} registros en bitácora</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
          {logs.slice(0, 8).map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{log.action}</span>
                  <span className="text-slate-400 font-mono text-[11px]">[{log.target}]</span>
                </div>
                <p className="text-slate-600">{log.details}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Por: <strong>{log.userName}</strong> ({log.userRole})</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleDateString('es-CO', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
