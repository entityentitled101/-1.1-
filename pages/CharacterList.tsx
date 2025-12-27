import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import CharacterCard from '../components/CharacterCard';
import { Search, ListFilter } from 'lucide-react';
import { CharacterRole } from '../types';

const CharacterList: React.FC = () => {
  const { characters } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');

  const filtered = characters.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'All' || c.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen space-y-8">
      {/* Header Controls */}
      <div className="sticky top-14 bg-void/95 backdrop-blur z-30 py-6 border-b border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <h1 className="font-display text-4xl font-black uppercase tracking-tighter text-white mb-2">
                 Archive
              </h1>
              <p className="font-mono text-xs text-concrete uppercase tracking-widest">
                 Sector 01 // Records Found: {filtered.length.toString().padStart(2, '0')}
              </p>
           </div>
           
           <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Brutalist Search Input */}
              <div className="relative group w-full md:w-64">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-concrete group-focus-within:text-white" size={16} />
                 <input 
                    type="text" 
                    placeholder="QUERY DATABASE..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-2 pl-6 text-sm font-mono uppercase text-white focus:border-white outline-none placeholder-white/20"
                 />
              </div>
           </div>
        </div>
        
        {/* Role Filters - Tabs */}
        <div className="flex flex-wrap gap-4 mt-8">
           <FilterButton label="ALL RECORDS" active={filterRole === 'All'} onClick={() => setFilterRole('All')} />
           {Object.values(CharacterRole).map(role => (
              <FilterButton 
                 key={role} 
                 label={role} 
                 active={filterRole === role} 
                 onClick={() => setFilterRole(role)} 
              />
           ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 pb-20">
        {filtered.map(char => (
          <CharacterCard key={char.id} character={char} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full border border-dashed border-white/20 p-20 flex flex-col items-center justify-center text-concrete">
             <ListFilter size={48} className="mb-4 opacity-50" />
             <p className="font-mono uppercase tracking-widest">No matching entities located.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
   <button 
      onClick={onClick}
      className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] py-1 border-b-2 transition-all ${active ? 'text-white border-white' : 'text-concrete border-transparent hover:text-white hover:border-white/50'}`}
   >
      {label}
   </button>
);

export default CharacterList;