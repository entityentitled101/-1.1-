import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, GitCommit, Link as IconLink, Hash, Plus, MapPin, LocateFixed, Fingerprint, Upload } from 'lucide-react';
import { Location } from '../types';
import AIProcessingModal from '../components/AIProcessingModal';

const Dashboard: React.FC = () => {
  const { characters, locations, addLocation } = useStore();
  const navigate = useNavigate();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Core Node Mock Data - In a real app, this would query the specific protagonist
  const coreChar = characters.find(c => c.id === 'char_001');
  const coreName = coreChar ? coreChar.name : "ELARA VANCE";
  const coreDesc = coreChar ? coreChar.description : "The Anchor Point.";

  // Dynamic Instances for Dashboard
  // In a real app, this would filter characters where role != Protagonist
  const instances = characters.filter(c => c.id !== 'char_001').slice(0, 5).map((char, index) => ({
      id: char.id,
      world: char.worldview.split('/')[0].toUpperCase(),
      name: char.name,
      relation: char.role,
      tags: char.tags,
      align: index % 2 === 0 ? 'left' : 'right'
  }));

  const handleNavigateToChar = (charId: string) => {
      navigate(`/character/${charId}`);
  };

  const handleNavigateToLocation = (locId: string) => {
      navigate(`/location/${locId}`);
  };

  return (
    <div className="space-y-24">
      {/* AI Processing Modal */}
      <AIProcessingModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Avant-Garde Hero: Massive Typography */}
      <section className="relative pt-12 border-b border-white/20 pb-12">
        <div className="absolute top-0 right-0 text-xs font-mono text-concrete border border-white/20 px-2 py-1 mt-4">
           VOL. 0.3.7 // OMNI_VIEW
        </div>
        
        <h1 className="font-display text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-white mix-blend-exclusion select-none">
          Lore<br/>Forge
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
           <div className="md:col-span-4 border-t border-white/50 pt-4">
              <p className="font-mono text-xs md:text-sm text-concrete leading-relaxed uppercase tracking-wide">
                 Constructing the narrative weave. 
                 One Soul. Infinite Iterations.
              </p>
           </div>
           <div className="md:col-span-8 flex flex-col items-start md:items-end justify-between gap-6">
              
              {/* PRIMARY ACTION */}
              <Link to="/create" className="group flex items-center gap-4 text-xl font-bold font-display uppercase tracking-widest hover:text-concrete transition-colors">
                 <span>Initiate New Protocol</span>
                 <span className="bg-white text-black p-1 group-hover:rotate-45 transition-transform duration-300"><ArrowRight size={20} /></span>
              </Link>
              
              {/* NEW UPLOAD BUTTON - MATCHING STYLE */}
              <button 
                 onClick={() => setIsAIModalOpen(true)}
                 className="group flex items-center gap-4 text-xl font-bold font-display uppercase tracking-widest hover:text-concrete transition-colors"
              >
                 <span>Upload / Ingest Source</span>
                 <span className="bg-white text-black p-1 group-hover:-translate-y-1 transition-transform duration-300"><Upload size={20} /></span>
              </button>

           </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-y border-white/20">
         <StatBlock label="ENTITIES" value={characters.length.toString().padStart(2, '0')} />
         <StatBlock label="TIMELINES" value={instances.length.toString().padStart(2, '0')} />
         <StatBlock label="LOCATIONS" value={locations.length.toString().padStart(2, '0')} />
         <StatBlock label="MEMORY" value="64KB" />
      </section>

      {/* Narrative Topology / Worldview Architecture */}
      <section className="relative pb-10">
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-2">
              <GitCommit size={16} className="text-white" />
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white">Narrative Topology</h2>
           </div>
           <div className="h-px bg-white/20 flex-1 mx-4"></div>
           <div className="font-mono text-[10px] text-concrete">INTERACTIVE_MODE // ENABLED</div>
        </div>
        
        {/* THE TOPOLOGY CONTAINER */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* SVG CONNECTION LAYER (Background) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <svg width="100%" height="100%" className="overflow-visible">
               <line x1="50%" y1="280" x2="50%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* 1. CORE FL CARD (The Anchor) */}
          <div 
            onClick={() => handleNavigateToChar('char_001')}
            className="relative z-10 bg-black border border-white/20 p-1 lg:p-2 mb-24 cursor-pointer group transition-all duration-300 hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
             {/* Tech Deco */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-[10px] font-mono border border-white/20 text-white uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors">
                CORE_ENTITY // ID: A-001
             </div>

             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 border border-white/10 bg-void">
                {/* Portrait */}
                <div className="md:col-span-4 relative aspect-[4/5] border-r border-white/10 overflow-hidden">
                   <img 
                      src={coreChar?.imageUrl || "https://picsum.photos/seed/elara/500/600"} 
                      alt="Core Protagonist" 
                      className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700" 
                   />
                   <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 backdrop-blur-sm border-t border-white/20">
                      <div className="flex justify-between text-[9px] font-mono text-concrete uppercase">
                         <span>STATUS: IMMUTABLE</span>
                         <span className="flex items-center gap-1 group-hover:text-white"><Fingerprint size={10} /> ACCESS</span>
                      </div>
                   </div>
                </div>

                {/* Data Fields */}
                <div className="md:col-span-8 p-6 flex flex-col justify-between">
                   <div>
                      <div className="flex items-baseline gap-4 mb-2">
                         <span className="text-xs font-mono text-concrete bg-white/10 px-1">CLASS: PROTAGONIST</span>
                         <span className="text-xs font-mono text-concrete">ORIGIN: PRIME</span>
                      </div>
                      <div className="w-full bg-transparent text-4xl md:text-5xl font-display font-black uppercase text-white mb-4 border-b border-transparent group-hover:border-white/20 transition-colors">
                        {coreName}
                      </div>
                      <p className="w-full bg-transparent text-sm font-mono text-concrete border-l-2 border-white/10 pl-4 group-hover:text-white transition-colors">
                        {coreDesc}
                      </p>
                   </div>

                   {/* Global Tags System */}
                   <div className="mt-8">
                      <div className="flex items-center gap-2 mb-3">
                         <Hash size={12} className="text-white" />
                         <span className="text-[10px] font-mono uppercase tracking-widest text-white">Global Attributes</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {coreChar?.tags?.map(t => <GlobalTag key={t} label={t} />)}
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Connection Node (Bottom) */}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-black border border-white rotate-45 flex items-center justify-center z-20 group-hover:bg-white group-hover:scale-125 transition-all">
                <div className="w-2 h-2 bg-white rounded-none group-hover:bg-black"></div>
             </div>
          </div>

          {/* 2. INSTANCE BARS (Dynamic List) */}
          <div className="space-y-12 pl-4 md:pl-0">
             {instances.map((instance) => (
                 <InstanceBar 
                    key={instance.id}
                    world={instance.world} 
                    name={instance.name} 
                    relation={instance.relation} 
                    tags={instance.tags}
                    alignment={instance.align as 'left' | 'right'}
                    onClick={() => handleNavigateToChar(instance.id)}
                 />
             ))}
          </div>

          {/* 3. ADD INSTANCE BUTTON */}
          <div className="flex flex-col items-center mt-12 relative z-10">
              <div className="h-12 border-l border-dashed border-white/50 mb-4"></div>
              <button 
                onClick={() => navigate('/create')}
                className="w-12 h-12 flex items-center justify-center border border-white/20 bg-black hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 rounded-none group cursor-pointer"
              >
                  <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <span className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-concrete">Create New Divergence</span>
          </div>

        </div>
      </section>

      {/* GEOSPATIAL INDEX (MAP SECTOR) */}
      <section className="relative pb-20 pt-20 border-t border-dashed border-white/10">
         <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-2">
              <MapPin size={16} className="text-white" />
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white">Geospatial Index</h2>
           </div>
           <div className="h-px bg-white/20 flex-1 mx-4"></div>
           <button onClick={addLocation} className="border border-white/20 hover:bg-white hover:text-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
              <Plus size={10} /> New Sector
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {locations.map(loc => (
               <LocationCard key={loc.id} location={loc} onClick={() => handleNavigateToLocation(loc.id)} />
           ))}
        </div>
      </section>
      
      {/* Decorative Footer Area */}
      <section className="py-20 flex flex-col items-center justify-center opacity-30 pointer-events-none select-none">
         <h3 className="text-[15vw] leading-none font-display font-black text-transparent text-outline">
            SYSTEM
         </h3>
      </section>
    </div>
  );
};

