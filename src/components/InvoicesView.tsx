import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { InvoiceDocument, InvoiceStatus } from '../types';
import {
  Search,
  Filter,
  Receipt,
  Plus,
  FileCheck2,
  FileCode,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface InvoicesViewProps {
  onOpenInvoiceModal: () => void;
  onSelectInvoice: (invoice: InvoiceDocument) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  onOpenInvoiceModal,
  onSelectInvoice,
}) => {
  const { currentUser, invoices } = useCajaMenor();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.code.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      inv.supplierNit.toLowerCase().includes(search.toLowerCase()) ||
      inv.concept.toLowerCase().includes(search.toLowerCase()) ||
      inv.buyerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'todas' || inv.status === statusFilter;
    const matchesCategory = categoryFilter === 'todas' || inv.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'aprobada':
        return (
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Aprobada (Para Reposición)
          </span>
        );
      case 'en_revision':
      case 'registrada':
        return (
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            En Revisión Fiscal
          </span>
        );
      case 'pendiente_correccion':
        return (
          <span className="text-xs font-semibold text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            Pendiente Corrección
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

  const getDocTypeBadge = (type: string) => {
    switch (type) {
      case 'factura_electronica':
        return <span className="text-[10px] text-emerald-700 font-mono">Fact. Electrónica</span>;
      case 'documento_soporte':
        return <span className="text-[10px] text-blue-700 font-mono">Doc. Soporte DIAN</span>;
      case 'documento_equivalente':
        return <span className="text-[10px] text-amber-700 font-mono">Doc. Equivalente</span>;
      default:
        return <span className="text-[10px] text-slate-600 font-mono">Comprobante Caja</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 4</span>
            <span aria-hidden="true">·</span>
            <span>Legalización y Soporte Fiscal DIAN</span>
            <span aria-hidden="true">·</span>
            <span>Estatuto Tributario Art. 615, 617, 771-2</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Registro de Facturas y Legalización de Compras
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Cada compra debe contar con su factura electrónica original o documento soporte electrónico en adquisiciones a no obligados.
            La plataforma audita duplicados por NIT y número consecutivo en tiempo real.
          </p>
        </div>

        <button
          onClick={onOpenInvoiceModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          Registrar Nueva Factura
        </button>
      </div>

      {/* DIAN Regulatory Notice Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">Requisitos de Validez Tributaria para la Corporación:</strong>
          <span className="text-emerald-900 text-[11px] leading-relaxed">
            De acuerdo con la Resolución DIAN 000167 de 2021 y el Estatuto Tributario Art. 771-2, para soportar costos y deducciones,
            las compras a proveedores obligados a facturar deben tener Factura Electrónica con XML validado. Para compras a informales o no obligados,
            la Corporación emite el Documento Soporte Electrónico. Un recibo de papel simple no sustituye la factura exigible.
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por proveedor, NIT, factura, concepto o responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'aprobada', label: 'Aprobadas' },
              { id: 'en_revision', label: 'En Revisión' },
              { id: 'pendiente_correccion', label: 'Con Obs.' },
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
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No hay facturas registradas</p>
            <p className="text-xs text-slate-400">Haga clic en 'Registrar Nueva Factura' para legalizar una compra.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Factura</th>
                  <th className="py-3 px-4">Proveedor & NIT</th>
                  <th className="py-3 px-4">Concepto / Categoría</th>
                  <th className="py-3 px-4">Tipo Documento</th>
                  <th className="py-3 px-4">Responsable</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">IVA</th>
                  <th className="py-3 px-4 text-right">Total Pagado</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Auditar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{inv.code}</span>
                      <span className="font-mono text-slate-500 text-[11px] block">{inv.invoiceNumber}</span>
                      <span className="text-slate-400 text-[10px]">{inv.issueDate}</span>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-slate-900 font-semibold block truncate max-w-[180px]">
                        {inv.supplierName}
                      </strong>
                      <span className="font-mono text-slate-500 text-[11px]">{inv.supplierNit}</span>
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <span className="text-slate-800 line-clamp-1 block" title={inv.concept}>
                        {inv.concept}
                      </span>
                      <span className="text-slate-500 text-[11px] block">{inv.category}</span>
                      <span className="text-slate-400 text-[10px]">{inv.areaOrProject}</span>
                    </td>

                    <td className="py-3 px-4">
                      {getDocTypeBadge(inv.documentType)}
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                        <FileCheck2 className="w-3 h-3 text-rose-500" />
                        PDF
                        {inv.xmlFileName && (
                          <>
                            <span className="text-slate-300">·</span>
                            <FileCode className="w-3 h-3 text-emerald-600" />
                            XML
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium text-slate-900 block">{inv.buyerName}</span>
                      <span className="text-slate-400 text-[10px] font-mono">Sol: {inv.requestCode}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ${inv.amountBeforeTax.toLocaleString('es-CO')}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      ${inv.taxAmount.toLocaleString('es-CO')}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800 text-sm">
                      ${inv.totalAmount.toLocaleString('es-CO')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">{getStatusBadge(inv.status)}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="px-2.5 py-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 mx-auto font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
