export interface Skill {
  id: string;
  grade: string;
  subject: string;
  report: string;
  color: string;
}

export interface UnitData {
  skills: string[];
  observation: string;
}

export interface StudentData {
  [unit: string]: UnitData;
}

export interface ClassData {
  students: string[];
  [studentName: string]: any; // StudentData | string[]
}

export interface AppData {
  [classKey: string]: ClassData;
}
