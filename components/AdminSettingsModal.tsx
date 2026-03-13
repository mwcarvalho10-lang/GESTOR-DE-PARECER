import React, { useState } from 'react';
import { Lock, Save, X } from 'lucide-react';
import { gradesArr } from '@/lib/constants';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinConfig: Record<string, string>;
  onSave: (newConfig: Record<string, string>) => void;
}

export function AdminSettingsModal({ isOpen, onClose, pinConfig, onSave }: AdminSettingsModalProps) {
  const [step, setStep] = useState<'auth' | 'settings'>('auth');
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState(false);
  const [localConfig, setLocalConfig] = useState(pinConfig);

  if (!isOpen) return null;

  const handleAuth = () => {
    if (adminPin === '2026W') {
      setStep('settings');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
    setTimeout(() => {
      setStep('auth');
      setAdminPin('');
    }, 300);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('auth');
      setAdminPin('');
      setLocalConfig(pinConfig);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-black uppercase text-escola-azul tracking-widest flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-escola-azul/10 flex items-center justify-center text-escola-azul">
              <Lock className="w-4 h-4" />
            </div>
            Configurações Admin
          </h2>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {step === 'auth' ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 font-medium text-center mb-6">
                Digite o PIN de administrador para acessar as configurações.
              </p>
              <div>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value.toUpperCase())}
                  placeholder="PIN ADMIN"
                  className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest outline-none transition-colors ${error ? 'border-red-500 text-red-500' : 'border-slate-200 focus:border-escola-azul'}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs font-bold text-center mt-2">PIN incorreto!</p>}
              </div>
              <button onClick={handleAuth} className="w-full bg-escola-azul text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-blue-700 transition-colors mt-4">
                Acessar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 font-medium mb-4">
                Altere o PIN de acesso para cada ano escolar (5 dígitos).
              </p>
              <div className="space-y-3">
                {gradesArr.map(g => (
                  <div key={g} className="flex items-center gap-4">
                    <label className="w-20 text-xs font-black text-slate-700 uppercase">{g}º Ano</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={localConfig[g.toString()] || ''}
                      onChange={(e) => setLocalConfig({ ...localConfig, [g.toString()]: e.target.value })}
                      className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold tracking-widest outline-none focus:border-escola-azul"
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="w-full bg-escola-verde text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-600 transition-colors mt-6 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Salvar Configurações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
