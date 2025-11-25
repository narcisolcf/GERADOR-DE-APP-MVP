import React from 'react';
import { Clock, Trash2, RotateCcw } from 'lucide-react';
import { Blueprint } from '../../types';

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
  onLoad: (blueprint: Blueprint) => void;
  onDelete: (id: string) => void;
}

export const BlueprintGallery: React.FC<BlueprintGalleryProps> = ({ blueprints, onLoad, onDelete }) => {
  if (blueprints.length === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500 mt-8">
       <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-slate-500" /> Saved Blueprints
       </h3>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {blueprints.map((bp) => (
            <div 
              key={bp.id} 
              className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => onLoad(bp)}
              role="button"
              tabIndex={0}
              aria-label={`Load blueprint: ${bp.config.prompt}`}
            >
              <div className="aspect-video bg-slate-100 overflow-hidden relative">
                <img src={bp.imageBase64} alt="Blueprint thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                   <RotateCcw className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all" />
                </div>
              </div>
              <div className="p-3">
                 <p className="text-xs text-slate-700 font-semibold line-clamp-1 mb-1">{bp.config.prompt}</p>
                 <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{bp.config.size} • {bp.config.aspectRatio}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(bp.id);
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete blueprint"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};