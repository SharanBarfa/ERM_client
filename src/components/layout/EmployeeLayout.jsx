import React from 'react';
import TopBar from '../common/TopBar';

const EmployeeLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
