import React from 'react';
import Card from '../common/Card';

const ResourceUsage = ({ data }) => {
  // Sample data if none provided
  const resourceData = data || {
    totalProjects: 12,
    activeProjects: 8,
    resourceUtilization: 78,
    resourceAllocation: [
      { department: 'Engineering', allocated: 85, available: 15 },
      { department: 'Design', allocated: 70, available: 30 },
      { department: 'Marketing', allocated: 65, available: 35 },
      { department: 'HR', allocated: 40, available: 60 },
    ]
  };

  return (
    <Card title="Resource Utilization" className="h-full">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-600 font-medium">Total Projects</p>
          <p className="text-2xl font-bold">{resourceData.totalProjects}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Active Projects</p>
          <p className="text-2xl font-bold">{resourceData.activeProjects}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Overall Resource Utilization</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${
              resourceData.resourceUtilization > 90 ? 'bg-red-500' : 
              resourceData.resourceUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${resourceData.resourceUtilization}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs font-medium">{resourceData.resourceUtilization}%</span>
          <span className="text-xs text-gray-500">100%</span>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Department Allocation</h4>
        <div className="space-y-4">
          {resourceData.resourceAllocation.map((dept, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                <span className="text-sm text-gray-600">{dept.allocated}% allocated</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 flex">
                <div 
                  className={`h-2.5 rounded-l-full ${
                    dept.allocated > 90 ? 'bg-red-500' : 
                    dept.allocated > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${dept.allocated}%` }}
                ></div>
                <div 
                  className="bg-gray-300 h-2.5 rounded-r-full"
                  style={{ width: `${dept.available}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ResourceUsage;
