import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterRole, WorldviewType, Location } from '../types';

const STORAGE_KEY = 'lore_forge_db_v1';

const INITIAL_DATA: Character[] = [
  {
    id: 'char_001',
    name: 'ELARA VANCE',
    role: CharacterRole.PROTAGONIST,
    worldview: WorldviewType.HIGH_FANTASY,
    race: 'High Elf',
    characterClass: 'Mage',
    faction: 'Silver Covenant',
    description: 'The Anchor Point. Cannot be erased from history. Retains memories across all timeline resets.',
    appearance: 'Tall, silver hair, glowing green eyes. Wears crimson robes tattered at the edges.',
    tags: ['Core Entity', 'Time Traveler', 'Cursed'],
    relationships: [{ targetId: 'char_002', type: 'Enemy', intensity: 90 }],
    lastUpdated: Date.now(),
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 'char_002',
    name: 'Unit 734',
    role: CharacterRole.ANTAGONIST,
    worldview: WorldviewType.MODERN_CYBER,
    race: 'Android',
    characterClass: 'Cyber-Security Enforcer',
    faction: 'Iron Horde Corp',
    description: 'A brutal enforcement unit who believes algorthmic order is the only virtue.',
    appearance: 'Massive build, chrome plating, exposed wiring on jawline.',
    tags: ['Warrior', 'Leader', 'Synthetic'],
    relationships: [{ targetId: 'char_001', type: 'Target', intensity: 85 }],
    lastUpdated: Date.now(),
    imageUrl: 'https://picsum.photos/400/400?random=2'
  }
];

const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'loc_001',
    name: 'Neo-Kowloon',
    type: 'Megacity',
    worldview: WorldviewType.MODERN_CYBER,
    coordinates: '34.22, 119.01',
    population: '12,000,000',
    description: 'A vertical sprawl of neon and rain. The lower levels haven\'t seen the sun in decades.',
    history: 'Founded after the Great Flood of 2099. Originally a refugee camp, now the trade capital of the East Sector.',
    culture: 'High-tech low-life. Cybernetic augmentation is standard. Triad gangs control the food supply.',
    imageUrl: 'https://picsum.photos/600/400?random=10',
    residents: ['char_002']
  },
  {
    id: 'loc_002',
    name: 'The Whispering Woods',
    type: 'Forbidden Forest',
    worldview: WorldviewType.HIGH_FANTASY,
    coordinates: 'Unknown',
    population: 'Sparse / Unknown',
    description: 'Ancient trees that remember the old gods. Magic runs wild here.',
    history: 'The site of the First War between Elves and Demons. The soil is still stained with mana.',
    culture: 'Druidic circles protect the borders. Trespassers are rarely seen again.',
    imageUrl: 'https://picsum.photos/600/400?random=11',
    residents: ['char_001']
  }
];

