import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-primary">INTELLMEET</h1>
        <p className="text-xl text-secondary">Enterprise AI Meetings & Collaboration</p>
        <div className="flex gap-4 justify-center mt-8">
          <button className="px-6 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors">
            Login
          </button>
          <button className="px-6 py-2 bg-surface border border-secondary hover:border-gray-400 rounded-lg transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
