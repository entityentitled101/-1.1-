import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Character, CharacterRole, WorldviewType, SAMPLE_TAGS } from '../types';
import { Save, X, ArrowLeft, Terminal, Activity, Layers, Lock, Cpu, Scroll, Plus, Minus, MapPin, ExternalLink } from 'lucide-react';

// Preset options for Logic
const MODERN_CLASSES = ["New Media Artist", "Programmer", "Cyber-Police Tech", "Influencer", "Corporate Fixer"];
const FANTASY_CLASSES = ["Ranger", "Rogue", "Paladin", "Bard", "Necromancer"];

const CharacterEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // We need locations and updateLocation to handle the Location Matrix
  const { addCharacter, updateCharacter, getCharacter, deleteCharacter, characters, locations, updateLocation } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Character>>({
    name: '',
    role: CharacterRole.SUPPORTING,
    worldview: WorldviewType.MODERN_CYBER,
    race: 'Human',
    characterClass: '',
    faction: '',
    description: '',
    appearance: '',
    tags: [],
    imageUrl: '',
    relationships: []
  });

  const [customClass, setCustomClass] = useState('');
  const [newTag, setNewTag] = useState('');
  
  // States for "Add" UI
  const [isAddingRel, setIsAddingRel] = useState(false);
  const [isAddingLoc, setIsAddingLoc] = useState(false);

  // Initial Load
  useEffect(() => {
    if (id) {
      const existing = getCharacter(id);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, getCharacter]);

  // Logic: Worldview Changes
  useEffect(() => {
    if (formData.worldview === WorldviewType.MODERN_CYBER) {
       setFormData(prev => ({ ...prev, race: 'Human' })); // Lock to Human
    }
  }, [formData.worldview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }));
  };

  /* --- Relationship Logic --- */
  const handleAddRelationship = (targetId: string) => {
      if (!targetId) return;
      const newRel = { targetId, type: 'Linked', intensity: 50 };
      setFormData(prev => ({
          ...prev,
          relationships: [...(prev.relationships || []), newRel]
      }));
      setIsAddingRel(false);
  };

  const handleRemoveRelationship = (targetId: string) => {
      setFormData(prev => ({
          ...prev,
          relationships: prev.relationships?.filter(r => r.targetId !== targetId)
      }));
  };

  /* --- Location Logic (Cross-Linking) --- */
  // Only available if we are editing an existing character (have an ID)
  const handleAddToLocation = (locId: string) => {
      if (!id || !locId) return;
      const location = locations.find(l => l.id === locId);
      if (location && !location.residents.includes(id)) {
          updateLocation(locId, { residents: [...location.residents, id] });
      }
      setIsAddingLoc(false);
  };

  const handleRemoveFromLocation = (locId: string) => {
      if (!id || !locId) return;
      const location = locations.find(l => l.id === locId);
      if (location) {
          updateLocation(locId, { residents: location.residents.filter(r => r !== id) });
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    // Use custom class if selected/typed
    const finalClass = customClass || formData.characterClass;
    const finalData = { ...formData, characterClass: finalClass };

    if (id) {
      updateCharacter(id, finalData);
    } else {
      addCharacter(finalData as Character);
    }
    navigate('/characters');
  };

  // Logic Helpers
  const isModern = formData.worldview === WorldviewType.MODERN_CYBER;
  const isFantasy = formData.worldview === WorldviewType.HIGH_FANTASY;
  const classOptions = isModern ? MODERN_CLASSES : (isFantasy ? FANTASY_CLASSES : []);

  // Filter lists for Dropdowns
  const availableRelations = characters.filter(c => c.id !== id && !formData.relationships?.some(r => r.targetId === c.id));
  
  // Find locations where this character is a resident
  const currentLocations = locations.filter(l => l.residents?.includes(id || ''));
  const availableLocations = locations.filter(l => !l.residents?.includes(id || ''));

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between mb-8 border-b border-white/20 pb-6 sticky top-14 bg-void/95 backdrop-blur-sm z-30 pt-6">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-concrete hover:text-white transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-xs uppercase tracking-widest">Back</span>
           </button>
           <div className="h-4 w-px bg-white/20"></div>
           <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
            {id ? `DATABASE // ${formData.name?.toUpperCase()}` : 'NEW ENTRY // INITIALIZE'}
          </h1>
        </div>
        
        <div className="flex gap-4">
            {id && (
               <button 
                  type="button" 
                  onClick={() => {
                     if(window.confirm('Delete Entity?')) {
                        deleteCharacter(id);
                        navigate('/characters');
                     }
                  }} 
                  className="px-6 py-2 border border-red-900 text-red-700 hover:bg-red-900 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
               >
                  Purge Data
               </button>
            )}
            <button 
              onClick={handleSubmit}
              className="px-8 py-2 bg-white text-black hover:bg-concrete hover:text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-white"
            >
              <Save size={14} /> Commit Changes
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Avatar & World Settings */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Avatar Area */}
          <div 
            className="aspect-[3/4] bg-surface border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white transition-colors group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {formData.imageUrl ? (
              <>
                 <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover filter grayscale contrast-125" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <span className="font-mono text-xs uppercase tracking-widest text-white border border-white px-2 py-1">Upload New Source</span>
                 </div>
              </>
            ) : (
              <div className="text-center space-y-2">
                <Activity className="mx-auto text-concrete opacity-50" />
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-concrete">No Visual Data</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Worldview Selector */}
          <div className="border border-white/20 p-4 bg-surface">
              <div className="flex items-center gap-2 mb-4 text-concrete">
                  <Layers size={14} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Reality Framework</span>
              </div>
              <select 
                  name="worldview"
                  value={formData.worldview}
                  onChange={handleChange}
                  className="w-full bg-void border-b border-white/20 text-white font-mono text-xs uppercase p-2 outline-none focus:border-white transition-colors"
              >
                  {Object.values(WorldviewType).map(v => (
                      <option key={v} value={v}>{v}</option>
                  ))}
              </select>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
             <label className="block font-mono text-[10px] uppercase tracking-widest text-concrete">Narrative Role</label>
             <div className="grid grid-cols-2 gap-2">
                 {Object.values(CharacterRole).map(role => (
                    <button
                       key={role}
                       type="button"
                       onClick={() => handleChange({ target: { name: 'role', value: role } } as any)}
                       className={`py-2 text-[9px] uppercase tracking-wider font-mono border ${formData.role === role ? 'bg-white text-black border-white' : 'border-white/20 text-concrete hover:border-white/50'}`}
                    >
                       {role}
                    </button>
                 ))}
             </div>
          </div>
        </div>

        {/* Right Column: Detailed Specs */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Name Field */}
          <div className="relative group">
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ENTER DESIGNATION"
              className="w-full bg-transparent border-b border-white/20 py-4 text-5xl md:text-6xl font-display font-black uppercase text-white placeholder-white/10 focus:border-white outline-none transition-colors"
            />
            <span className="absolute -top-4 left-0 text-[10px] font-mono text-concrete opacity-0 group-hover:opacity-100 transition-opacity">SUBJECT NAME</span>
          </div>

          {/* Dynamic Logic: Race & Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border border-white/10 bg-white/5 relative">
            <div className="absolute top-0 left-0 bg-white text-black text-[9px] font-mono px-2 py-0.5 uppercase">
                {isModern ? "Logic Protocol: Cyber_Realism" : "Logic Protocol: Standard/Fantasy"}
            </div>

            {/* Race Field */}
            <div className="group mt-4 md:mt-0">
               <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-concrete mb-2">
                   {isModern && <Lock size={10} />}
                   Biological Classification (Race)
               </label>
               {isModern ? (
                   <div className="w-full border-b border-white/20 py-2 text-xl font-display uppercase text-white/50 cursor-not-allowed">
                       HUMAN (LOCKED)
                   </div>
               ) : (
                   <input 
                       type="text"
                       name="race"
                       value={formData.race}
                       onChange={handleChange}
                       placeholder="E.g. ELF, ORC"
                       className="w-full bg-transparent border-b border-white/20 py-2 text-xl font-display uppercase text-white focus:border-white outline-none"
                   />
               )}
            </div>

            {/* Class Field */}
            <div className="group mt-4 md:mt-0">
               <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-concrete mb-2">
                   Occupational Class
               </label>
               <div className="relative">
                   <select 
                       name="characterClass"
                       value={formData.characterClass}
                       onChange={(e) => {
                           if(e.target.value === 'custom') {
                               setCustomClass('');
                               handleChange(e);
                           } else {
                               handleChange(e);
                               setCustomClass('');
                           }
                       }}
                       className="w-full bg-transparent border-b border-white/20 py-2 text-xl font-display uppercase text-white appearance-none focus:border-white outline-none cursor-pointer"
                   >
                       <option value="" className="bg-black text-concrete">-- SELECT CLASS --</option>
                       {classOptions.map(opt => (
                           <option key={opt} value={opt} className="bg-black">{opt}</option>
                       ))}
                       <option value="custom" className="bg-black text-white">>> CUSTOM INPUT</option>
                   </select>
                   {(formData.characterClass === 'custom' || (!classOptions.includes(formData.characterClass || '') && formData.characterClass)) && (
                       <input 
                           type="text"
                           value={customClass || formData.characterClass}
                           onChange={(e) => { setCustomClass(e.target.value); handleChange({ target: { name: 'characterClass', value: e.target.value } } as any); }}
                           placeholder="ENTER CUSTOM CLASS"
                           className="mt-2 w-full bg-void border border-white/20 p-2 text-sm font-mono text-white focus:border-white outline-none"
                           autoFocus
                       />
                   )}
               </div>
            </div>
            
            <InputGroup label="Allegiance / Faction" name="faction" value={formData.faction} onChange={handleChange} />
          </div>

          <div className="space-y-8">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-concrete mb-2">
                    <Terminal size={14} />
                    <label className="font-mono text-[10px] uppercase tracking-widest">Detailed Biography</label>
                 </div>
                 <textarea 
                   name="description"
                   value={formData.description}
                   onChange={handleChange}
                   rows={6}
                   className="w-full bg-surface border border-white/20 p-4 text-sm font-mono text-white focus:border-white outline-none"
                   placeholder="> Input narrative context..."
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-concrete mb-2">
                    <Terminal size={14} />
                    <label className="font-mono text-[10px] uppercase tracking-widest">Physical Parameters</label>
                 </div>
                 <textarea 
                   name="appearance"
                   value={formData.appearance}
                   onChange={handleChange}
                   rows={3}
                   className="w-full bg-surface border border-white/20 p-4 text-sm font-mono text-white focus:border-white outline-none resize-none"
                   placeholder="> Describe visual attributes..."
                 />
              </div>
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-white/10">
             <label className="block font-mono text-[10px] uppercase tracking-widest text-concrete mb-4">Identity Tags</label>
             <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags?.map(tag => (
                   <span key={tag} className="bg-white text-black px-3 py-1 text-xs font-mono font-bold uppercase flex items-center gap-2">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                   </span>
                ))}
                <input 
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="+ TAG"
                  className="bg-transparent border border-white/20 px-3 py-1 text-xs font-mono text-white focus:border-white outline-none uppercase w-24 placeholder-white/30"
                />
             </div>
             <div className="flex flex-wrap gap-2 opacity-50">
               {SAMPLE_TAGS.map(tag => (
                  <button 
                     key={tag}
                     type="button"
                     onClick={() => !formData.tags?.includes(tag) && setNewTag(tag)}
                     className="text-[10px] text-concrete hover:text-white uppercase font-mono tracking-wider border-b border-transparent hover:border-white"
                  >
                     {tag}
                  </button>
               ))}
             </div>
          </div>

          {/* MATRIX CONTAINER */}
          <div className="pt-12 mt-12 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-12">
            
             {/* 1. RELATIONSHIP HEATMAP */}
             <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-white">
                        <Activity size={16} />
                        <h3 className="font-display text-lg font-bold uppercase">Relationship Heatmap</h3>
                    </div>
                </div>
                
                <div className="bg-black border border-white/10 p-4 space-y-4">
                    {/* List Existing Relations */}
                    {formData.relationships?.map((rel) => {
                        const target = characters.find(c => c.id === rel.targetId);
                        if (!target) return null;
                        return (
                            <div key={rel.targetId} className="flex items-center gap-3 group relative border border-white/10 p-2 hover:border-white/30 transition-colors">
                                <div className="w-10 h-10 bg-white/10 overflow-hidden shrink-0">
                                    <img src={target.imageUrl} className="w-full h-full object-cover grayscale" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="text-[10px] font-mono uppercase text-white truncate">{target.name}</span>
                                       <Link to={`/character/${target.id}`} title="Jump to Entity" className="text-concrete hover:text-white"><ExternalLink size={10} /></Link>
                                    </div>
                                    <div className="h-1 bg-white/10 w-full relative">
                                        <div className="absolute top-0 left-0 h-full bg-white" style={{ width: `${rel.intensity}%` }}></div>
                                    </div>
                                </div>
                                <button 
                                   onClick={() => handleRemoveRelationship(rel.targetId)}
                                   className="absolute -top-2 -right-2 bg-black border border-white/20 text-concrete hover:text-red-500 hover:border-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                   <Minus size={10} />
                                </button>
                            </div>
                        )
                    })}
                    
                    {/* Add Relation Slot */}
                    {isAddingRel ? (
                        <div className="p-2 border border-dashed border-white/40 bg-white/5 animate-in fade-in">
                           <select 
                              autoFocus
                              className="w-full bg-black text-white font-mono text-xs uppercase p-2 border border-white/20 outline-none"
                              onChange={(e) => handleAddRelationship(e.target.value)}
                              onBlur={() => setIsAddingRel(false)}
                              defaultValue=""
                           >
                               <option value="" disabled>-- SELECT ENTITY --</option>
                               {availableRelations.map(c => (
                                   <option key={c.id} value={c.id}>{c.name}</option>
                               ))}
                           </select>
                        </div>
                    ) : (
                        <button 
                           onClick={() => setIsAddingRel(true)}
                           disabled={availableRelations.length === 0}
                           className="w-full py-3 border border-dashed border-white/20 flex items-center justify-center gap-2 text-concrete hover:text-white hover:border-white hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                           <Plus size={12} /> Add Connection
                        </button>
                    )}
                </div>
             </div>

             {/* 2. GEOSPATIAL MATRIX (LOCATIONS) */}
             <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-white">
                        <MapPin size={16} />
                        <h3 className="font-display text-lg font-bold uppercase">Geospatial Footprint</h3>
                    </div>
                </div>

                <div className="bg-black border border-white/10 p-4 space-y-4">
                    {/* List Linked Locations */}
                    {currentLocations.map(loc => (
                         <div key={loc.id} className="flex items-center gap-3 group relative border border-white/10 p-2 hover:border-white/30 transition-colors">
                            <div className="w-10 h-10 bg-white/10 overflow-hidden shrink-0">
                                <img src={loc.imageUrl} className="w-full h-full object-cover grayscale" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-[10px] font-mono uppercase text-white truncate">{loc.name}</span>
                                   <Link to={`/location/${loc.id}`} title="Jump to Sector" className="text-concrete hover:text-white"><ExternalLink size={10} /></Link>
                                </div>
                                <div className="text-[9px] font-mono text-concrete uppercase truncate">{loc.coordinates}</div>
                            </div>
                            <button 
                                onClick={() => handleRemoveFromLocation(loc.id)}
                                className="absolute -top-2 -right-2 bg-black border border-white/20 text-concrete hover:text-red-500 hover:border-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Minus size={10} />
                            </button>
                        </div>
                    ))}

                    {/* Add Location Slot */}
                    {!id ? (
                        <div className="text-center py-4 text-concrete text-[10px] font-mono border border-dashed border-white/10">
                           SAVE ENTITY TO ENABLE GEOSPATIAL LINKING
                        </div>
                    ) : isAddingLoc ? (
                        <div className="p-2 border border-dashed border-white/40 bg-white/5 animate-in fade-in">
                           <select 
                              autoFocus
                              className="w-full bg-black text-white font-mono text-xs uppercase p-2 border border-white/20 outline-none"
                              onChange={(e) => handleAddToLocation(e.target.value)}
                              onBlur={() => setIsAddingLoc(false)}
                              defaultValue=""
                           >
                               <option value="" disabled>-- SELECT SECTOR --</option>
                               {availableLocations.map(l => (
                                   <option key={l.id} value={l.id}>{l.name}</option>
                               ))}
                           </select>
                        </div>
                    ) : (
                        <button 
                           onClick={() => setIsAddingLoc(true)}
                           disabled={availableLocations.length === 0}
                           className="w-full py-3 border border-dashed border-white/20 flex items-center justify-center gap-2 text-concrete hover:text-white hover:border-white hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                           <Plus size={12} /> Log New Sector
                        </button>
                    )}
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange }: any) => (
   <div className="group mt-4 md:mt-0">
      <label className="block font-mono text-[10px] uppercase tracking-widest text-concrete mb-2 group-focus-within:text-white">{label}</label>
      <input 
         type="text"
         name={name}
         value={value}
         onChange={onChange}
         className="w-full bg-transparent border-b border-white/20 py-2 text-xl font-display uppercase text-white focus:border-white outline-none transition-colors"
      />
   </div>
);

export default CharacterEditor;