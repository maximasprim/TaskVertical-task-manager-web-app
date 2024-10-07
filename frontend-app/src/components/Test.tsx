import React from 'react';

const TestComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
        <img
          className="w-full h-48 object-cover"
          src="https://via.placeholder.com/400"
          alt="Sample"
        />
        <div className="py-4">
          <div className="font-bold text-xl mb-2 text-gray-900">Sample Card</div>
          <p className="text-gray-700 text-base">
            This is a sample card component to test if Tailwind CSS is working
            correctly with React. You can customize this layout as needed.
          </p>
        </div>
        <div className="pt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