export const useStore = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const storedChars = localStorage.getItem(STORAGE_KEY);
    const storedLocs = localStorage.getItem(STORAGE_KEY + '_locs');
    
    if (storedChars) {
      try {
        setCharacters(JSON.parse(storedChars));
      } catch (e) {
        setCharacters(INITIAL_DATA);
      }
    } else {
      setCharacters(INITIAL_DATA);
    }

    if (storedLocs) {
        try {
            setLocations(JSON.parse(storedLocs));
        } catch(e) {
            setLocations(INITIAL_LOCATIONS);
        }
    } else {
        setLocations(INITIAL_LOCATIONS);
    }

    setLoading(false);
  }, []);

  // Persist whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
      localStorage.setItem(STORAGE_KEY + '_locs', JSON.stringify(locations));
    }
  }, [characters, locations, loading]);

  // Character Methods
  const addCharacter = useCallback((char: Omit<Character, 'id' | 'lastUpdated'>) => {
    const newChar: Character = {
      ...char,
      id: `char_${Date.now()}`,
      lastUpdated: Date.now()
    };
    setCharacters(prev => [newChar, ...prev]);
  }, []);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, lastUpdated: Date.now() } : c
    ));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCharacter = useCallback((id: string) => {
    return characters.find(c => c.id === id);
  }, [characters]);

  // Location Methods
  const addLocation = useCallback(() => {
     const newLoc: Location = {
         id: `loc_${Date.now()}`,
         name: 'NEW SECTOR',
         type: 'Undefined',
         worldview: WorldviewType.CUSTOM,
         coordinates: '00.00, 00.00',
         population: '0',
         description: 'Awaiting survey data...',
         history: 'No historical records found.',
         culture: 'No cultural data available.',
         imageUrl: `https://picsum.photos/600/400?random=${Date.now()}`,
         residents: []
     };
     setLocations(prev => [...prev, newLoc]);
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    setLocations(prev => prev.map(l => 
        l.id === id ? { ...l, ...updates } : l
    ));
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  }, []);

  const getLocation = useCallback((id: string) => {
    return locations.find(l => l.id === id);
  }, [locations]);

  // --- DREAMBOAT PROTOCOL: BATCH IMPORT ---
  const importBatchData = useCallback((data: { characters: Partial<Character>[], locations: Partial<Location>[] }) => {
    
    setCharacters(prevChars => {
        let nextChars = [...prevChars];
        const usedIds = new Set<string>();

        // 1. Core Entity Strategy: "阿葡" or "PUU" matches char_001
        // Identity Mapping Strategy: Check for 'puu' or '阿葡' to lock to Core Entity
        const coreData = data.characters.find(c => 
            (c.name && (c.name.includes('阿葡') || c.name.toUpperCase().includes('PUU') || c.name.toUpperCase().includes('AH PU')))
        );

        if (coreData) {
            const coreIndex = nextChars.findIndex(c => c.id === 'char_001');
            if (coreIndex >= 0) {
                // FORCE UPDATE CORE
                nextChars[coreIndex] = { 
                    ...nextChars[coreIndex], 
                    ...coreData, 
                    id: 'char_001', 
                    name: coreData.name || "PUU (Core)", // Ensure name is set
                    role: CharacterRole.PROTAGONIST,
                    lastUpdated: Date.now()
                };
                usedIds.add('char_001');
            }
        }

        // 2. Male/Other Strategy (Overwrite placeholders first)
        const others = data.characters.filter(c => c !== coreData);
        
        others.forEach(charData => {
            // A. Try to match by name first
            let targetIndex = nextChars.findIndex(c => c.name === charData.name);
            
            // B. If no name match, find first available placeholder 
            // (Not Core, Not already touched in this batch)
            if (targetIndex === -1) {
                // Find any non-core character that hasn't been updated yet to overwrite
                // This implements the "Replace existing male characters" rule
                targetIndex = nextChars.findIndex(c => c.id !== 'char_001' && !usedIds.has(c.id));
            }

            if (targetIndex !== -1) {
                // Update existing placeholder
                const existingId = nextChars[targetIndex].id;
                nextChars[targetIndex] = { 
                    ...nextChars[targetIndex], 
                    ...charData, 
                    id: existingId,
                    lastUpdated: Date.now()
                };
                usedIds.add(existingId);
            } else {
                // Create new Instance (Bar)
                const newId = `char_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                nextChars.push({ 
                    ...(charData as Character), 
                    id: newId, 
                    tags: charData.tags || [],
                    relationships: charData.relationships || [],
                    imageUrl: `https://picsum.photos/seed/${charData.name}/400/500`,
                    lastUpdated: Date.now()
                });
            }
        });

        return nextChars;
    });

    setLocations(prevLocs => {
        let nextLocs = [...prevLocs];
        
        data.locations.forEach(locData => {
            // Update existing by Name or Create New
            const existingIndex = nextLocs.findIndex(l => l.name?.toLowerCase() === locData.name?.toLowerCase());
            
            if (existingIndex >= 0) {
                nextLocs[existingIndex] = { 
                    ...nextLocs[existingIndex], 
                    ...locData 
                };
            } else {
                nextLocs.push({ 
                    ...(locData as Location), 
                    id: `loc_${Date.now()}_${Math.floor(Math.random()*1000)}`,
                    residents: locData.residents || [],
                    imageUrl: `https://picsum.photos/seed/${locData.name}/600/400`
                });
            }
        });
        return nextLocs;
    });

  }, []);

  return {
    characters,
    locations,
    loading,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacter,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocation,
    importBatchData
  };
};