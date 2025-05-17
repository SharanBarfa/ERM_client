import React from 'react';

const TestComponent = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Routing Test Component</h2>
      <p className="mb-2">If you can see this component, routing is working correctly!</p>
      <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
        Success! The component rendered properly.
      </div>
    </div>
  );
};

export default TestComponent;
