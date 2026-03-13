export const PIN_CONFIG: Record<string, string> = { "1": "20261", "2": "20262", "3": "20263", "4": "20264", "5": "20265" };
export const units = ["Diagnóstica", "I Unid", "II Unid", "III Unid", "Final"];
export const gradesArr = [1, 2, 3, 4, 5];
export const lettersArr = ["A", "B", "C", "D"];

export const subjectPalettes: Record<string, string[]> = {
  portugues: ['#0ea5e9', '#0284c7', '#0369a1', '#0c4a6e', '#38bdf8', '#7dd3fc', '#bae6fd', '#075985', '#2563eb', '#1d4ed8'],
  matematica: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#f87171', '#fca5a5', '#fecaca', '#450a0a', '#eb5e5e'],
  ciencias: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#4ade80', '#86efac', '#bbf7d0', '#064e3b', '#10b981'],
  historia: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#fbbf24', '#fcd34d', '#fde68a', '#451a03', '#fb923c']
};

export const subjects = [
  { id: 'portugues', label: 'Linguagens' },
  { id: 'matematica', label: 'Matemática' },
  { id: 'ciencias', label: 'Ciências' },
  { id: 'historia', label: 'História/Geo' }
];
