import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream flex flex-col justify-center items-center px-4 font-sans space-y-6">
      <h1 className="text-8xl md:text-9xl font-cinzel text-caveno-card select-none">404</h1>
      <p className="text-lg md:text-xl text-caveno-gold uppercase font-cinzel tracking-widest">
        The Ritual is Scattered
      </p>
      <p className="text-caveno-muted max-w-sm text-center text-sm">
        This dark corridor does not exist. Return to safety to preserve your espresso beans.
      </p>
      <a
        href="/"
        className="px-6 py-2 border border-caveno-gold text-caveno-gold text-xs uppercase tracking-wider hover:bg-caveno-gold hover:text-caveno-black transition duration-300"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
