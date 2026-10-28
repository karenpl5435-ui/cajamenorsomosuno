import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  FileCheck2,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Download,
  BookOpen,
} from 'lucide-react';

export const NormativityView: React.FC = () => {
  // Interactive DIAN Compliance Checklist State
  const [checks, setChecks] = useState({
    nitValido: false,
    consecutivoAutorizado: false,
    discriminacionIva: false,
    descripcionEspecifica: false,
    soporteElectronico: false,
    topeMenor300k: false,
  });

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecks = Object.values(checks).filter(Boolean).length;
  const isFullyCompliant = totalChecks === 6;

  const legalArticles = [
    {
      norma: 'Estatuto Tributario, Art. 615',
      titulo: 'Obligación de expedir factura',
      relacion:
        'Regula la obligación para comerciantes y prestadores de servicios de expedir factura o documento equivalente por cada operación realizada.',
      impacto: 'Obligatorio exigir factura en toda compra a establecimientos formales.',
    },
    {
      norma: 'Estatuto Tributario, Art. 617',
      titulo: 'Requisitos de la factura de venta',
      relacion:
        'Establece los requisitos fiscales que debe contener: apellidos y nombre o razón social, NIT del vendedor y del adquirente (Corporación Social Somos Uno), numeración consecutiva, fecha, descripción de bienes y discriminación del IVA.',
      impacto: 'Los comprobantes sin NIT de la Corporación o fecha no son admisibles.',
    },
    {
      norma: 'Estatuto Tributario, Art. 618',
      titulo: 'Obligación de exigir factura',
      relacion:
        'Establece el deber legal del comprador o adquirente de exigir factura o documento equivalente en las operaciones gravadas.',
      impacto: 'El colaborador que realiza la compra es responsable legal de pedir la factura.',
    },
    {
      norma: 'Estatuto Tributario, Art. 771-2',
      titulo: 'Procedencia de costos y deducciones',
      relacion:
        'Regula los requisitos esenciales para soportar fiscalmente costos, deducciones e impuestos descontables en las declaraciones tributarias de la Corporación.',
      impacto: 'Un gasto sin factura válida es rechazado contablemente y no se reembolsa.',
    },
    {
      norma: 'Resolución DIAN 000167 de 2021',
      titulo: 'Documento soporte electrónico a no obligados',
      relacion:
        'Regula el documento soporte electrónico para adquisiciones efectuadas a sujetos no obligados a expedir factura de venta (ej. transporte informal, compras a personas naturales del régimen simple).',
      impacto: 'La Corporación debe generar el documento soporte electrónico con numeración DIAN.',
    },
    {
      norma: 'Ley 1314 de 2009 & Dec. 2420 de 2015',
      titulo: 'Marco Técnico Normativo Contable (NIIF)',
      relacion:
        'Regulación contable y de información financiera aplicable a entidades privadas y ESAL (Entidades Sin Ánimo de Lucro).',
      impacto: 'Registro bajo causación oportuna y separación clara de cuentas.',
    },
    {
      norma: 'Ley 1581 de 2012',
      titulo: 'Protección de Datos Personales (Habeas Data)',
      relacion:
        'Protección de los datos personales registrados en la plataforma tanto de colaboradores como de proveedores y beneficiarios comunitarios.',
      impacto: 'Custodia segura de datos de identificación y soportes digitales.',
    },
  ];

  const proposalPdfPath =
    '/assets/aistudio/Propuesta_Plataforma_Caja_Menor_Somos_Uno_karen_y_keisy_269a55d2.pdf';

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 7</span>
            <span aria-hidden="true">·</span>
            <span>Marco Legal & Políticas Institucionales</span>
            <span aria-hidden="true">·</span>
            <span>Estatuto Tributario Colombiano & DIAN</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Normatividad Legal y Manual de Caja Menor
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Directrices tributarias y contables que rigen la operación de la Corporación Social Somos Uno
            como entidad privada sin ánimo de lucro (ESAL).
          </p>
        </div>

        {/* Access to Original Proposal PDF */}
        <a
          href={proposalPdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-xs"
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Ver Propuesta PDF Original</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </a>
      </div>

      {/* Interactive DIAN Tax Compliance Assistant (Checklist) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Asistente Interactivo de Validación Fiscal (Checklist DIAN)
            </h2>
            <p className="text-xs text-slate-500">
              Verifique los 6 requisitos fiscales indispensables antes de aceptar una factura o comprobante
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500">Cumplimiento:</span>
            <strong
              className={`px-2.5 py-1 rounded-lg ${
                isFullyCompliant
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'bg-amber-100 text-amber-800 font-bold'
              }`}
            >
              {totalChecks} / 6 Requisitos
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={checks.nitValido}
              onChange={() => toggleCheck('nitValido')}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <strong className="text-slate-900 block">1. NIT del Proveedor y de la Corporación</strong>
              <span className="text-slate-500 text-[11px]">
                La factura debe incluir el NIT del emisor y el NIT 901.445.892-4 de Somos Uno (Art. 617 E.T.).
              </span>
            </div>
          </label>

          <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={checks.consecutivoAutorizado}
              onChange={() => toggleCheck('consecutivoAutorizado')}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <strong className="text-slate-900 block">2. Número Consecutivo y Fecha Vigente</strong>
              <span className="text-slate-500 text-[11px]">
                Numeración consecutiva autorizada por la DIAN con fecha correspondiente al mes en curso.
              </span>
            </div>
          </label>

          <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={checks.discriminacionIva}
              onChange={() => toggleCheck('discriminacionIva')}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <strong className="text-slate-900 block">3. Discriminación de IVA / Impuestos</strong>
              <span className="text-slate-500 text-[11px]">
                Subtotal, valor del IVA discriminado y valor total pagado (o indicación expresa de excluido).
              </span>
            </div>
          </label>

          <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={checks.descripcionEspecifica}
              onChange={() => toggleCheck('descripcionEspecifica')}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <strong className="text-slate-900 block">4. Descripción Detallada del Bien o Servicio</strong>
              <span className="text-slate-500 text-[11px]">
                Concepto claro (no se admiten descripciones genéricas como "varios" o "consumo").
              </span>
            </div>
          </label>

          <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={checks.soporteElectronico}
              onChange={() => toggleCheck('soporteElectronico')}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <strong className="text-slate-900 block">5. Validación DIAN (Factura Electrónica o Doc. Soporte)</strong>
              <span className="text-slate-500 text-[11px]">
                Archivo PDF legible y XML validado por la DIAN (o documento soporte electrónico generado).
              </span>
            </div>
          </label>

          <label className="p-3 border rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={checks.topeMenor300k}
              onChange={() => toggleCheck('topeMenor300k')}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <strong className="text-slate-900 block">6. Valor Máximo Menor a $300.000 COP</strong>
              <span className="text-slate-500 text-[11px]">
                El monto total del documento no supera el tope reglamentario institucional por compra.
              </span>
            </div>
          </label>
        </div>

        {isFullyCompliant ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ¡Documento 100% válido para reposición! Cumple con la normatividad DIAN y el reglamento de la Corporación.
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-600">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Marque las casillas para validar si el documento cumple los requisitos formales antes de subirlo a la plataforma.
            </span>
          </div>
        )}
      </div>

      {/* Normative Matrix Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Matriz Normativa Tributaria y Contable Aplicable
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Norma Legal</th>
                <th className="py-3 px-4">Relación con la Caja Menor</th>
                <th className="py-3 px-4">Control Institucional en Somos Uno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {legalArticles.map((art) => (
                <tr key={art.norma} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {art.norma}
                    <span className="block font-sans font-medium text-slate-500 text-[11px]">
                      {art.titulo}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed max-w-md">
                    {art.relacion}
                  </td>
                  <td className="py-3 px-4 text-emerald-900 font-medium">
                    {art.impacto}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Policies of Corporación Social Somos Uno */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Manual de Políticas Internas de Caja Menor (Somos Uno)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <strong className="text-slate-900 block font-bold">1. Segregación de Funciones</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Una misma persona no puede autorizar, custodiar y auditar sus propias operaciones. Las funciones están divididas entre Gerencia (autoriza), Custodio (entrega dinero), y Contador (audita).
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <strong className="text-slate-900 block font-bold">2. Plazo Estricto de Legalización</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Los colaboradores que reciban anticipo de efectivo tienen un plazo máximo de 48 horas hábiles después de realizada la compra para cargar la factura y reintegrar cualquier saldo sobrante.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <strong className="text-slate-900 block font-bold">3. Prohibiciones Expresas</strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Queda estrictamente prohibido usar la caja menor para préstamos a colaboradores, cambio de cheques personales, pago de nómina, gastos suntuarios o compras recurrentes mayores a $300.000 COP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
