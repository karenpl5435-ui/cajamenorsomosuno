import React, { useState } from 'react';
import { useCajaMenor } from '../context/CajaMenorContext';
import { PHVAItem } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkles,
} from 'lucide-react';

export const PHVAView: React.FC = () => {
  const { phvaItems, updatePHVAItem } = useCajaMenor();
  const [selectedStage, setSelectedStage] = useState<'ALL' | 'P' | 'H' | 'V' | 'A'>('ALL');

  const stages = [
    {
      code: 'P',
      name: 'Planear',
      color: 'border-blue-500 bg-blue-50/50 text-blue-900',
      badgeColor: 'bg-blue-600 text-white',
      desc: 'Fondo de $2M, límite $300k, políticas y categorías presupuestales.',
    },
    {
      code: 'H',
      name: 'Hacer',
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
      badgeColor: 'bg-emerald-600 text-white',
      desc: 'Registro de solicitudes, autorizaciones, entregas y legalización de facturas.',
    },
    {
      code: 'V',
      name: 'Verificar',
      color: 'border-amber-500 bg-amber-50/50 text-amber-900',
      badgeColor: 'bg-amber-600 text-white',
      desc: 'Auditoría DIAN, cotejo de gastos con solicitudes y arqueo físico mensual.',
    },
    {
      code: 'A',
      name: 'Actuar',
      color: 'border-purple-500 bg-purple-50/50 text-purple-900',
      badgeColor: 'bg-purple-600 text-white',
      desc: 'Corrección de inconsistencias, rechazo de gastos no conformes y mejora continua.',
    },
  ];

  const filteredItems = phvaItems.filter(
    (item) => selectedStage === 'ALL' || item.stage === selectedStage
  );

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'completado'
        ? 'en_progreso'
        : currentStatus === 'en_progreso'
        ? 'completado'
        : 'en_progreso';
    updatePHVAItem(id, { status: nextStatus as any });
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Módulo 6</span>
            <span aria-hidden="true">·</span>
            <span>Gestión de Calidad y Mejora Continua</span>
            <span aria-hidden="true">·</span>
            <span>Ciclo Deming PHVA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Control de Procesos con el Ciclo PHVA
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Estructura de gestión de la Corporación Social Somos Uno para asegurar que la caja menor opere con
            transparencia, rigor fiscal y retroalimentación constante.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedStage('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedStage === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Todos
          </button>
          {stages.map((st) => (
            <button
              key={st.code}
              onClick={() => setSelectedStage(st.code as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedStage === st.code
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.code} - {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Quadrants Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((st) => (
          <div
            key={st.code}
            onClick={() => setSelectedStage(st.code as any)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              st.color
            } ${selectedStage === st.code ? 'ring-2 ring-slate-900 shadow-sm' : 'hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${st.badgeColor}`}>
                {st.code}
              </span>
              <span className="text-[11px] font-semibold text-slate-600">Fase {st.name}</span>
            </div>
            <h3 className="font-bold text-sm mb-1">{st.name}</h3>
            <p className="text-[11px] text-slate-600 leading-snug">{st.desc}</p>
          </div>
        ))}
      </div>

      {/* Activities Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Matriz Operativa de Actividades de Control
            </h2>
            <p className="text-xs text-slate-500">
              Haga clic sobre el estado para actualizar el avance en el ciclo de mejora continua
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {filteredItems.length} actividad(es) registrada(s)
          </span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-xs">
              <div className="flex items-start gap-3 flex-1">
                <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  {item.stage}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <span className="text-slate-400 font-mono text-[11px]">· {item.stageName}</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">{item.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Responsable: <strong className="text-slate-700">{item.responsible}</strong></span>
                    <span>·</span>
                    <span>Frecuencia: <strong className="text-slate-700">{item.frequency}</strong></span>
                    <span>·</span>
                    <span>Última revisión: <strong className="text-slate-700">{item.lastUpdated}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status toggle button */}
              <button
                onClick={() => toggleStatus(item.id, item.status)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 text-xs ${
                  item.status === 'completado'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : item.status === 'en_progreso'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.status === 'completado' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {item.status === 'en_progreso' && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                <span className="capitalize">{item.status.replace('_', ' ')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
