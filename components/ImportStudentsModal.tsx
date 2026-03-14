import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: string[]) => void;
}

export function ImportStudentsModal({ isOpen, onClose, onImport }: ImportStudentsModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedStudents, setParsedStudents] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setParsedStudents([]);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let students: string[] = [];

      if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
        students = await processExcel(file);
      } else if (extension === 'pdf') {
        students = await processPdf(file);
      } else {
        throw new Error('Formato de arquivo não suportado. Use PDF, Excel (.xlsx, .xls) ou CSV.');
      }

      if (students.length === 0) {
        throw new Error('Nenhum nome encontrado no arquivo.');
      }

      setParsedStudents(students);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar o arquivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processExcel = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON, assuming first column might contain names
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          const students = extractNamesFromRows(json);
          resolve(students);
        } catch (err) {
          reject(new Error('Erro ao ler arquivo Excel.'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processPdf = async (file: File): Promise<string[]> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return extractNamesFromText(fullText);
    } catch (err) {
      throw new Error('Erro ao ler arquivo PDF. Certifique-se de que é um PDF com texto selecionável.');
    }
  };

  const extractNamesFromRows = (rows: any[][]): string[] => {
    const names = new Set<string>();
    
    for (const row of rows) {
      for (const cell of row) {
        if (typeof cell === 'string') {
          const cleaned = cell.trim().toUpperCase();
          // Basic heuristic for a name: at least 2 words, mostly letters
          if (cleaned.length > 5 && cleaned.includes(' ') && !/\d{4}/.test(cleaned)) {
             // Let's just add any string that looks like a name or just add all strings and let user filter
             // Actually, let's be more permissive and let the user delete wrong ones later
             // Or just add strings that don't look like headers
             if (!['NOME', 'ALUNO', 'ESTUDANTE', 'MATRÍCULA'].includes(cleaned)) {
               names.add(cleaned);
             }
          } else if (cleaned.length > 2 && !/\d/.test(cleaned)) {
             // Single word names or short names without numbers
             if (!['NOME', 'ALUNO', 'ESTUDANTE', 'MATRÍCULA', 'TURMA', 'SÉRIE', 'PROFESSOR', 'ESCOLA'].includes(cleaned)) {
               names.add(cleaned);
             }
          }
        }
      }
    }
    
    return Array.from(names).filter(n => n.length > 2).sort();
  };

  const extractNamesFromText = (text: string): string[] => {
    // Split by newlines or multiple spaces
    const lines = text.split(/\n| {2,}/);
    const names = new Set<string>();

    for (const line of lines) {
      const cleaned = line.trim().toUpperCase();
      // Heuristic: names usually don't have numbers, are at least 3 chars long
      if (cleaned.length > 2 && !/\d/.test(cleaned)) {
        if (!['NOME', 'ALUNO', 'ESTUDANTE', 'MATRÍCULA', 'TURMA', 'SÉRIE', 'PROFESSOR', 'ESCOLA', 'PÁGINA', 'DATA'].includes(cleaned)) {
           // Check if it's mostly letters and spaces
           if (/^[A-ZÀ-Ÿ\s]+$/.test(cleaned)) {
             names.add(cleaned);
           }
        }
      }
    }

    return Array.from(names).sort();
  };

  const handleConfirm = () => {
    if (parsedStudents.length > 0) {
      onImport(parsedStudents);
      handleClose();
    }
  };

  const handleClose = () => {
    setParsedStudents([]);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const removeStudent = (indexToRemove: number) => {
    setParsedStudents(parsedStudents.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 className="text-lg font-black uppercase text-escola-azul tracking-widest flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-escola-azul/10 flex items-center justify-center text-escola-azul">
              <Upload className="w-4 h-4" />
            </div>
            Importar Alunos
          </h2>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {parsedStudents.length === 0 ? (
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-escola-azul bg-blue-50' : 'border-slate-300 hover:border-escola-azul hover:bg-slate-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.xlsx,.xls,.csv" 
                  onChange={handleFileSelect}
                />
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Clique ou arraste um arquivo</h3>
                <p className="text-sm text-slate-500">Suporta PDF, Excel (.xlsx, .xls) e CSV</p>
                
                {isLoading && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-escola-azul font-bold">
                    <div className="w-4 h-4 border-2 border-escola-azul border-t-transparent rounded-full animate-spin"></div>
                    Processando arquivo...
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                <h4 className="font-bold text-slate-800 mb-2">Dicas para importação:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>O sistema tentará extrair automaticamente os nomes do arquivo.</li>
                  <li>Para Excel, coloque os nomes na primeira coluna ou em uma lista simples.</li>
                  <li>Para PDF, certifique-se de que o texto é selecionável (não uma imagem escaneada).</li>
                  <li>Você poderá revisar e editar a lista antes de confirmar.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-green-50 text-green-700 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">{parsedStudents.length} alunos encontrados</span>
                </div>
                <button 
                  onClick={() => setParsedStudents([])}
                  className="text-xs font-bold uppercase hover:underline"
                >
                  Tentar outro arquivo
                </button>
              </div>

              <p className="text-sm text-slate-500 font-medium">
                Revise a lista abaixo. Remova os itens que não são nomes de alunos clicando no "X".
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto p-1">
                {parsedStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl group hover:border-escola-azul transition-colors">
                    <span className="text-xs font-bold text-slate-700 truncate pr-2">{student}</span>
                    <button 
                      onClick={() => removeStudent(index)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      title="Remover"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {parsedStudents.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
            <button 
              onClick={handleClose} 
              className="flex-1 py-3 rounded-xl font-black uppercase text-xs text-slate-500 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm} 
              className="flex-1 bg-escola-verde text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-600 transition-colors"
            >
              Importar {parsedStudents.length} Alunos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
