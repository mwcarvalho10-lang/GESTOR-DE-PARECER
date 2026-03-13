import React, { useState, useEffect, useRef } from 'react';
import { Home, Download, Edit3, Trash2, CheckCircle2, Menu } from 'lucide-react';
import { AppData, Skill, ClassData } from '@/lib/types';
import { units, subjects } from '@/lib/constants';
import { StudentModal } from './StudentModal';
import { SkillsModal } from './SkillsModal';
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface MainAppProps {
  currentGrade: string;
  currentLetter: string;
  appData: AppData;
  globalSkills: Skill[];
  onGoBack: () => void;
  onUpdateAppData: (newData: AppData) => void;
  onUpdateGlobalSkills: (newSkills: Skill[]) => void;
}

export function MainApp({ currentGrade, currentLetter, appData, globalSkills, onGoBack, onUpdateAppData, onUpdateGlobalSkills }: MainAppProps) {
  const classKey = `${currentGrade}${currentLetter}`;
  const classData: ClassData = appData[classKey] || { students: [] };

  const [selectedStudent, setSelectedStudent] = useState<string>(classData.students[0] || "");
  const [selectedUnit, setSelectedUnit] = useState<string>("Diagnóstica");
  const [activeTab, setActiveTab] = useState<string>("portugues");
  const [searchStudent, setSearchStudent] = useState("");

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState("");
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!classData.students.includes(selectedStudent)) {
      setSelectedStudent(classData.students[0] || "");
    }
  }, [classData.students, selectedStudent]);

  const handleAddStudent = (name: string) => {
    if (!name) return;
    if (classData.students.includes(name)) {
      alert("ESTUDANTE JÁ CADASTRADO.");
      return;
    }
    const newStudents = [...classData.students, name].sort();
    const newStudentData: any = {};
    units.forEach(u => newStudentData[u] = { skills: [], observation: "" });
    
    onUpdateAppData({
      ...appData,
      [classKey]: {
        ...classData,
        students: newStudents,
        [name]: newStudentData
      }
    });
    setStudentModalOpen(false);
    setSelectedStudent(name);
  };

  const handleEditStudent = (newName: string) => {
    if (!newName || newName === studentToEdit) {
      setStudentModalOpen(false);
      return;
    }
    if (classData.students.includes(newName)) {
      alert("JÁ EXISTE UM ALUNO COM ESTE NOME.");
      return;
    }
    const newStudents = classData.students.map(s => s === studentToEdit ? newName : s).sort();
    const studentData = classData[studentToEdit];
    
    const newClassData: ClassData = { ...classData, students: newStudents, [newName]: studentData };
    delete newClassData[studentToEdit];

    onUpdateAppData({
      ...appData,
      [classKey]: newClassData
    });
    
    if (selectedStudent === studentToEdit) {
      setSelectedStudent(newName);
    }
    setStudentModalOpen(false);
  };

  const handleDeleteStudent = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`REMOVER DEFINITIVAMENTE O ALUNO ${name}?`)) {
      const newStudents = classData.students.filter(s => s !== name);
      const newClassData: ClassData = { ...classData, students: newStudents };
      delete newClassData[name];
      
      onUpdateAppData({
        ...appData,
        [classKey]: newClassData
      });
      
      if (selectedStudent === name) {
        setSelectedStudent(newStudents[0] || "");
      }
    }
  };

  const toggleSkill = (skillId: string) => {
    if (!selectedStudent) return;
    const studentUnitData = classData[selectedStudent][selectedUnit];
    let newSkills = [...studentUnitData.skills];
    
    if (newSkills.includes(skillId)) {
      newSkills = newSkills.filter(id => id !== skillId);
    } else {
      newSkills.push(skillId);
    }
    
    onUpdateAppData({
      ...appData,
      [classKey]: {
        ...classData,
        [selectedStudent]: {
          ...classData[selectedStudent],
          [selectedUnit]: {
            ...studentUnitData,
            skills: newSkills
          }
        }
      }
    });
  };

  const handleManualEdit = () => {
    if (!selectedStudent || !reportRef.current) return;
    const text = reportRef.current.innerText.toUpperCase();
    
    onUpdateAppData({
      ...appData,
      [classKey]: {
        ...classData,
        [selectedStudent]: {
          ...classData[selectedStudent],
          [selectedUnit]: {
            ...classData[selectedStudent][selectedUnit],
            observation: text
          }
        }
      }
    });
  };

  const filteredStudents = classData.students.filter(s => s.toLowerCase().includes(searchStudent.toLowerCase()));

  const getStats = () => {
    const total = classData.students.length;
    if (total === 0) return "0%";
    let done = 0;
    classData.students.forEach(s => {
      if (classData[s][selectedUnit].skills.length > 0 || classData[s][selectedUnit].observation) done++;
    });
    return Math.round((done / total) * 100) + "%";
  };

  const currentStudentData = selectedStudent ? classData[selectedStudent][selectedUnit] : null;
  const currentSkills = globalSkills
    .filter(s => s.subject === activeTab && s.grade === currentGrade)
    .sort((a, b) => a.id.localeCompare(b.id));

  const subjectOrder = ['portugues', 'matematica', 'ciencias', 'historia'];

  const formatReportText = (studentName: string, unit: string, skills: Skill[]) => {
    if (skills.length === 0) return "";
    const skillTexts = skills.map(s => {
      let text = s.report.trim();
      if (text.endsWith('.')) text = text.slice(0, -1);
      return text;
    });
    let joinedSkills = "";
    if (skillTexts.length === 1) {
      joinedSkills = skillTexts[0];
    } else {
      const lastSkill = skillTexts.pop();
      joinedSkills = skillTexts.join(", ") + " E " + lastSkill;
    }
    return `O(A) ESTUDANTE ${studentName}, NA ETAPA ${unit}, DEMONSTROU QUE ${joinedSkills}.`.toUpperCase();
  };

  let reportText = "SELECIONE UM ESTUDANTE...";
  if (selectedStudent && currentStudentData) {
    const selectedSkills = globalSkills
      .filter(s => currentStudentData.skills.includes(s.id) && s.grade === currentGrade)
      .sort((a, b) => {
        const orderA = subjectOrder.indexOf(a.subject);
        const orderB = subjectOrder.indexOf(b.subject);
        if (orderA !== orderB) return orderA - orderB;
        return a.id.localeCompare(b.id);
      });
    if (selectedSkills.length > 0) {
      reportText = formatReportText(selectedStudent, selectedUnit, selectedSkills);
    } else {
      reportText = (currentStudentData.observation || "AGUARDANDO SELEÇÃO DE HABILIDADES...").toUpperCase();
    }
  }

  useEffect(() => {
    if (reportRef.current && document.activeElement !== reportRef.current) {
      reportRef.current.innerText = reportText;
    }
  }, [reportText, selectedStudent, selectedUnit]);

  const exportIndividualDocx = async (type: 'unit' | 'history') => {
    if (!selectedStudent) return;
    const children = [
      new Paragraph({ text: "E. M. RAYMUNDO LEMOS SANTANA", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }), 
      new Paragraph({ text: `PARECER PEDAGÓGICO - ${selectedStudent}`, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER, spacing: { after: 300 } })
    ];
    const unitsToExport = type === 'unit' ? [selectedUnit] : units;
    
    unitsToExport.forEach(u => {
      const data = classData[selectedStudent][u];
      const selected = globalSkills
        .filter(sk => data.skills.includes(sk.id) && sk.grade === currentGrade)
        .sort((a, b) => {
          const orderA = subjectOrder.indexOf(a.subject);
          const orderB = subjectOrder.indexOf(b.subject);
          if (orderA !== orderB) return orderA - orderB;
          return a.id.localeCompare(b.id);
        });
      const text = selected.length > 0 ? formatReportText(selectedStudent, u, selected) : (data.observation || "NÃO PREENCHIDO");
      children.push(new Paragraph({ text: u.toUpperCase(), heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }));
      children.push(new Paragraph({ text: text.toUpperCase(), alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 } }));
    });
    
    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `PARECER_${selectedStudent}.docx`);
  };

  const exportBatchDocx = async () => {
    if (classData.students.length === 0) return;
    const children = [
      new Paragraph({ text: `RELATÓRIO DE UNIDADE - ${currentGrade}º ${currentLetter} - ${selectedUnit}`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 400 } })
    ];
    
    classData.students.forEach(s => {
      const data = classData[s][selectedUnit];
      const selected = globalSkills
        .filter(sk => data.skills.includes(sk.id) && sk.grade === currentGrade)
        .sort((a, b) => {
          const orderA = subjectOrder.indexOf(a.subject);
          const orderB = subjectOrder.indexOf(b.subject);
          if (orderA !== orderB) return orderA - orderB;
          return a.id.localeCompare(b.id);
        });
      const text = selected.length > 0 ? formatReportText(s, selectedUnit, selected) : (data.observation || "NÃO PREENCHIDO");
      children.push(new Paragraph({ text: `ESTUDANTE: ${s}`, heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ text: text.toUpperCase(), alignment: AlignmentType.JUSTIFIED, spacing: { after: 300 } }));
    });
    
    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `TURMA_${classKey}_${selectedUnit}.docx`);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="h-16 bg-white flex items-center justify-between px-6 shrink-0 border-b-4 border-escola-azul z-50">
        <div className="flex items-center gap-4">
          <button onClick={onGoBack} className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase">Turma <span>{currentGrade}º {currentLetter}</span></h1>
            <p className="text-[9px] text-escola-verde font-bold uppercase tracking-widest">Gestão de Pareceres</p>
          </div>
        </div>
        <div className="hidden md:flex bg-slate-100 p-1 rounded-2xl gap-1">
          {units.map(u => (
            <button 
              key={u} 
              onClick={() => setSelectedUnit(u)} 
              className={`px-4 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${selectedUnit === u ? 'bg-white text-escola-azul shadow-sm -translate-y-[1px]' : 'text-slate-400'}`}
            >
              {u}
            </button>
          ))}
        </div>
        <button onClick={exportBatchDocx} className="bg-escola-azul text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <Download className="w-4 h-4" /> Exportar Turma
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-white border-r flex flex-col shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden border-none'}`}>
          <div className="w-72 flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudantes</h2>
                <span className="text-[10px] font-black text-escola-verde bg-green-50 px-2 py-0.5 rounded">{getStats()}</span>
              </div>
              <input 
                type="text" 
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                placeholder="BUSCAR..." 
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold uppercase outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-6">
              {filteredStudents.map(s => (
                <div key={s} className="group relative flex items-center">
                  <button 
                    onClick={() => setSelectedStudent(s)} 
                    className={`flex-1 text-left px-4 py-3 rounded-xl text-[11px] font-bold transition-all ${selectedStudent === s ? 'bg-escola-azul text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span className="truncate uppercase block pr-14">{s}</span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 z-20">
                    <button onClick={(e) => { e.stopPropagation(); setStudentToEdit(s); setStudentModalOpen(true); }} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-slate-500 hover:text-escola-azul shadow-sm border border-slate-100 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => handleDeleteStudent(s, e)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm border border-slate-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button onClick={() => { setStudentToEdit(""); setStudentModalOpen(true); }} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase hover:bg-slate-50 transition-colors">
                + Estudante
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
          <nav className="h-14 bg-white border-b flex items-center px-8 gap-8 shrink-0">
            {subjects.map(sub => (
              <button 
                key={sub.id} 
                onClick={() => setActiveTab(sub.id)} 
                className={`relative py-4 text-[11px] font-black uppercase transition-all ${activeTab === sub.id ? 'text-escola-azul' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {sub.label}
                {activeTab === sub.id && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-escola-verde rounded-t-lg" />}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-[10px] font-black text-escola-azul uppercase tracking-widest">Habilidades</h3>
                <button onClick={() => setSkillsModalOpen(true)} className="text-[9px] font-black text-escola-verde hover:underline">GERENCIAR HABILIDADES</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {currentSkills.map(s => {
                  const isSet = currentStudentData?.skills.includes(s.id);
                  return (
                    <div 
                      key={s.id} 
                      onClick={() => toggleSkill(s.id)} 
                      className={`group relative px-4 py-3 bg-white border-2 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center min-w-[100px] ${isSet ? 'border-escola-verde bg-green-50/20 ring-2 ring-green-100' : 'border-slate-100 hover:border-slate-300'}`}
                      style={!isSet ? { borderBottom: `3px solid ${s.color || '#f1f5f9'}` } : {}}
                    >
                      <span className={`text-[11px] font-black uppercase ${isSet ? 'text-escola-verde' : 'text-slate-500'}`}>{s.id}</span>
                      {isSet && <CheckCircle2 className="ml-2 w-3.5 h-3.5 text-escola-verde" />}
                      
                      {/* Minimalist Flashcard Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-5 bg-white border border-slate-200 text-slate-700 text-xs font-bold leading-relaxed rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none shadow-2xl origin-bottom scale-95 group-hover:scale-100">
                        <div className="text-[10px] font-black text-escola-azul uppercase tracking-widest mb-2">{s.id}</div>
                        {s.report}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="max-w-5xl mx-auto w-full pb-20">
              <div className="bg-white rounded-3xl shadow-xl border-t-4 border-escola-azul overflow-hidden">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                  <span className="text-xs font-black uppercase">{selectedStudent || "--"}</span>
                  <div className="flex gap-4">
                    <button onClick={() => exportIndividualDocx('unit')} className="text-[9px] bg-escola-azul px-3 py-2 rounded-lg hover:opacity-90 font-bold uppercase flex items-center gap-2">
                      <Download className="w-3.5 h-3.5" /> Unidade
                    </button>
                    <button onClick={() => exportIndividualDocx('history')} className="text-[9px] bg-escola-azul px-3 py-2 rounded-lg hover:opacity-90 font-bold uppercase flex items-center gap-2">
                      <Download className="w-3.5 h-3.5" /> Histórico
                    </button>
                  </div>
                </div>
                <div className="p-10">
                  <div 
                    ref={reportRef}
                    contentEditable={!!selectedStudent} 
                    onInput={handleManualEdit}
                    onBlur={handleManualEdit}
                    className="font-['Plus_Jakarta_Sans'] leading-[1.8] text-[14px] outline-none p-[30px] rounded-xl uppercase text-justify bg-white border border-[#eef2f6] text-black min-h-[350px]"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <StudentModal 
        isOpen={studentModalOpen} 
        initialName={studentToEdit} 
        onClose={() => setStudentModalOpen(false)} 
        onConfirm={studentToEdit ? handleEditStudent : handleAddStudent} 
      />
      
      <SkillsModal 
        isOpen={skillsModalOpen} 
        onClose={() => setSkillsModalOpen(false)} 
        globalSkills={globalSkills}
        onSaveSkill={(skill) => onUpdateGlobalSkills([...globalSkills, skill])}
        onDeleteSkill={(idx) => {
          const newSkills = [...globalSkills];
          newSkills.splice(idx, 1);
          onUpdateGlobalSkills(newSkills);
        }}
      />
    </div>
  );
}
