import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../types';
import { Plus } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link to={`/character/${character.id}`} className="block group relative">
      {/* The "Card" is just a raw container with a border */}
      <div className="border border-white/20 bg-black transition-all duration-300 group-hover:border-white group-hover:bg-white/5">
        
        {/* Decorative Header Line */}
        <div className="flex justify-between items-center px-2 py-1 border-b border-white/20 text-[9px] text-concrete uppercase tracking-widest font-mono">
            <span>ID: {character.id.slice(-4)}</span>
            <span>TYPE: {character.role}</span>
        </div>

        {/* Image - Grayscale to High Contrast */}
        <div className="aspect-[3/4] w-full overflow-hidden relative border-b border-white/20">
          <img 
            src={character.imageUrl || `https://picsum.photos/seed/${character.id}/400/500`} 
            alt={character.name}
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 transition-all duration-500 group-hover:scale-105 group-hover:contrast-150"
          />
          
          {/* Overlay Graphics */}
          <div className="absolute top-2 right-2 w-2 h-2 border border-white/50"></div>
          <div className="absolute bottom-2 left-2 text-[8px] text-white/70 font-mono bg-black/50 px-1">
             RACE: {character.race.toUpperCase()}
          </div>
          
          {/* Hover Reveal: Invert Effect */}
          <div className="absolute inset-0 bg-white mix-blend-difference opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </div>

        {/* Content - Brutalist Type */}
        <div className="p-4">
          <h3 className="font-display text-2xl font-black uppercase leading-none tracking-tighter mb-2 group-hover:text-white transition-colors">
            {character.name}
          </h3>
          
          <div className="w-8 h-[2px] bg-white/50 mb-3 group-hover:w-full transition-all duration-500 ease-out"></div>

          <p className="text-xs text-concrete font-mono line-clamp-3 leading-relaxed uppercase">
            {character.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {character.tags.slice(0, 3).map(tag => (
              <span key={tag} className="border border-white/30 px-2 py-1 text-[9px] uppercase tracking-widest text-concrete group-hover:border-white group-hover:text-white transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Corner "Plus" marks for technical feel */}
        <Plus size={8} className="absolute -top-[5px] -left-[5px] text-white" />
        <Plus size={8} className="absolute -top-[5px] -right-[5px] text-white" />
        <Plus size={8} className="absolute -bottom-[5px] -left-[5px] text-white" />
        <Plus size={8} className="absolute -bottom-[5px] -right-[5px] text-white" />
      </div>
    </Link>
  );
};

export default CharacterCard;