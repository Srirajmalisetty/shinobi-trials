import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0c0c1f] border-t border-[#28283d] py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-lg">shield</span>
          </div>
          <div>
            <span className="font-headline font-bold text-on-surface text-lg">SHINOBI TRIALS</span>
            <p className="font-body text-xs text-on-surface-variant">
              Leaf Village Official Certification &amp; AI Academy • Vol. VIII
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-label text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Village Gates</Link>
          <Link to="/missions" className="hover:text-primary transition-colors">Mission Board</Link>
          <Link to="/dashboard" className="hover:text-primary transition-colors">Shinobi ID</Link>
          <Link to="/admin" className="hover:text-primary transition-colors">Sensei Archive</Link>
        </div>

        <p className="font-label text-xs text-[#737686]">
          &copy; {new Date().getFullYear()} Hidden Leaf Council. All Jutsu Registered.
        </p>
      </div>
    </footer>
  );
};
