// app/context/AppContext.js
import React, { createContext, useState, useContext } from 'react';

// Tạo context
const AppContext = createContext();

// Hàm Provider
export const AppProvider = ({ children }) => {
  const [companyId, setCompanyId] = useState('');

  return (
    <AppContext.Provider value={{ companyId, setCompanyId }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook để sử dụng Context
export const useAppContext = () => useContext(AppContext);
