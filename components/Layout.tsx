import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crosshair, Disc, Hexagon, Square } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-void text-paper font-mono selection:bg-white selection:text-black relative">
      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[size:4rem_4rem] bg-grid-pattern opacity-20"></div>
      
      {/* Desktop Header - Technical & Brutalist */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-sm border-b border-white/20">
        <div className="flex justify-between items-stretch h-14">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center px-6 border-r border-white/20 hover:bg-white hover:text-black transition-colors duration-300 group">
            <Hexagon size={20} className="mr-3 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-display font-bold text-xl tracking-tighter">LORE<span className="font-thin">FORGE</span></span>
          </Link>

          {/* Marquee / Status Section */}
          <div className="hidden md:flex flex-1 items-center overflow-hidden border-r border-white/20 px-4">
             <div className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-concrete animate-pulse">
                System Status: Online // Node: 0.2.0 // Connection: Secure // Protocol: React-18 // Awaiting Input...
             </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-stretch">
            <NavLink to="/" active={isActive('/')} label="Index" number="01" />
            <NavLink to="/characters" active={isActive('/characters')} label="Database" number="02" />
            <NavLink to="/create" active={isActive('/create')} label="Input" number="03" />
          </nav>
        </div>
      </header>

      {/* Decorative "Useless" Sidebar elements (Desktop) */}
      <div className="fixed left-0 top-0 bottom-0 w-14 border-r border-white/10 hidden lg:flex flex-col justify-between items-center py-20 z-40 bg-void/50 pointer-events-none">
         <div className="text-[10px] text-concrete [writing-mode:vertical-rl] tracking-widest uppercase">
            Est. 2024
         </div>
         <div className="flex flex-col gap-8 text-concrete opacity-50">
            <Crosshair size={12} />
            <Square size={10} />
            <Disc size={12} />
         </div>
         <div className="text-[10px] text-concrete [writing-mode:vertical-rl] tracking-widest uppercase">
            Ref: X-99
         </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 lg:pl-14 px-4 md:px-8 pb-32 max-w-[1920px] mx-auto z-10 relative">
        {children}
      </main>

      {/* Mobile Bottom Bar - Raw & Industrial */}
      <div className="fixed bottom-0 left-0 right-0 bg-void border-t border-white/20 md:hidden z-50 flex justify-between">
         <MobileLink to="/" active={isActive('/')} label="HOME" />
         <MobileLink to="/characters" active={isActive('/characters')} label="DATA" />
         <MobileLink to="/create" active={isActive('/create')} label="NEW" />
      </div>
      
      {/* Decorative Corner Elements */}
      <div className="fixed bottom-4 right-4 hidden md:block text-[9px] text-concrete text-right z-0">
        <p>COORDINATES: {Math.random().toFixed(4)} / {Math.random().toFixed(4)}</p>
        <p>RENDER: REACT_DOM_CLIENT</p>
      </div>
    </div>
  );
};

const NavLink: React.FC<{ to: string; active: boolean; label: string; number: string }> = ({ to, active, label, number }) => (
  <Link to={to} className={`flex flex-col justify-center px-6 md:px-8 border-l border-white/10 transition-all duration-300 hover:bg-white hover:text-black group relative h-full ${active ? 'bg-white text-black' : 'text-concrete'}`}>
    <span className="text-[9px] tracking-widest mb-1 opacity-70 group-hover:opacity-100">{number}</span>
    <span className="font-display font-bold text-sm tracking-wide uppercase">{label}</span>
    {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></div>}
  </Link>
);

const MobileLink: React.FC<{ to: string; active: boolean; label: string }> = ({ to, active, label }) => (
  <Link to={to} className={`flex-1 py-4 text-center text-xs font-bold tracking-widest uppercase border-r border-white/10 last:border-r-0 ${active ? 'bg-white text-black' : 'text-concrete'}`}>
    {label}
  </Link>
);

export default Layout;