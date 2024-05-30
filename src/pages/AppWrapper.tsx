import React from 'react';
import { ToastContainer } from 'react-toastify';
interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        toastStyle={{
          color: '#000',
          fontSize: '18px',
          padding: '20px',
          borderRadius: '8px',
        }}
        style={{ width: '400px' }}
      />
    </>
  );
};

export default AppWrapper;