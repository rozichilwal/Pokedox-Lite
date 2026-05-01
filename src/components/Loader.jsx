import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-16 pb-10">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold text-purple-800 mt-6 animate-pulse tracking-wide">
        Catching 'em all...
      </h2>
    </div>
  );
};

export default Loader;