import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Location, WorldviewType } from '../types';
import { Save, ArrowLeft, MapPin, Users, Scroll, Landmark, Activity, Crosshair, Map as MapIcon, Globe, ExternalLink, Loader2, Plus, Minus } from 'lucide-react';

const LocationEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Destructure loading from store
  const { updateLocation, getLocation, deleteLocation, characters, loading } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Location | null>(null);
  const [isAddingResident, setIsAddingResident] = useState(false);

  useEffect(() => {
    // CRITICAL FIX: Do not check for existence until data is fully loaded.
    if (loading) return;

    if (id) {
      const existing = getLocation(id);
      if (existing) {
        setFormData(existing);
      } else {
        // Only redirect if we are sure it doesn't exist (loading is false)
        console.warn(`Location ${id} not found, redirecting...`);
        navigate('/');
      }
    }
  }, [id, getLocation, navigate, loading]);

  // Loading State UI
  if (loading || !formData) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-void text-concrete">
            <Loader2 className="animate-spin mb-4" size={32} />
            <span className="font-mono text-xs uppercase tracking-widest">Retrieving Geospatial Data...</span>
        </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => prev ? ({ ...prev, imageUrl: reader.result as string }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const addResident = (charId: string) => {
      setFormData(prev => {
          if (!prev) return null;
          const residents = prev.residents || [];
          if (!residents.includes(charId)) {
              return { ...prev, residents: [...residents, charId] };
          }
          return prev;
      });
      setIsAddingResident(false);
  };

  const removeResident = (charId: string) => {
      setFormData(prev => {
          if (!prev) return null;
          return { ...prev, residents: (prev.residents || []).filter(r => r !== charId) };
      });
  };

  const handleSubmit = () => {
    if (formData && id) {
      updateLocation(id, formData);
      navigate('/');
    }
  };

  // Filter available characters for the dropdown
  const availableCharacters = characters.filter(c => !formData.residents?.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between mb-8 border-b border-white/20 pb-6 sticky top-14 bg-void/95 backdrop-blur-sm z-30 pt-6">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-concrete hover:text-white transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-xs uppercase tracking-widest">Back to Index</span>
           </button>
           <div className="h-4 w-px bg-white/20"></div>
           <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
             GEOSPATIAL DATA // {formData.id?.slice(-4)}
          </h1>
        </div>
        
        <div className="flex gap-4">
            <button 
                type="button" 
                onClick={() => {
                    if(window.confirm('Delete Sector Data?')) {
                        deleteLocation(formData.id);
                        navigate('/');
                    }
                }} 
                className="px-6 py-2 border border-red-900 text-red-700 hover:bg-red-900 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
            >
                Purge Sector
            </button>
            <button 
              onClick={handleSubmit}
              className="px-8 py-2 bg-white text-black hover:bg-concrete hover:text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-white"
            >
              <Save size={14} /> Commit Changes
            </button>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in duration-500">
        
        {/* SECTION 1: IDENTITY & HEADER */}
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Globe size={14} className="text-concrete" />
                <select 
                    name="worldview"
                    value={formData.worldview}
                    onChange={handleChange}
                    className="bg-transparent text-[10px] font-mono uppercase tracking-[0.2em] text-concrete border-none outline-none hover:text-white cursor-pointer"
                >
                     {Object.values(WorldviewType).map(v => (
                      <option key={v} value={v} className="bg-black">{v}</option>
                  ))}
                </select>
            </div>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="SECTOR NAME"
              className="w-full bg-transparent border-b border-white/20 py-4 text-5xl md:text-7xl font-display font-black uppercase text-white placeholder-white/10 focus:border-white outline-none transition-colors"
            />
        </div>

        {/* SECTION 2: VISUALS (Panorama + Mini-map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[400px]">
            {/* Main Panorama */}
            <div 
                className="lg:col-span-8 h-64 lg:h-full border border-white/20 relative group overflow-hidden cursor-pointer bg-surface"
                onClick={() => fileInputRef.current?.click()}
            >
                {formData.imageUrl ? (
                    <img 
                        src={formData.imageUrl} 
                        alt="Sector Panorama" 
                        className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <span className="font-mono text-xs uppercase tracking-widest text-concrete">No Visual Data</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 border border-white/30 text-[10px] font-mono text-white uppercase tracking-widest">
                    Primary Visual Feed
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Tactical Mini-Map / Data Block */}
            <div className="lg:col-span-4 h-full flex flex-col gap-4">
                {/* Mini Map Placeholder */}
                <div className="flex-1 border border-white/20 bg-void p-1 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[size:20px_20px] bg-grid-pattern opacity-30"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                         <Crosshair className="text-white/20 group-hover:text-white/80 group-hover:rotate-90 transition-all duration-500" size={64} strokeWidth={1} />
                     </div>
                     <div className="absolute top-2 left-2 text-[9px] font-mono text-concrete">TACTICAL VIEW</div>
                     {/* Random geometric decorations */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-white/30 rounded-full"></div>
                </div>

                {/* Quick Stats */}
                <div className="h-1/3 border border-white/20 bg-surface p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-concrete mb-1">
                            <Users size={12} />
                            <span className="text-[9px] font-mono uppercase tracking-widest">Population Est.</span>
                        </div>
                        <input 
                            type="text"
                            name="population"
                            value={formData.population}
                            onChange={handleChange}
                            className="w-full bg-transparent text-xl font-display uppercase text-white outline-none border-b border-white/10 focus:border-white"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-concrete mb-1">
                            <MapPin size={12} />
                            <span className="text-[9px] font-mono uppercase tracking-widest">Coordinates</span>
                        </div>
                        <input 
                            type="text"
                            name="coordinates"
                            value={formData.coordinates}
                            onChange={handleChange}
                            className="w-full bg-transparent text-xl font-display uppercase text-white outline-none border-b border-white/10 focus:border-white"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 3: DEEP LORE (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/10">
            <div className="space-y-8">
                <div className="group">
                    <div className="flex items-center gap-2 text-white mb-4 border-b border-white/20 pb-2">
                        <Scroll size={16} />
                        <h3 className="font-display text-lg font-bold uppercase tracking-wide">Historical Archive</h3>
                    </div>
                    <textarea 
                        name="history"
                        value={formData.history}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-surface border border-white/20 p-4 text-sm font-mono text-concrete focus:text-white focus:border-white outline-none transition-colors"
                        placeholder="> Accessing historical records..."
                    />
                </div>

                <div className="group">
                    <div className="flex items-center gap-2 text-white mb-4 border-b border-white/20 pb-2">
                        <Landmark size={16} />
                        <h3 className="font-display text-lg font-bold uppercase tracking-wide">Cultural Analysis</h3>
                    </div>
                    <textarea 
                        name="culture"
                        value={formData.culture}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-surface border border-white/20 p-4 text-sm font-mono text-concrete focus:text-white focus:border-white outline-none transition-colors"
                        placeholder="> Analyzing social structures..."
                    />
                </div>
            </div>

            <div className="space-y-8">
                 <div className="group">
                    <div className="flex items-center gap-2 text-white mb-4 border-b border-white/20 pb-2">
                        <MapIcon size={16} />
                        <h3 className="font-display text-lg font-bold uppercase tracking-wide">General Description & Notes</h3>
                    </div>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={16}
                        className="w-full bg-surface border border-white/20 p-4 text-sm font-mono text-concrete focus:text-white focus:border-white outline-none transition-colors"
                        placeholder="> System notes..."
                    />
                </div>
                
                <div className="border border-dashed border-white/20 p-4 flex items-center justify-between text-concrete hover:text-white hover:border-white cursor-pointer transition-colors">
                    <span className="font-mono text-xs uppercase tracking-widest">Classification Type</span>
                    <input 
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="bg-transparent text-right font-display font-bold uppercase outline-none"
                    />
                </div>
            </div>
        </div>

        {/* SECTION 4: OCCUPANCY HEATMAP */}
        <div className="pt-12 mt-4 border-t border-white/20">
             <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2 text-white">
                     <Activity size={16} />
                     <h3 className="font-display text-xl font-bold uppercase">Occupancy Matrix</h3>
                 </div>
                 <span className="text-[10px] font-mono text-concrete border border-white/20 px-2 py-1">ENTITY TRACKING</span>
             </div>

             <div className="bg-black border border-white/10 p-6">
                 {/* List of Residents */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                     {formData.residents?.map(charId => {
                         const char = characters.find(c => c.id === charId);
                         if (!char) return null;
                         
                         return (
                             <div 
                                key={char.id} 
                                className="flex items-center justify-between p-2 border border-white/20 bg-white/5 transition-all duration-300 group hover:border-white"
                             >
                                 <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 border border-white/20 overflow-hidden relative shrink-0">
                                        <img src={char.imageUrl} className="w-full h-full object-cover grayscale" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-mono uppercase text-white truncate">{char.name}</div>
                                        <div className="text-[9px] font-mono uppercase mt-1 text-green-500">● DETECTED</div>
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-1 border-l border-white/10 pl-2 ml-2">
                                     <button 
                                        onClick={() => navigate(`/character/${char.id}`)}
                                        className="p-1.5 text-concrete hover:text-white"
                                        title="View Entity"
                                     >
                                         <ExternalLink size={12} />
                                     </button>
                                     <button 
                                        onClick={() => removeResident(char.id)}
                                        className="p-1.5 text-concrete hover:text-red-500"
                                        title="Remove from Sector"
                                     >
                                         <Minus size={12} />
                                     </button>
                                 </div>
                             </div>
                         )
                     })}
                     
                     {/* Add Button Slot */}
                     {isAddingResident ? (
                        <div className="p-4 border border-dashed border-white/40 bg-white/5 flex items-center justify-center animate-in fade-in">
                           <select 
                              autoFocus
                              className="w-full bg-black text-white font-mono text-xs uppercase p-2 border border-white/20 outline-none"
                              onChange={(e) => addResident(e.target.value)}
                              onBlur={() => setIsAddingResident(false)}
                              defaultValue=""
                           >
                               <option value="" disabled>-- SELECT ENTITY --</option>
                               {availableCharacters.map(c => (
                                   <option key={c.id} value={c.id}>{c.name}</option>
                               ))}
                           </select>
                        </div>
                     ) : (
                         <button 
                            onClick={() => setIsAddingResident(true)}
                            disabled={availableCharacters.length === 0}
                            className="h-full min-h-[60px] border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-concrete hover:text-white hover:border-white hover:bg-white/5 transition-all text-[10px] font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                         >
                            <Plus size={16} />
                            <span>Log New Entity</span>
                         </button>
                     )}
                 </div>
                 
                 {(formData.residents?.length === 0 && !isAddingResident) && (
                     <div className="text-center py-4 text-concrete text-xs font-mono uppercase">Sector Empty. No Signals Detected.</div>
                 )}
             </div>
        </div>

      </div>
    </div>
  );
};

export default LocationEditor;