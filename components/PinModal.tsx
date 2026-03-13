import React from 'react';
import { X, Delete } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  targetGrade: number | null;
  targetLetter: string | null;
  currentPin: string;
  isError: boolean;
  onPinChange: (pin: string) => void;
  onCancel: () => void;
}

export function PinModal({ isOpen, targetGrade, targetLetter, currentPin, isError, onPinChange, onCancel }: PinModalProps) {
  if (!isOpen) return null;

  const handlePress = (num: string) => {
    if (currentPin.length < 5) {
      onPinChange(currentPin + num);
    }
  };

  const handleBackspace = () => {
    onPinChange(currentPin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <div className={`bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[340px] border-t-4 transition-all ${isError ? 'animate-shake border-red-500' : 'border-escola-azul'}`}>
        <div className="text-center mb-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Acesso do Professor</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
            Turma <span className="text-escola-azul">{targetGrade}º {targetLetter}</span>
          </p>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all ${i < currentPin.length ? (isError ? 'bg-red-500 border-red-500 scale-125' : 'bg-escola-azul border-escola-azul scale-125') : 'border-slate-300'}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} onClick={() => handlePress(num.toString())} className="h-14 rounded-xl bg-slate-50 hover:bg-slate-100 text-lg font-bold">
              {num}
            </button>
          ))}
          <button onClick={onCancel} className="h-14 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
            <X />
          </button>
          <button onClick={() => handlePress('0')} className="h-14 rounded-xl bg-slate-50 hover:bg-slate-100 text-lg font-bold">
            0
          </button>
          <button onClick={handleBackspace} className="h-14 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <Delete />
          </button>
        </div>
      </div>
    </div>
  );
}
