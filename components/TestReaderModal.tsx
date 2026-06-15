import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X, Loader2, FileImage } from 'lucide-react';
import { Skill } from '@/lib/types';

interface TestReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillsDetected: (skillIds: string[]) => void;
  availableSkills: Skill[];
  subject: string;
  grade: string;
}

export function TestReaderModal({ isOpen, onClose, onSkillsDetected, availableSkills, subject, grade }: TestReaderModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        const base64Str = event.target.result.split(',')[1];
        setSelectedImage(base64Str);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/analyze-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: mimeType,
          subject,
          grade,
          skillsContext: availableSkills.map(s => ({ id: s.id, description: s.report }))
        })
      });

      if (!response.ok) {
        throw new Error("Erro na análise");
      }

      const data = await response.json();
      if (data.skillIds && Array.isArray(data.skillIds)) {
        onSkillsDetected(data.skillIds);
        onClose();
        setTimeout(() => setSelectedImage(null), 300);
      }
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao analisar a prova. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedImage(null);
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 className="text-lg font-black uppercase text-escola-azul tracking-widest flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-escola-azul/10 flex items-center justify-center text-escola-azul">
              <Sparkles className="w-4 h-4" />
            </div>
            Leitura de Prova com IA
          </h2>
          <button onClick={handleClose} disabled={isProcessing} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors disabled:opacity-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex-1 text-center">
          <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">
            Envie uma foto da prova do aluno. A IA analisará as respostas corretas e sugerirá as habilidades atingidas.
          </p>

          {!selectedImage ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm uppercase mb-1">Tirar foto ou anexar imagem</h3>
              <p className="text-xs text-slate-400 font-medium">Arquivos JPEG, PNG compatíveis</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden border-2 border-slate-200">
                <img src={`data:${mimeType};base64,${selectedImage}`} alt="Prova renderizada" className="w-full h-full object-cover" />
                {!isProcessing && (
                  <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isProcessing && (
                <div className="flex flex-col items-center gap-2 text-escola-azul animate-pulse pt-4">
                  <div className="relative w-12 h-12">
                    <Loader2 className="w-12 h-12 animate-spin text-escola-azul/30" />
                    <Sparkles className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-escola-azul" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest mt-2">A IA está lendo a prova...</span>
                </div>
              )}
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {selectedImage && !isProcessing && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
            <button onClick={handleAnalyze} className="w-full bg-escola-verde text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Analisar Respostas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
