"use client";

import React, { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { MainApp } from '@/components/MainApp';
import { AppData, Skill } from '@/lib/types';
import { defaultSkills } from '@/lib/defaultSkills';
import { PIN_CONFIG } from '@/lib/constants';

export default function Page() {
  const [globalSkills, setGlobalSkills] = useState<Skill[]>([]);
  const [appData, setAppData] = useState<AppData>({});
  const [pinConfig, setPinConfig] = useState<Record<string, string>>(PIN_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'app'>('dashboard');
  const [currentGrade, setCurrentGrade] = useState<string>("");
  const [currentLetter, setCurrentLetter] = useState<string>("");

  useEffect(() => {
    let skills: Skill[] = JSON.parse(localStorage.getItem('edu_skills_v13') || '[]');
    if (skills.length === 0) {
      skills = defaultSkills;
    } else {
      const existingIds = new Set(skills.map(s => s.id));
      const newSkills = defaultSkills.filter(s => !existingIds.has(s.id));
      if (newSkills.length > 0) {
        skills = [...skills, ...newSkills];
      }
    }
    localStorage.setItem('edu_skills_v13', JSON.stringify(skills));
    const data = JSON.parse(localStorage.getItem('edu_data_v13') || '{}');
    const savedPinConfig = JSON.parse(localStorage.getItem('edu_pin_config_v13') || 'null');
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGlobalSkills(skills);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppData(data);
    if (savedPinConfig) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPinConfig(savedPinConfig);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  const handleUpdateAppData = (newData: AppData) => {
    setAppData(newData);
    localStorage.setItem('edu_data_v13', JSON.stringify(newData));
  };

  const handleUpdateGlobalSkills = (newSkills: Skill[]) => {
    setGlobalSkills(newSkills);
    localStorage.setItem('edu_skills_v13', JSON.stringify(newSkills));
  };

  const handleUpdatePinConfig = (newConfig: Record<string, string>) => {
    setPinConfig(newConfig);
    localStorage.setItem('edu_pin_config_v13', JSON.stringify(newConfig));
  };

  const handleSelectClass = (grade: string, letter: string) => {
    setCurrentGrade(grade);
    setCurrentLetter(letter);
    
    // Initialize class data if it doesn't exist
    const key = `${grade}${letter}`;
    if (!appData[key]) {
      handleUpdateAppData({
        ...appData,
        [key]: { students: [] }
      });
    }
    
    setCurrentScreen('app');
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center bg-[#f8fafc]">Carregando...</div>;

  return (
    <div className="h-screen overflow-hidden">
      {currentScreen === 'dashboard' ? (
        <Dashboard 
          appData={appData} 
          onSelectClass={handleSelectClass} 
          pinConfig={pinConfig}
          onUpdatePinConfig={handleUpdatePinConfig}
        />
      ) : (
        <MainApp 
          currentGrade={currentGrade}
          currentLetter={currentLetter}
          appData={appData}
          globalSkills={globalSkills}
          onGoBack={() => setCurrentScreen('dashboard')}
          onUpdateAppData={handleUpdateAppData}
          onUpdateGlobalSkills={handleUpdateGlobalSkills}
        />
      )}
    </div>
  );
}
