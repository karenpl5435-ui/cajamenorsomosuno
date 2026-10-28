import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { ExpenseCategory, DocumentType, MAX_PURCHASE_LIMIT } from '../types';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Upload,
  FileCheck2,
  FileCode,
  Info,
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRequestId?: string;
}

const CATEGORIES: ExpenseCategory[] = [
  'Papelería y útiles',
  'Transporte y movilización',
  'Materiales para actividades comunitarias',
  'Aseo y cafetería',
  'Impresiones y fotocopias',
  'Gastos imprevistos autorizados',
];

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  preselectedRequestId,
}) => {
  const { currentUser, requests, invoices, createInvoice } = useCajaMenor();

  // Find approved requests that need legalization
  const availableRequests = requests.filter(
    (r) => r.status === 'entregada' || r.status === 'aprobada' || r.id === preselectedRequestId
  );

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    preselectedRequestId || (availableRequests.length > 0 ? availableRequests[0].id : '')
  );

  const selectedReq = requests.find((r) => r.id === selectedRequestId);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [supplierName, setSupplierName] = useState('');
  const [supplierNit, setSupplierNit] = useState('');
  const [concept, setConcept] = useState(selectedReq?.justification || '');
  const [category, setCategory] = useState<ExpenseCategory>(
    selectedReq?.category || CATEGORIES[0]
  );
  const [documentType, setDocumentType] = useState<DocumentType>('factura_electronica');
  const [amountBeforeTax, setAmountBeforeTax] = useState<number | ''>(
    selectedReq ? Math.round(selectedReq.estimatedAmount / 1.19) : ''
  );
  const [taxAmount, setTaxAmount] = useState<number | ''>(
    selectedReq ? selectedReq.estimatedAmount - Math.round(selectedReq.estimatedAmount / 1.19) : 0
  );
  const [totalAmount, setTotalAmount] = useState<number | ''>(selectedReq?.estimatedAmount || '');
  const [areaOrProject, setAreaOrProject] = useState(
    selectedReq?.areaOrProject || 'Talleres Juveniles Sector Norte'
  );
  const [supportFileName, setSupportFileName] = useState('Soporte_Factura_Legalizada.pdf');
  const [xmlAttached, setXmlAttached] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time duplicate check
  const isDuplicate =
    supplierNit.trim() &&
    invoiceNumber.trim() &&
    invoices.some(
      (inv) =>
        inv.supplierNit.trim().toLowerCase() === supplierNit.trim().toLowerCase() &&
        inv.invoiceNumber.trim().toLowerCase() === invoiceNumber.trim().toLowerCase()
    );

  const isOverLimit = typeof totalAmount === 'number' && totalAmount > MAX_PURCHASE_LIMIT;

  const handleSubtotalChange = (val: number | '') => {
    setAmountBeforeTax(val);
    if (typeof val === 'number') {
      if (documentType === 'factura_electronica') {
        const calculatedTax = Math.round(val * 0.19);
        setTaxAmount(calculatedTax);
        setTotalAmount(val + calculatedTax);
      } else {
        setTaxAmount(0);
        setTotalAmount(val);
      }
    }
  };

  const handleTotalChange = (val: number | '') => {
    setTotalAmount(val);
    if (typeof val === 'number') {
      if (documentType === 'factura_electronica') {
        const sub = Math.round(val / 1.19);
        setAmountBeforeTax(sub);
        setTaxAmount(val - sub);
      } else {
        setAmountBeforeTax(val);
        setTaxAmount(0);
      }
    }
  };

  const handleRequestSelect = (reqId: string) => {
    setSelectedRequestId(reqId);
    const req = requests.find((r) => r.id === reqId);
    if (req) {
      setConcept(req.justification);
      setCategory(req.category);
      setAreaOrProject(req.areaOrProject);
      handleTotalChange(req.estimatedAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!invoiceNumber.trim()) {
      setErrorMessage('Debe indicar el número de factura o consecutivo.');
      return;
    }
    if (!supplierName.trim() || !supplierNit.trim()) {
      setErrorMessage('Debe suministrar el nombre del proveedor y su NIT / Cédula.');
      return;
    }
    if (!totalAmount || Number(totalAmount) <= 0) {
      setErrorMessage('Debe indicar un valor total mayor a $0 COP.');
      return;
    }
    if (isDuplicate) {
      setErrorMessage('No se puede guardar: Esta factura ya se encuentra registrada en el sistema.');
      return;
    }

    const res = createInvoice({
      requestId: selectedRequestId || '',
      requestCode: selectedReq?.code || 'DIRECTO',
      invoiceNumber: invoiceNumber.trim().toUpperCase(),
      issueDate,
      supplierName: supplierName.trim(),
      supplierNit: supplierNit.trim(),
      concept: concept.trim(),
      category,
      amountBeforeTax: Number(amountBeforeTax) || Number(totalAmount),
      taxAmount: Number(taxAmount) || 0,
      totalAmount: Number(totalAmount),
      buyerName: currentUser.name,
      areaOrProject,
      documentType,
      supportFileName,
      xmlFileName: xmlAttached ? `${invoiceNumber.trim().toUpperCase()}_DIAN.xml` : undefined,
      supportFileType: 'pdf',
      reviewNotes: 'Pendiente de auditoría y revisión de requisitos tributarios DIAN.',
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Registro y Legalización de Factura</h2>
              <p className="text-xs text-slate-300">
                Paso 7 del ciclo de Caja Menor: Carga de soportes contables y fiscales
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isDuplicate && (
            <div className="p-3 bg-rose-50 border-2 border-rose-400 text-rose-900 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="block font-bold">¡ALERTA DE FACTURA DUPLICADA!</strong>
                Ya existe en la base de datos una compra registrada con el mismo NIT ({supplierNit}) y consecutivo ({invoiceNumber}). La plataforma impide registrar pagos duplicados para garantizar la transparencia.
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Associated request selector */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vincular con Solicitud Previa Autorizada
            </label>
            <select
              value={selectedRequestId}
              onChange={(e) => handleRequestSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Sin solicitud previa (Gasto imprevisto directo) --</option>
              {availableRequests.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.code} | {req.requesterName} | ${req.estimatedAmount.toLocaleString('es-CO')} COP - {req.justification.slice(0, 45)}...
                </option>
              ))}
            </select>
            {selectedReq && (
              <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vinculado a {selectedReq.code}: Anticipo entregado ${selectedReq.estimatedAmount.toLocaleString('es-CO')} COP.
              </p>
            )}
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tipo de Documento Soporte (Normativa DIAN) *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDocumentType('factura_electronica');
                  handleTotalChange(totalAmount);
                }}
                className={`p-2.5 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                  documentType === 'factura_electronica'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="block font-medium">Factura Electrónica de Venta</span>
                  <span className="text-[10px] text-slate-500 font-normal">Con validación previa DIAN</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDocumentType('documento_soporte');
                  setTaxAmount(0);
                  if (typeof totalAmount === 'number') setAmountBeforeTax(totalAmount);
                }}
                className={`p-2.5 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                  documentType === 'documento_soporte'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="block font-medium">Documento Soporte (No Obligados)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Res. DIAN 000167 de 2021</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDocumentType('documento_equivalente');
                  setTaxAmount(0);
                  if (typeof totalAmount === 'number') setAmountBeforeTax(totalAmount);
                }}
                className={`p-2.5 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                  documentType === 'documento_equivalente'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Receipt className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="block font-medium">Documento Equivalente</span>
                  <span className="text-[10px] text-slate-500 font-normal">Tiquete de peaje, transporte</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDocumentType('comprobante_caja');
                  setTaxAmount(0);
                  if (typeof totalAmount === 'number') setAmountBeforeTax(totalAmount);
                }}
                className={`p-2.5 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                  documentType === 'comprobante_caja'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Info className="w-4 h-4 text-slate-600 shrink-0" />
                <div>
                  <span className="block font-medium">Comprobante Interno de Caja</span>
                  <span className="text-[10px] text-slate-500 font-normal">Constancia provisional interna</span>
                </div>
              </button>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de Factura / Consecutivo *
              </label>
              <input
                type="text"
                placeholder="Ej. FE-84291"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIT o Cédula del Proveedor *
              </label>
              <input
                type="text"
                placeholder="Ej. 900.542.119-3"
                value={supplierNit}
                onChange={(e) => setSupplierNit(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fecha de Expedición *
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre o Razón Social del Proveedor *
            </label>
            <input
              type="text"
              placeholder="Ej. Distribuidora Papelera Nacional SAS"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría Contable *
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Área o Proyecto Beneficiado *
              </label>
              <input
                type="text"
                value={areaOrProject}
                onChange={(e) => setAreaOrProject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción / Concepto del Gasto *
            </label>
            <textarea
              rows={2}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Detalle los productos o servicios adquiridos..."
              className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Amounts & Tax Math */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Desglose Económico e Impuestos
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Valor antes de Impuestos (Subtotal)
                </label>
                <input
                  type="number"
                  min={0}
                  value={amountBeforeTax}
                  onChange={(e) =>
                    handleSubtotalChange(e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-full px-3 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  IVA u otros Impuestos
                </label>
                <input
                  type="number"
                  min={0}
                  value={taxAmount}
                  onChange={(e) => {
                    const t = e.target.value ? Number(e.target.value) : 0;
                    setTaxAmount(t);
                    if (typeof amountBeforeTax === 'number') {
                      setTotalAmount(amountBeforeTax + t);
                    }
                  }}
                  className="w-full px-3 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">
                  Valor Total Pagado (COP) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={MAX_PURCHASE_LIMIT}
                  value={totalAmount}
                  onChange={(e) => handleTotalChange(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-1.5 text-sm font-mono font-bold text-emerald-800 bg-white border-2 border-emerald-500 rounded-lg"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {isOverLimit && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                El valor excede el límite máximo por compra de $300.000 COP.
              </p>
            )}
          </div>

          {/* Simulated File Uploads according to proposal page 5-6 */}
          <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Soporte Digital de la Compra (PDF y XML de DIAN)
              </span>
              <span className="text-[10px] text-slate-500">Obligatorio según Art. 618 E.T.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                <FileCheck2 className="w-4 h-4 text-rose-600" />
                <span className="truncate max-w-[180px] font-mono">{supportFileName}</span>
              </div>

              {documentType === 'factura_electronica' && (
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={xmlAttached}
                    onChange={(e) => setXmlAttached(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Incluye XML original firmado DIAN</span>
                </label>
              )}

              <button
                type="button"
                onClick={() => {
                  const num = Math.floor(Math.random() * 9000 + 1000);
                  setSupportFileName(`Factura_${invoiceNumber || 'DOC'}_${num}.pdf`);
                }}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200 rounded-md transition-colors text-xs flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Simular cambio de archivo
              </button>
            </div>
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
              disabled={isDuplicate || isOverLimit}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Registrar Factura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
