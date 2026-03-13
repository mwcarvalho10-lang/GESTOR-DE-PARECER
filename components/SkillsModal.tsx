import React, { useState, useEffect } from 'react';
import { Settings, X, PlusCircle, Search, Trash2 } from 'lucide-react';
import { Skill } from '@/lib/types';
import { subjects, gradesArr, subjectPalettes } from '@/lib/constants';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  globalSkills: Skill[];
  onSaveSkill: (skill: Skill) => void;
  onDeleteSkill: (index: number) => void;
}

export function SkillsModal({ isOpen, onClose, globalSkills, onSaveSkill, onDeleteSkill }: SkillsModalProps) {
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillGrade, setNewSkillGrade] = useState("1");
  const [newSkillSubject, setNewSkillSubject] = useState("portugues");
  const [newSkillReport, setNewSkillReport] = useState("");
  const [selectedColor, setSelectedColor] = useState(subjectPalettes['portugues'][0]);

  const [filterGrade, setFilterGrade] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedColor(subjectPalettes[newSkillSubject][0]);
  }, [newSkillSubject]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newSkillId.trim() || !newSkillReport.trim()) return;
    onSaveSkill({
      id: newSkillId.trim().toUpperCase(),
      grade: newSkillGrade,
      subject: newSkillSubject,
      report: newSkillReport.trim().toUpperCase(),
      color: selectedColor
    });
    setNewSkillId("");
    setNewSkillReport("");
  };

  const subjectOrder = ['portugues', 'matematica', 'ciencias', 'historia'];

  const filteredSkills = globalSkills.filter(s => {
    const matchGrade = filterGrade === 'all' || s.grade === filterGrade;
    const matchSub = filterSubject === 'all' || s.subject === filterSubject;
    const matchSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.report.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSub && matchSearch;
  }).sort((a, b) => {
    const orderA = subjectOrder.indexOf(a.subject);
    const orderB = subjectOrder.indexOf(b.subject);
    if (orderA !== orderB) return orderA - orderB;
    return a.id.localeCompare(b.id);
  });

  const exportSkillsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(globalSkills));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "habilidades_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-3xl w-[95vw] h-[90vh] max-w-6xl shadow-2xl flex flex-col overflow-hidden">
        <header className="p-6 border-b flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-escola-azul/10 rounded-xl flex items-center justify-center text-escola-azul">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase text-slate-800 tracking-wider text-sm">Banco de Habilidades</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Personalização e Gestão</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="text-slate-400" />
          </button>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 bg-slate-50 p-6 border-r space-y-6 overflow-y-auto shrink-0">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cadastrar Nova</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={newSkillId}
                  onChange={e => setNewSkillId(e.target.value)}
                  placeholder="CÓDIGO (BNCC)" 
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 ring-escola-azul/20"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select value={newSkillGrade} onChange={e => setNewSkillGrade(e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none">
                    {gradesArr.map(g => <option key={g} value={g}>{g}º Ano</option>)}
                  </select>
                  <select value={newSkillSubject} onChange={e => setNewSkillSubject(e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none">
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>

                <textarea 
                  value={newSkillReport}
                  onChange={e => setNewSkillReport(e.target.value)}
                  placeholder="TEXTO DO PARECER..." 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold h-32 uppercase outline-none resize-none focus:ring-2 ring-escola-azul/20"
                />
                
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-3">Identificador Visual da Matéria</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {subjectPalettes[newSkillSubject].map((c, idx) => (
                      <div key={c} className="flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="skill-color" 
                          id={`c-${c}`} 
                          className="hidden" 
                          value={c} 
                          checked={selectedColor === c}
                          onChange={() => setSelectedColor(c)}
                        />
                        <label htmlFor={`c-${c}`} className={`w-5 h-5 rounded-full cursor-pointer border-2 ${selectedColor === c ? 'border-slate-400' : 'border-white'} ring-1 ring-slate-200`} style={{ backgroundColor: c }}></label>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleSave} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black uppercase text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Adicionar ao Banco
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex gap-2">
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                  <button onClick={() => setFilterGrade('all')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filterGrade === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Todos</button>
                  {gradesArr.map(g => (
                    <button key={g} onClick={() => setFilterGrade(g.toString())} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filterGrade === g.toString() ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>{g}º</button>
                  ))}
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                  <button onClick={() => setFilterSubject('all')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filterSubject === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Todas</button>
                  {subjects.map(s => (
                    <button key={s.id} onClick={() => setFilterSubject(s.id)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filterSubject === s.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>{s.label.split('/')[0]}</button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="FILTRAR TEXTO..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase outline-none"
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4 content-start">
              {filteredSkills.map((s, idx) => (
                <div key={idx} className="p-5 bg-white rounded-2xl border-l-8 shadow-sm border border-slate-100 relative group transition-all hover:shadow-md" style={{ borderLeftColor: s.color || '#cbd5e1' }}>
                  <button onClick={() => { if(confirm("EXCLUIR HABILIDADE?")) onDeleteSkill(globalSkills.indexOf(s)); }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-slate-800 uppercase">{s.id}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{s.grade}º ANO • {s.subject}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 uppercase leading-relaxed">{s.report}</p>
                </div>
              ))}
            </div>
            
            <footer className="p-4 border-t bg-slate-50 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase">{filteredSkills.length} Habilidades</span>
              <div className="flex gap-2">
                <button onClick={exportSkillsJSON} className="text-[9px] font-bold text-slate-500 uppercase hover:text-escola-azul">Exportar Backup</button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
