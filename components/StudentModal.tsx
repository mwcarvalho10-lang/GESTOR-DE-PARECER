import React, { useState, useEffect } from 'react';

interface StudentModalProps {
  isOpen: boolean;
  initialName: string;
  initialActive?: boolean;
  onClose: () => void;
  onConfirm: (name: string, active: boolean) => void;
}

export function StudentModal({ isOpen, initialName, initialActive = true, onClose, onConfirm }: StudentModalProps) {
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialName);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(initialActive);
    }
  }, [isOpen, initialName, initialActive]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-3xl w-full max-w-[340px] p-8 shadow-2xl border border-slate-100">
        <h3 className="font-black uppercase text-center text-escola-azul mb-6 tracking-widest">
          {initialName ? "Editar Estudante" : "Novo Estudante"}
        </h3>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="NOME COMPLETO" 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold uppercase mb-4 outline-none border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
        />
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-[10px] font-black uppercase text-slate-500">Status do Aluno</span>
          <button 
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? 'bg-escola-verde' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 p-4 font-black text-slate-400 uppercase text-[10px]">Cancelar</button>
          <button onClick={() => onConfirm(name, active)} className="flex-1 bg-escola-azul text-white p-4 rounded-xl font-black uppercase text-[10px] shadow-lg">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
