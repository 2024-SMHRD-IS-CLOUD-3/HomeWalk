import React, { createContext, useContext, useState, useEffect } from 'react';

const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const initialFamilyId = localStorage.getItem('familyId');
  const initialCreatorId = localStorage.getItem('creatorId'); 
  const initialFamilyMembers = JSON.parse(localStorage.getItem('familyMembers')) || []; // 가족 구성원 초기화

  const [familyId, setFamilyId] = useState(initialFamilyId);
  const [creatorId, setCreatorId] = useState(initialCreatorId); 
  const [familyMembers, setFamilyMembers] = useState(initialFamilyMembers); // 가족 구성원 상태 추가

  useEffect(() => {
    if (familyId) {
      localStorage.setItem('familyId', familyId);
    } else {
      localStorage.removeItem('familyId');
    }
    
    if (creatorId) {
      localStorage.setItem('creatorId', creatorId);
    } else {
      localStorage.removeItem('creatorId');
    }

    // 가족 구성원 로컬 스토리지에 저장
    if (familyMembers && familyMembers.length > 0) {
      localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    } else {
      localStorage.removeItem('familyMembers');
    }

  }, [familyId, creatorId, familyMembers]);

  return (
    <FamilyContext.Provider value={{ familyId, setFamilyId, creatorId, setCreatorId, familyMembers, setFamilyMembers }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  return useContext(FamilyContext);
};
