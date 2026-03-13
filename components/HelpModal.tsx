import React from 'react';
import { Home, Download, Edit3, CheckCircle2, Menu, Clock, Plus, BookOpen, FileText } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 className="text-lg font-black uppercase text-escola-azul tracking-widest flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-escola-azul/10 flex items-center justify-center text-escola-azul">
              ?
            </div>
            Guia de Uso
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mt-1">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-sm mb-1">1. Adicionar Estudantes</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Na barra lateral esquerda, clique no botão <strong>+ ESTUDANTE</strong> para cadastrar os alunos da turma. Você pode definir se o aluno está <strong>Ativo</strong> ou <strong>Inativo</strong>. Alunos inativos não aparecerão na exportação final.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mt-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-sm mb-1">2. Avaliar Habilidades</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Selecione um aluno e navegue pelas abas das disciplinas (Português, Matemática, etc.). Clique nas habilidades que o aluno desenvolveu. As habilidades selecionadas ficarão destacadas em azul.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mt-1">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-sm mb-1">3. Parecer Descritivo</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Na área de texto abaixo das habilidades, você pode escrever observações adicionais sobre o aluno. O texto gerado automaticamente com base nas habilidades selecionadas aparecerá na exportação junto com suas observações.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mt-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-sm mb-1">4. Acompanhar o Progresso</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Na lista de alunos, um ícone de <strong>relógio amarelo</strong> indica que o aluno ainda não foi avaliado na unidade atual. Um <strong>check verde</strong> indica que ele já possui habilidades marcadas ou um parecer escrito.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mt-1">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-sm mb-1">5. Exportar Relatórios</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Quando terminar, clique em <strong>EXPORTAR TURMA</strong> no canto superior direito. Será gerado um arquivo do Word (.docx) contendo os pareceres de todos os alunos ativos da turma, organizados e formatados.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
          <button onClick={onClose} className="w-full bg-escola-azul text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-blue-700 transition-colors">
            Entendi, vamos começar!
          </button>
        </div>
      </div>
    </div>
  );
}
