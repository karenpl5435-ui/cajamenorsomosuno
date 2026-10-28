import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import {
  User,
  ChevronDown,
  Plus,
  Receipt,
  FileSpreadsheet,
  Download,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRequestModal: () => void;
  onOpenInvoiceModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRequestModal,
  onOpenInvoiceModal,
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    fondoFijoTotal,
    efectivoDisponibleEnCaja,
    anticiposEntregadosTotal,
    gastosAprobadosTotal,
    resetToDemoData,
    exportDatabase,
  } = useCajaMenor();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Panel Principal' },
    { id: 'solicitudes', label: 'Solicitudes' },
    { id: 'fondo', label: 'Fondo y Reposición' },
    { id: 'facturas', label: 'Facturas y Legalización' },
    { id: 'informes', label: 'Informes y Arqueo' },
    { id: 'phva', label: 'Ciclo PHVA' },
    { id: 'normatividad', label: 'Normatividad' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Banner with Entity ID and Quick Real-time Balances */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">CORPORACIÓN SOCIAL SOMOS UNO</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">NIT 901.445.892-4</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-medium">Fondo Fijo: ${fondoFijoTotal.toLocaleString('es-CO')} COP</span>
        </div>

        <div className="flex items-center gap-4 font-mono tabular-nums">
          <span className="text-slate-300">
            Efectivo Disponible: <strong className="text-emerald-400 font-bold">${efectivoDisponibleEnCaja.toLocaleString('es-CO')}</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            Anticipos Activos: <strong className="text-amber-400 font-medium">${anticiposEntregadosTotal.toLocaleString('es-CO')}</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            Facturas por Reponer: <strong className="text-blue-400 font-medium">${gastosAprobadosTotal.toLocaleString('es-CO')}</strong>
          </span>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <button
              onClick={exportDatabase}
              title="Descargar copia de seguridad en JSON"
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Desea restablecer los datos de ejemplo del manual de caja menor?')) {
                  resetToDemoData();
                }
              }}
              title="Restablecer datos de demostración"
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm shadow-xs group-hover:border-emerald-500 transition-all">
              @
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors block leading-tight font-mono">
                CajaUno<span className="text-emerald-600">@social.CS</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-0.5 font-medium">
                Caja Menor · Corporación Social Somos Uno
              </span>
            </div>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action & User Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRequestModal}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Solicitar Dinero</span>
          </button>

          <button
            onClick={onOpenInvoiceModal}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Legalizar Factura</span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 block capitalize truncate max-w-[120px]">
                  {currentUser.roleTitle}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cambiar Perfil de Usuario
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Cambie de rol para experimentar permisos y flujos de revisión.
                  </p>
                </div>
                <div className="py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                        currentUser.id === u.id ? 'bg-emerald-50/70' : ''
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate flex-1">
                        <span className="text-xs font-semibold text-slate-900 block truncate">
                          {u.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {u.roleTitle}
                        </span>
                      </div>
                      {currentUser.id === u.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