/* --- Sub Components --- */

const LocationCard: React.FC<{ location: Location, onClick: () => void }> = ({ location, onClick }) => (
    <div 
        onClick={onClick}
        className="border border-white/20 bg-black group hover:border-white transition-colors cursor-pointer"
    >
        <div className="aspect-video w-full overflow-hidden relative border-b border-white/20">
             <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-500" />
             <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 border border-white/20 text-[9px] font-mono text-white flex items-center gap-1">
                 <LocateFixed size={10} /> {location.coordinates}
             </div>
             <div className="absolute bottom-0 left-0 bg-white text-black text-[9px] font-mono uppercase px-3 py-1 font-bold">
                 {location.type}
             </div>
        </div>
        <div className="p-6">
            <h4 className="font-display text-xl font-bold uppercase text-white mb-2">{location.name}</h4>
            <p className="font-mono text-xs text-concrete line-clamp-2 uppercase leading-relaxed">{location.description}</p>
            <div className="mt-4 flex gap-2">
                <span className="text-[9px] border border-white/20 px-2 py-0.5 text-concrete uppercase">{location.worldview.split('/')[0]}</span>
            </div>
        </div>
    </div>
);

const StatBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="border-r border-white/20 last:border-r-0 p-6 flex flex-col justify-between h-32 hover:bg-white hover:text-black transition-colors duration-300 group cursor-default">
     <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100">{label}</span>
     <span className="text-5xl font-display font-bold">{value}</span>
  </div>
);

