import React, { useState } from 'react';
import { GraduationCap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { gradesArr, lettersArr, PIN_CONFIG } from '@/lib/constants';
import { PinModal } from './PinModal';
import { AppData } from '@/lib/types';

interface DashboardProps {
  appData: AppData;
  onSelectClass: (grade: string, letter: string) => void;
}

export function Dashboard({ appData, onSelectClass }: DashboardProps) {
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ g: number | null; l: string | null }>({ g: null, l: null });
  const [currentPin, setCurrentPin] = useState("");
  const [isError, setIsError] = useState(false);

  const handlePinChange = (pin: string) => {
    if (isError) return;
    setCurrentPin(pin);
    if (pin.length === 5) {
      if (pendingSelection.g && pin === PIN_CONFIG[pendingSelection.g.toString()]) {
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
        <header className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-escola-verde">
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
                  className={`w-full flex items-center justify-between p-6 rounded-2xl bg-slate-50 border-2 transition-all duration-300 ${isActive ? 'bg-white shadow-md' : 'border-transparent hover:bg-white'}`}
                  style={{ borderColor: isActive ? gradeColor : undefined }}
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
                      const count = appData[`${g}${l}`]?.students?.length || 0;
                      return (
                        <div 
                          key={l} 
                          onClick={() => openPinModal(g, l)} 
                          className="bg-white p-4 rounded-xl border-2 border-slate-50 cursor-pointer hover:border-slate-200 text-center group transition-all"
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
    </div>
  );
}
