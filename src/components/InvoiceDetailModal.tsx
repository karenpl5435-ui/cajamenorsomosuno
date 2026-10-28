import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { InvoiceDocument, InvoiceStatus } from '../types';
import {
  X,
  FileCheck2,
  FileCode,
  Calendar,
  Building,
  User,
  Tag,
  DollarSign,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: InvoiceDocument | null;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose }) => {
  const { currentUser, reviewInvoice } = useCajaMenor();
  const [activeTab, setActiveTab] = useState<'info' | 'pdf' | 'xml'>('info');
  const [reviewNotes, setReviewNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!invoice) return null;

  const canReview =
    currentUser.role === 'coordinador' ||
    currentUser.role === 'gerente' ||
    currentUser.role === 'contador';

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    reviewInvoice(invoice.id, newStatus, reviewNotes.trim() || undefined);
    setStatusMessage(`Factura marcada como "${newStatus}".`);
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 900);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'aprobada':
        return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Aprobada</span>;
      case 'en_revision':
      case 'registrada':
        return <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">En Revisión</span>;
      case 'pendiente_correccion':
        return <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Pendiente Corrección</span>;
      case 'rechazada':
        return <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Rechazada</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-mono">{invoice.code}</h2>
                <span className="text-xs text-slate-300 font-normal">| Factura N° {invoice.invoiceNumber}</span>
              </div>
              <p className="text-xs text-slate-300">Auditoría y soporte documental DIAN</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(invoice.status)}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Datos Contables & Fiscales
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Representación Gráfica (PDF)
          </button>
          {invoice.xmlFileName && (
            <button
              onClick={() => setActiveTab('xml')}
              className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'xml'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-4 h-4" />
              XML Electrónico DIAN
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {statusMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-5">
              {/* Top Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Proveedor:</span>
                  <strong className="text-slate-900 text-sm block font-semibold truncate">
                    {invoice.supplierName}
                  </strong>
                  <span className="text-slate-600 font-mono text-[11px]">NIT: {invoice.supplierNit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fecha Emisión:</span>
                  <strong className="text-slate-900 text-sm block font-semibold">
                    {invoice.issueDate}
                  </strong>
                  <span className="text-slate-500 text-[11px]">Solicitud: {invoice.requestCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Categoría:</span>
                  <strong className="text-slate-900 text-sm block font-semibold truncate">
                    {invoice.category}
                  </strong>
                  <span className="text-slate-500 text-[11px]">Proyecto: {invoice.areaOrProject}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Pagado:</span>
                  <strong className="text-emerald-700 text-base block font-mono font-bold">
                    ${invoice.totalAmount.toLocaleString('es-CO')} COP
                  </strong>
                  <span className="text-slate-500 text-[11px] font-mono">
                    Sub: ${invoice.amountBeforeTax.toLocaleString('es-CO')} · IVA: ${invoice.taxAmount.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              {/* Detail fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Concepto y Detalle:</span>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm leading-relaxed">
                    {invoice.concept}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border border-slate-200 rounded-lg bg-white">
                    <span className="font-semibold text-slate-700 block mb-1">Responsable del Gasto:</span>
                    <p className="text-slate-800">{invoice.buyerName}</p>
                    <span className="text-[11px] text-slate-500">Registrado el: {new Date(invoice.createdAt).toLocaleString('es-CO')}</span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-white">
                    <span className="font-semibold text-slate-700 block mb-1">Tipo de Soporte Tributario:</span>
                    <p className="text-slate-800 capitalize">{invoice.documentType.replace('_', ' ')}</p>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {invoice.dianValidationStatus === 'valido' ? '✓ Cumple validación fiscal DIAN' : 'Soporte interno'}
                    </span>
                  </div>
                </div>

                {invoice.reviewNotes && (
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-900">
                    <span className="font-bold block mb-0.5">Observaciones de Revisión:</span>
                    <p>{invoice.reviewNotes}</p>
                    {invoice.reviewedBy && (
                      <span className="text-[11px] text-amber-700 block mt-1">
                        Por: {invoice.reviewedBy} · {invoice.reviewedAt ? new Date(invoice.reviewedAt).toLocaleString('es-CO') : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-rose-600" />
                  <span className="font-mono font-medium text-slate-800">{invoice.supportFileName || 'Factura_Soporte.pdf'}</span>
                </div>
                <span className="text-emerald-700 font-semibold text-[11px]">Soporte Legible Digitalizado</span>
              </div>

              {/* Clean simulated graphic representation of invoice */}
              <div className="border border-slate-300 rounded-xl p-6 bg-white shadow-xs font-sans text-xs space-y-4">
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{invoice.supplierName}</h3>
                    <p className="text-slate-600 font-mono">NIT: {invoice.supplierNit}</p>
                    <p className="text-slate-500 text-[11px]">Régimen Común / Responsable de IVA</p>
                    <p className="text-slate-500 text-[11px]">Medellín / Colombia</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-mono font-bold rounded text-xs mb-1">
                      {invoice.invoiceNumber}
                    </span>
                    <p className="text-slate-500 text-[11px]">Fecha: {invoice.issueDate}</p>
                    <p className="text-slate-500 text-[11px]">Hora: 14:32:10 COT</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Adquiriente / Cliente</span>
                  <strong className="text-slate-900">CORPORACIÓN SOCIAL SOMOS UNO</strong>
                  <p className="font-mono text-slate-600 text-[11px]">NIT: 901.445.892-4 · Sin Ánimo de Lucro</p>
                  <p className="text-slate-500 text-[11px]">Entregado a: {invoice.buyerName}</p>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                      <th className="py-1.5">Descripción</th>
                      <th className="py-1.5 text-right">Cant</th>
                      <th className="py-1.5 text-right">V. Unit</th>
                      <th className="py-1.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 text-slate-800">{invoice.concept}</td>
                      <td className="py-2 text-right font-mono">1</td>
                      <td className="py-2 text-right font-mono">${invoice.amountBeforeTax.toLocaleString('es-CO')}</td>
                      <td className="py-2 text-right font-mono">${invoice.amountBeforeTax.toLocaleString('es-CO')}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right pt-3 text-slate-500">Subtotal:</td>
                      <td className="text-right pt-3 font-mono">${invoice.amountBeforeTax.toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right py-1 text-slate-500">IVA (19%):</td>
                      <td className="text-right py-1 font-mono">${invoice.taxAmount.toLocaleString('es-CO')}</td>
                    </tr>
                    <tr className="font-bold text-sm text-slate-900 border-t border-slate-200">
                      <td colSpan={3} className="text-right pt-2">TOTAL PAGADO:</td>
                      <td className="text-right pt-2 font-mono text-emerald-700">${invoice.totalAmount.toLocaleString('es-CO')} COP</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="pt-3 border-t text-[10px] text-slate-400 flex items-center justify-between font-mono">
                  <span>CUFE: 8f9b231a47e92b3c...d81a941</span>
                  <span>Validado en servidor DIAN</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'xml' && (
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
                <span>{invoice.xmlFileName}</span>
                <span className="text-emerald-700 font-sans font-semibold text-[11px]">UBL 2.1 Colombia</span>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
{`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>DIAN 2.1</cbc:CustomizationID>
  <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${invoice.issueDate}</cbc:IssueDate>
  <cac:AccountingSupplierParty>
    <cac:PartyTaxScheme>
      <cbc:RegistrationName>${invoice.supplierName}</cbc:RegistrationName>
      <cbc:CompanyID schemeAgencyID="195">${invoice.supplierNit}</cbc:CompanyID>
    </cac:PartyTaxScheme>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:PartyTaxScheme>
      <cbc:RegistrationName>CORPORACION SOCIAL SOMOS UNO</cbc:RegistrationName>
      <cbc:CompanyID schemeAgencyID="195">901445892</cbc:CompanyID>
    </cac:PartyTaxScheme>
  </cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="COP">${invoice.amountBeforeTax}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="COP">${invoice.taxAmount}</cbc:TaxExclusiveAmount>
    <cbc:PayableAmount currencyID="COP">${invoice.totalAmount}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`}
              </pre>
            </div>
          )}
        </div>

        {/* Action bar for reviewers */}
        {canReview && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Observaciones de revisión contable (opcional)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Revisor: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.roleTitle})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('pendiente_correccion')}
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors flex items-center gap-1 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Solicitar Corrección
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('rechazada')}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('aprobada')}
                  className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 font-semibold shadow-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Aprobar para Reposición
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
