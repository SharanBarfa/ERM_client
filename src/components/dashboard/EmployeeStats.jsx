import React from 'react';
import Card from '../common/Card';

const EmployeeStats = ({ data }) => {
  // Sample data if none provided
  const statsData = data || {
    totalEmployees: 45,
    activeEmployees: 40,
    onLeave: 3,
    newHires: 5,
    departments: [
      { name: 'Engineering', count: 18 },
      { name: 'Design', count: 8 },
      { name: 'Marketing', count: 7 },
      { name: 'HR', count: 5 },
      { name: 'Sales', count: 7 }
    ]
  };

  return (
    <Card title="Employee Statistics" className="h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Employees</p>
          <p className="text-2xl font-bold">{statsData.totalEmployees}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Active</p>
          <p className="text-2xl font-bold">{statsData.activeEmployees}</p>
          <p className="text-xs text-gray-500">{Math.round((statsData.activeEmployees / statsData.totalEmployees) * 100)}% of total</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">On Leave</p>
          <p className="text-2xl font-bold">{statsData.onLeave}</p>
          <p className="text-xs text-gray-500">{Math.round((statsData.onLeave / statsData.totalEmployees) * 100)}% of total</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">New Hires (30 days)</p>
          <p className="text-2xl font-bold">{statsData.newHires}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Department Distribution</h4>
        <div className="space-y-3">
          {statsData.departments.map((dept, index) => (
            <div key={index} className="flex items-center">
              <span className="text-sm text-gray-600 w-24">{dept.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(dept.count / statsData.totalEmployees) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 ml-2 w-8 text-right">{dept.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default EmployeeStats;
