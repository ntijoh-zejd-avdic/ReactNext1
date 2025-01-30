'use client';

import { useState } from 'react';

export default function FartButton() {
  const [isStyled, setIsStyled] = useState(true); // State to toggle styles

  const toggleStyles = () => {
    setIsStyled(!isStyled); // Toggle the styling
    alert("Fart Man is here!");
  };

  return (
    <div
      className={`h-screen overflow-hidden ${isStyled ? 'bg-gradient-to-br from-gray-600 to-red-500' : 'bg-white'}`}
    >
      {/* Main Content */}
      <div className={`grid grid-rows-[1fr] items-center justify-items-center h-full p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]`}>
        <main className="flex flex-col gap-8 items-center sm:items-start">
          <h1 className={`text-4xl font-bold ${isStyled ? 'text-white' : 'text-black'}`}>
            Your To-Do Lists
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
            <div
              className={`p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition ${isStyled ? 'bg-gray-900' : 'bg-gray-100'}`}
            >
              <h2 className={`text-xl font-semibold ${isStyled ? 'text-white' : 'text-black'}`}>
                Example List
              </h2>
              <p className={`${isStyled ? 'text-gray-400' : 'text-gray-700'}`}>0 tasks completed</p>
              <ul className={`${isStyled ? 'text-gray-200' : 'text-gray-900'}`}>
                <li>- Example Task</li>
              </ul>
              <button
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600`}
                onClick={toggleStyles}
              >
                Fart Man
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
