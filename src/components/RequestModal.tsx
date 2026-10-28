import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { ExpenseCategory, MAX_PURCHASE_LIMIT } from '../types';
import { X, AlertTriangle, CheckCircle2, DollarSign, FileText, FolderPlus } from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Papelería y útiles',
  'Transporte y movilización',
  'Materiales para actividades comunitarias',
  'Aseo y cafetería',
  'Impresiones y fotocopias',
  'Gastos imprevistos autorizados',
];

const SUGGESTED_PROJECTS = [
  'Talleres Juveniles Sector Norte',
  'Sede Principal - Servicios Generales',
  'Brigada de Salud y Acompañamiento',
  'Programa Huertas Comunitarias',
  'Encuentro de Liderazgo Femenino',
  'Gestión Social y Comunitaria General',
];

export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, efectivoDisponibleEnCaja, createRequest } = useCajaMenor();

  const [areaOrProject, setAreaOrProject] = useState(SUGGESTED_PROJECTS[0]);
  const [category, setCategory] = useState<ExpenseCategory>(CATEGORIES[0]);
  const [estimatedAmount, setEstimatedAmount] = useState<number | ''>(50000);
  const [justification, setJustification] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOverLimit = typeof estimatedAmount === 'number' && estimatedAmount > MAX_PURCHASE_LIMIT;
  const isOverBalance = typeof estimatedAmount === 'number' && estimatedAmount > efectivoDisponibleEnCaja;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!estimatedAmount || estimatedAmount <= 0) {
      setErrorMessage('Por favor ingrese un valor estimado válido.');
      return;
    }

    if (!justification.trim() || justification.trim().length < 10) {
      setErrorMessage('La justificación debe tener al menos 10 caracteres explicando la necesidad institucional.');
      return;
    }

    const res = createRequest({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.roleTitle,
      areaOrProject,
      justification: justification.trim(),
      estimatedAmount: Number(estimatedAmount),
      category,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        setJustification('');
        setEstimatedAmount(50000);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nueva Solicitud de Dinero</h2>
              <p className="text-xs text-slate-300">Paso 2 del ciclo de Caja Menor: Solicitud previa de fondos</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Requester preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Solicitante activo:</span>
              <span className="font-semibold text-slate-900">{currentUser.name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Efectivo en caja disponible:</span>
              <span className="font-mono font-bold text-emerald-700">
                ${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Área o Proyecto Beneficiado *
              </label>
              <select
                value={areaOrProject}
                onChange={(e) => setAreaOrProject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SUGGESTED_PROJECTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría de Gasto *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Valor Estimado de la Compra (COP) *
              </label>
              <span className="text-xs text-slate-500">
                Tope máximo institucional: <strong className="text-slate-800 font-mono">${MAX_PURCHASE_LIMIT.toLocaleString('es-CO')}</strong>
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                min={1000}
                max={MAX_PURCHASE_LIMIT}
                step={1000}
                value={estimatedAmount}
                onChange={(e) => setEstimatedAmount(e.target.value ? Number(e.target.value) : '')}
                className={`w-full pl-9 pr-4 py-2 text-sm font-mono rounded-lg border focus:outline-none focus:ring-2 ${
                  isOverLimit || isOverBalance
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-emerald-500 bg-white'
                }`}
                placeholder="Ej. 120000"
                required
              />
            </div>

            {isOverLimit && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Supera el límite normativo de $300.000 COP por compra fijado para la Corporación.
              </p>
            )}

            {isOverBalance && !isOverLimit && (
              <p className="mt-1 text-xs text-amber-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Supera el saldo disponible en caja menor ($${efectivoDisponibleEnCaja.toLocaleString('es-CO')} COP).
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Justificación y Concepto de la Necesidad *
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Describa claramente qué insumos o servicios se requieren comprar y cómo apoyan la misión o proyecto de la Corporación..."
              className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Debe sustentarse con factura legal o documento soporte DIAN en un plazo no mayor a 48 horas.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isOverLimit || isOverBalance}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Enviar a Autorización
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
