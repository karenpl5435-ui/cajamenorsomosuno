import React, { useState } from 'react';
import { CajaMenorProvider } from './context/CajaMenorContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RequestsView } from './components/RequestsView';
import { FundAdminView } from './components/FundAdminView';
import { InvoicesView } from './components/InvoicesView';
import { ReportsAndAuditView } from './components/ReportsAndAuditView';
import { PHVAView } from './components/PHVAView';
import { NormativityView } from './components/NormativityView';
import { RequestModal } from './components/RequestModal';
import { InvoiceModal } from './components/InvoiceModal';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { ReplenishModal } from './components/ReplenishModal';
import { AuditModal } from './components/AuditModal';
import { InvoiceDocument } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReplenishModalOpen, setIsReplenishModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDocument | null>(null);
  const [invoicePreselectedRequestId, setInvoicePreselectedRequestId] = useState<string | undefined>(undefined);

  const handleOpenInvoiceWithRequest = (reqId: string) => {
    setInvoicePreselectedRequestId(reqId);
    setIsInvoiceModalOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoicePreselectedRequestId(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={setActiveTab}
            onOpenRequestModal={() => setIsRequestModalOpen(true)}
            onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
            onOpenReplenishModal={() => setIsReplenishModalOpen(true)}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
          />
        )}

        {activeTab === 'solicitudes' && (
          <RequestsView
            onOpenRequestModal={() => setIsRequestModalOpen(true)}
            onOpenInvoiceModalWithRequest={handleOpenInvoiceWithRequest}
          />
        )}

        {activeTab === 'fondo' && (
          <FundAdminView
            onOpenReplenishModal={() => setIsReplenishModalOpen(true)}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'facturas' && (
          <InvoicesView
            onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
          />
        )}

        {activeTab === 'informes' && (
          <ReportsAndAuditView
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
          />
        )}

        {activeTab === 'phva' && <PHVAView />}

        {activeTab === 'normatividad' && <NormativityView />}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center">
              @
            </span>
            <span className="font-bold text-slate-800 font-mono">CajaUno@social.CS</span>
            <span>·</span>
            <span>Corporación Social Somos Uno</span>
            <span>·</span>
            <span>NIT 901.445.892-4</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Fondo Fijo: $2.000.000 COP</span>
            <span>·</span>
            <span>Límite Compra: $300.000 COP</span>
            <span>·</span>
            <span>Resolución DIAN 000167 / 2021</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        preselectedRequestId={invoicePreselectedRequestId}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      <ReplenishModal
        isOpen={isReplenishModalOpen}
        onClose={() => setIsReplenishModalOpen(false)}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CajaMenorProvider>
      <MainAppContent />
    </CajaMenorProvider>
  );
}
