import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { CashRequest, RequestStatus } from '../types';
import {
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Receipt,
  Coins,
  FileText,
  AlertCircle,
  User,
  Calendar,
} from 'lucide-react';

interface RequestsViewProps {
  onOpenRequestModal: () => void;
  onOpenInvoiceModalWithRequest: (reqId: string) => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  onOpenRequestModal,
  onOpenInvoiceModalWithRequest,
}) => {
  const { currentUser, requests, reviewRequest, deliverCash } = useCajaMenor();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [selectedRequest, setSelectedRequest] = useState<CashRequest | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showRejectPromptForId, setShowRejectPromptForId] = useState<string | null>(null);
  const [showDeliveryPromptForId, setShowDeliveryPromptForId] = useState<string | null>(null);

  const canAuthorize =
    currentUser.role === 'coordinador' || currentUser.role === 'gerente';
  const canDeliver =
    currentUser.role === 'custodio' ||
    currentUser.role === 'coordinador' ||
    currentUser.role === 'gerente';

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.code.toLowerCase().includes(search.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(search.toLowerCase()) ||
      req.areaOrProject.toLowerCase().includes(search.toLowerCase()) ||
      req.justification.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'todas' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pendiente':
        return (
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Pendiente Aprobación
          </span>
        );
      case 'aprobada':
        return (
          <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            Aprobada (Listo entrega)
          </span>
        );
      case 'entregada':
        return (
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <Coins className="w-3 h-3 text-emerald-600" />
            Efectivo Entregado
          </span>
        );
      case 'legalizada':
        return (
          <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 flex items-center gap-1">
            <Receipt className="w-3 h-3 text-purple-600" />
            Legalizada con Factura
          </span>
        );
      case 'rechazada':
        return (
          <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rechazada
          </span>
        );
    }
  };

  const handleApprove = (id: string) => {
    reviewRequest(id, 'aprobada', 'Aprobado de conformidad con el reglamento de Caja Menor.');
  };

  const handleConfirmReject = (id: string) => {
    reviewRequest(
      id,
      'rechazada',
      rejectionNotes.trim() || 'No cumple con las políticas de austeridad o pertinencia del gasto.'
    );
    setShowRejectPromptForId(null);
    setRejectionNotes('');
  };

  const handleConfirmDelivery = (id: string) => {
    deliverCash(
      id,
      deliveryNotes.trim() || 'Efectivo entregado en billetes previa verificación de la solicitud.'
    );
    setShowDeliveryPromptForId(null);
    setDeliveryNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 2</span>
            <span aria-hidden="true">·</span>
            <span>Flujo de Autorizaciones Previas</span>
            <span aria-hidden="true">·</span>
            <span>Límite Máximo: $300.000 COP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Solicitudes y Autorizaciones de Fondos
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Todo desembolso de caja menor requiere solicitud previa aprobada por Coordinación o Gerencia.
            Evita gastos desordenados y compras no autorizadas.
          </p>
        </div>

        <button
          onClick={onOpenRequestModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Solicitud de Dinero
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, solicitante, proyecto o justificación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
          />
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'pendiente', label: 'Pendientes' },
            { id: 'aprobada', label: 'Aprobadas' },
            { id: 'entregada', label: 'Entregadas' },
            { id: 'legalizada', label: 'Legalizadas' },
            { id: 'rechazada', label: 'Rechazadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No se encontraron solicitudes</p>
            <p className="text-xs text-slate-400">Intente cambiando el término de búsqueda o el filtro de estado.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {req.code}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {req.category}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{req.areaOrProject}</span>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>

              {/* Middle Section: Requester and Justification */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Solicitante:</span>
                  <strong className="text-slate-900 font-semibold block">{req.requesterName}</strong>
                  <span className="text-slate-500 text-[11px]">{req.requesterRole}</span>
                </div>

                <div className="md:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Justificación de la Compra:</span>
                  <p className="text-slate-700 text-xs leading-relaxed">{req.justification}</p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-slate-400 block text-[11px]">Monto Estimado:</span>
                  <strong className="text-base font-bold font-mono text-emerald-800 block">
                    ${req.estimatedAmount.toLocaleString('es-CO')} COP
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Trazability History Strip */}
              {(req.reviewedBy || req.deliveredBy || req.reviewNotes) && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-100">
                  {req.reviewedBy && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Revisado por <strong>{req.reviewedBy}</strong> ({new Date(req.reviewedAt!).toLocaleDateString('es-CO')}):{' '}
                        <em className="text-slate-700">"{req.reviewNotes}"</em>
                      </span>
                    </div>
                  )}
                  {req.deliveredBy && (
                    <div className="flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Efectivo entregado por <strong>{req.deliveredBy}</strong> ({new Date(req.deliveredAt!).toLocaleDateString('es-CO')}).
                        {req.deliveryNotes && ` Nota: ${req.deliveryNotes}`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Reject Prompt */}
              {showRejectPromptForId === req.id && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                  <span className="font-semibold text-rose-900 block">
                    Motivo formal de rechazo para el solicitante:
                  </span>
                  <input
                    type="text"
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Indique por qué se rechaza (ej. excede necesidad, no prioritario)..."
                    className="w-full px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-xs"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowRejectPromptForId(null)}
                      className="px-3 py-1 text-slate-600 hover:text-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleConfirmReject(req.id)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                    >
                      Confirmar Rechazo
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Delivery Prompt */}
              {showDeliveryPromptForId === req.id && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <span className="font-semibold text-emerald-950 block">
                    Confirmar Entrega Física de ${req.estimatedAmount.toLocaleString('es-CO')} COP a {req.requesterName}:
                  </span>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Denominación de billetes entregados u observaciones de custodia..."
                    className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowDeliveryPromptForId(null)}
                      className="px-3 py-1 text-slate-600 hover:text-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleConfirmDelivery(req.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                    >
                      Registrar Entrega de Efectivo
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Flujo: Paso 2 a 5 del manual de caja menor
                </span>

                <div className="flex items-center gap-2">
                  {/* Approve / Reject buttons */}
                  {req.status === 'pendiente' && canAuthorize && (
                    <>
                      <button
                        onClick={() => setShowRejectPromptForId(req.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 font-medium"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 font-semibold shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aprobar Solicitud
                      </button>
                    </>
                  )}

                  {/* Cash Handover button */}
                  {req.status === 'aprobada' && canDeliver && (
                    <button
                      onClick={() => setShowDeliveryPromptForId(req.id)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 font-semibold shadow-xs"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      Entregar Dinero (Custodio)
                    </button>
                  )}

                  {/* Legalize with Invoice button */}
                  {req.status === 'entregada' && (
                    <button
                      onClick={() => onOpenInvoiceModalWithRequest(req.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 font-semibold shadow-xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      Legalizar y Cargar Factura
                    </button>
                  )}

                  {req.status === 'legalizada' && (
                    <span className="text-purple-700 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Legalizada con éxito
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
