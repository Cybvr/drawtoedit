import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border shadow-md z-10">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-md"></div>
        <h1 className="text-xl font-bold text-foreground tracking-wider">Juju</h1>
        <span className="text-xs font-mono bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded">nanobanana</span>
      </div>
    </header>
  );
};