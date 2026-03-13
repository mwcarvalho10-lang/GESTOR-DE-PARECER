import React, { useState, useEffect } from 'react';

interface StudentModalProps {
  isOpen: boolean;
  initialName: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function StudentModal({ isOpen, initialName, onClose, onConfirm }: StudentModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialName);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-3xl w-full max-w-[340px] p-8 shadow-2xl border-4 border-escola-azul">
        <h3 className="font-black uppercase text-center text-escola-azul mb-6 tracking-widest">
          {initialName ? "Editar Estudante" : "Novo Estudante"}
        </h3>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="NOME COMPLETO" 
          className="w-full p-4 bg-slate-50 rounded-xl text-xs font-bold uppercase mb-4 outline-none border-2 border-escola-azul/20 focus:border-escola-azul transition-colors"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 p-4 font-black text-slate-400 uppercase text-[10px]">Cancelar</button>
          <button onClick={() => onConfirm(name)} className="flex-1 bg-escola-azul text-white p-4 rounded-xl font-black uppercase text-[10px] shadow-lg">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
