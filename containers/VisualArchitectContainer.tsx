import React, { useState, useEffect } from 'react';
import { Image, Download, RefreshCw, Wand2, Save } from 'lucide-react';
import { AspectRatio, ImageSize, Blueprint } from '../types';
import { generateArchitecturalImage } from '../services/geminiService';
import { blueprintStorage } from '../services/blueprintStorage';
import { Button } from '../components/ui/Button';
import { BlueprintGallery } from '../components/visual-architect/BlueprintGallery';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

export const VisualArchitectContainer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [size, setSize] = useState<ImageSize>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Gallery State
  const [savedBlueprints, setSavedBlueprints] = useState<Blueprint[]>([]);

  useEffect(() => {
    setSavedBlueprints(blueprintStorage.getAll());
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const imageBase64 = await generateArchitecturalImage({ prompt, aspectRatio, size });
      setGeneratedImage(imageBase64);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedImage) return;

    const newBlueprint: Blueprint = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      config: { prompt, aspectRatio, size },
      imageBase64: generatedImage
    };

    try {
      blueprintStorage.save(newBlueprint);
      setSavedBlueprints(blueprintStorage.getAll());
    } catch (err: any) {
      setError(err.message || "Failed to save blueprint.");
    }
  };

  const handleDelete = (id: string) => {
    const updated = blueprintStorage.delete(id);
    setSavedBlueprints(updated);
  };

  const handleLoad = (blueprint: Blueprint) => {
    setPrompt(blueprint.config.prompt);
    setAspectRatio(blueprint.config.aspectRatio);
    setSize(blueprint.config.size);
    setGeneratedImage(blueprint.imageBase64);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500 pb-12">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Wand2 className="w-5 h-5 mr-2 text-purple-600" /> Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your architectural vision (e.g., 'A futuristic glass skyscraper in a lush forest')"
                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Aspect Ratio
                </label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Resolution
                </label>
                <div className="flex gap-2">
                  {IMAGE_SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s as ImageSize)}
                      className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                        size === s 
                          ? 'bg-purple-100 text-purple-700 border-purple-300' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              isLoading={loading} 
              variant="purple" 
              className="w-full"
              disabled={!prompt}
            >
              Generate Blueprint
            </Button>
            
            {error && <p className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-100">
           <strong>Pro Tip:</strong> Use "Sketch", "Blueprint", or "Photorealistic" keywords to control style.
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden min-h-[500px] flex items-center justify-center relative group">
          {generatedImage ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img 
                src={generatedImage} 
                alt="Generated Architecture" 
                className="max-h-[600px] max-w-full object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={handleSave}
                    className="bg-black/60 hover:bg-black/80 text-white p-2 rounded backdrop-blur-sm transition-all flex items-center gap-2 text-xs font-bold"
                    title="Save to Gallery"
                >
                    <Save className="w-4 h-4" /> Save
                </button>
                <a 
                  href={generatedImage} 
                  download={`architect-render-${Date.now()}.png`}
                  className="bg-black/60 hover:bg-black/80 text-white p-2 rounded backdrop-blur-sm transition-all flex items-center gap-2 text-xs font-bold"
                  title="Download High-Res"
                >
                  <Download className="w-4 h-4" /> DL
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              {loading ? (
                <div className="animate-pulse flex flex-col items-center">
                  <RefreshCw className="w-10 h-10 animate-spin mb-4 text-purple-500" />
                  <p>Rendering High-Fidelity Output...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Image className="w-16 h-16 mb-4 opacity-20" />
                  <p>Ready to Visualize</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Blueprint Gallery */}
        <BlueprintGallery 
          blueprints={savedBlueprints}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};