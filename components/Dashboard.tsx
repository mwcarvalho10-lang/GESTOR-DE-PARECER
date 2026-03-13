import React, { useState } from 'react';
import { GraduationCap, BookOpen, ChevronDown, ChevronUp, HelpCircle, Lock } from 'lucide-react';
import { gradesArr, lettersArr } from '@/lib/constants';
import { PinModal } from './PinModal';
import { HelpModal } from './HelpModal';
import { AdminSettingsModal } from './AdminSettingsModal';
import { AppData } from '@/lib/types';

interface DashboardProps {
  appData: AppData;
  onSelectClass: (grade: string, letter: string) => void;
  pinConfig: Record<string, string>;
  onUpdatePinConfig: (newConfig: Record<string, string>) => void;
}

export function Dashboard({ appData, onSelectClass, pinConfig, onUpdatePinConfig }: DashboardProps) {
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ g: number | null; l: string | null }>({ g: null, l: null });
  const [currentPin, setCurrentPin] = useState("");
  const [isError, setIsError] = useState(false);

  const handlePinChange = (pin: string) => {
    if (isError) return;
    setCurrentPin(pin);
    if (pin.length === 5) {
      if (pendingSelection.g && pin === pinConfig[pendingSelection.g.toString()]) {
        onSelectClass(pendingSelection.g.toString(), pendingSelection.l!);
        setPinModalOpen(false);
      } else {
        setIsError(true);
        setTimeout(() => {
          setCurrentPin("");
          setIsError(false);
        }, 500);
      }
    }
  };

  const openPinModal = (g: number, l: string) => {
    setPendingSelection({ g, l });
    setCurrentPin("");
    setPinModalOpen(true);
  };

  const getGradeColor = (g: number) => {
    switch(g) {
      case 1: return '#0ea5e9';
      case 2: return '#7fb432';
      case 3: return '#f59e0b';
      case 4: return '#8b5cf6';
      case 5: return '#005bb7';
      default: return '#0ea5e9';
    }
  };

  return (
    <div className="bg-[#f8fafc] h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <header className="mb-12 text-center relative">
          <div className="absolute right-0 top-0 flex gap-2">
            <button onClick={() => setAdminModalOpen(true)} className="w-12 h-12 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-200 transition-all hover:shadow-md hover:text-escola-verde" title="Configurações Admin">
              <Lock className="w-5 h-5" />
            </button>
            <button onClick={() => setHelpModalOpen(true)} className="w-12 h-12 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-200 transition-all hover:shadow-md hover:text-escola-azul" title="Guia de Uso">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100">
              <GraduationCap className="w-10 h-10 text-escola-verde" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase">Painel Pedagógico</h1>
          <p className="text-escola-azul font-black uppercase tracking-[0.3em] text-[11px]">E. M. Raymundo Lemos Santana</p>
        </header>
        
        <div className="space-y-4">
          {gradesArr.map(g => {
            const isActive = openYear === g;
            const gradeColor = getGradeColor(g);
            return (
              <div key={g} style={{ '--grade-color': gradeColor } as React.CSSProperties}>
                <button 
                  onClick={() => setOpenYear(isActive ? null : g)} 
                  className={`w-full flex items-center justify-between p-6 rounded-2xl bg-white border transition-all duration-300 ${isActive ? 'shadow-md border-escola-verde/30 ring-1 ring-escola-verde/20' : 'border-slate-200 hover:shadow-md hover:border-slate-300'}`}
                  style={{ borderLeftColor: isActive ? gradeColor : undefined, borderLeftWidth: isActive ? '4px' : '1px' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 relative flex items-center justify-center rounded-xl transition-all duration-300 ${isActive ? 'text-white' : 'bg-[#f1f5f9] text-slate-500'}`} style={{ backgroundColor: isActive ? gradeColor : undefined }}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-black uppercase text-slate-800">{g}º ANO</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ensino Fundamental</p>
                    </div>
                  </div>
                  {isActive ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                </button>
                
                {isActive && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 px-2 animate-in slide-in-from-top-2 duration-300">
                    {lettersArr.map(l => {
                      const classData = appData[`${g}${l}`];
                      const count = classData?.students?.filter(s => classData[s]?.active !== false).length || 0;
                      return (
                        <div 
                          key={l} 
                          onClick={() => openPinModal(g, l)} 
                          className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md text-center group transition-all"
                        >
                          <span className="block text-xl font-black text-slate-800 uppercase group-hover:text-escola-azul transition-colors">{l}</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase">{count} Alunos</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PinModal 
        isOpen={pinModalOpen}
        targetGrade={pendingSelection.g}
        targetLetter={pendingSelection.l}
        currentPin={currentPin}
        isError={isError}
        onPinChange={handlePinChange}
        onCancel={() => setPinModalOpen(false)}
      />

      <HelpModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
      />

      <AdminSettingsModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        pinConfig={pinConfig}
        onSave={onUpdatePinConfig}
      />
    </div>
  );
}