const GlobalTag: React.FC<{ label: string }> = ({ label }) => (
   <span className="bg-white text-black px-3 py-1 text-xs font-mono font-bold uppercase tracking-wide cursor-default select-none border border-white">
      {label}
   </span>
);

const WorldTag: React.FC<{ label: string }> = ({ label }) => (
   <span className="bg-transparent text-concrete border border-white/30 px-3 py-1 text-[10px] font-mono uppercase tracking-wide group-hover:border-white group-hover:text-white transition-colors cursor-default">
      {label}
   </span>
);

const InstanceBar: React.FC<{ 
    world: string; 
    name: string; 
    relation: string; 
    tags: string[]; 
    alignment: 'left' | 'right';
    onClick: () => void;
}> = ({ world, name, relation, tags, alignment, onClick }) => {
   const isRight = alignment === 'right';
   
   return (
      <div 
        className={`relative flex ${isRight ? 'justify-end' : 'justify-start'}`}
        onClick={onClick}
      >
         
         {/* The Bar Container */}
         <div className={`w-full md:w-[80%] bg-surface border border-white/20 hover:border-white transition-colors group relative p-1 cursor-pointer`}>
            
            {/* Connection Point (Anchor) */}
            <div className={`absolute top-0 ${isRight ? 'right-[10%] -translate-y-1/2' : 'left-[10%] -translate-y-1/2'} w-3 h-3 bg-white z-20 group-hover:scale-125 transition-transform`}></div>

            <div className="bg-void p-4 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
               
               {/* World ID */}
               <div className="md:w-48 shrink-0 border-r border-white/10 pr-4">
                  <div className="flex items-center gap-2 text-concrete mb-1">
                     <Globe size={12} className="group-hover:text-white transition-colors" />
                     <span className="text-[9px] font-mono uppercase tracking-widest group-hover:text-white transition-colors">{world}</span>
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">Divergence: {Math.floor(Math.random() * 90)}%</div>
               </div>

               {/* Male Lead Data */}
               <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                     <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                        {name}
                     </h3>
                     <span className="text-xs font-mono text-white/60 bg-white/10 px-2 py-0.5 uppercase tracking-wide">
                        {relation}
                     </span>
                  </div>
               </div>

               {/* Instance Tags */}
               <div className="flex flex-wrap gap-2 justify-end">
                  {tags.map(t => <WorldTag key={t} label={t} />)}
                  <div className="w-6 h-6 flex items-center justify-center border border-dashed border-white/30 text-concrete group-hover:text-white group-hover:border-white transition-colors">
                     <IconLink size={12} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;