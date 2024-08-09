import React, { createContext, useContext, useState, useEffect } from 'react';

const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const initialFamilyId = localStorage.getItem('familyId');
  const initialCreatorId = localStorage.getItem('creatorId'); // 추가된 부분
  const [familyId, setFamilyId] = useState(initialFamilyId);
  const [creatorId, setCreatorId] = useState(initialCreatorId); // 추가된 부분

  useEffect(() => {
    if (familyId) {
      localStorage.setItem('familyId', familyId);
    } else {
      localStorage.removeItem('familyId');
    }
    
    if (creatorId) { // 추가된 부분
      localStorage.setItem('creatorId', creatorId);
    } else {
      localStorage.removeItem('creatorId');
    }
  }, [familyId, creatorId]); // 추가된 부분

  return (
    <FamilyContext.Provider value={{ familyId, setFamilyId, creatorId, setCreatorId }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  return useContext(FamilyContext);
};
