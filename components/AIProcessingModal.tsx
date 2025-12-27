import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Cpu, CheckCircle2, AlertTriangle, Loader2, Terminal, ShieldAlert, GripHorizontal } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useStore } from '../hooks/useStore';

interface AIProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIProcessingModal: React.FC<AIProcessingModalProps> = ({ isOpen, onClose }) => {
  const { importBatchData } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Draggable State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // Auto-scroll logs
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (logsEndRef.current) {
         logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  }, [logs]);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: position.x,
        initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${message}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      addLog(`[LOG] 正在粉碎原始文本: ${e.target.files[0].name}...`);
    }
  };

  const processFile = async () => {
    if (!file) return;
    
    setStep('processing');
    setProgress(5);
    addLog("[LOG] 启动 Dreamboat 协议...");
    
    try {
        const text = await file.text();
        addLog(`[LOG] 文本流加载完毕。大小: ${text.length} 字节`);
        setProgress(20);

        addLog("[LOG] 建立与 Gemini 2.5 Flash 的神经链接...");
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Detailed Prompt based on README rules
        const prompt = `
          ROLE: Lead Data Archivist for LoreForge.
          TASK: Scan the input text. Extract Characters and Locations into JSON.
          
          *** IDENTITY MAPPING STRATEGY (MANDATORY) ***
          1. CORE MATCH: If character name contains "阿葡", "Ah Pu", "PUU", or "Puu" -> Set name to "PUU", Role to "Protagonist". 
             (System will map this to Core_Entity_001).
          2. EXTRACTION WEIGHTS:
             - Extract at least 1 MALE character (Role: Antagonist or Supporting). Infer relationships.
             - Extract at least 1 LOCATION.
          3. MALE CHARACTERS: If a male character is found, mark them clearly. They will replace existing placeholders.
          4. SENTIMENT: Analyze interaction frequency/emotion for 'relationships'. Calculate intensity (0-100).
          
          OUTPUT SCHEMA (JSON ONLY):
          {
            "characters": [
              {
                "name": "string",
                "role": "Protagonist" | "Antagonist" | "Supporting",
                "worldview": "string",
                "race": "string",
                "characterClass": "string",
                "faction": "string",
                "description": "string (min 50 chars)",
                "appearance": "string",
                "tags": ["string"],
                "relationships": [ { "targetId": "unknown", "type": "string", "intensity": number } ]
              }
            ],
            "locations": [
              {
                "name": "string",
                "type": "string",
                "worldview": "string",
                "description": "string (include sensory details: light, smell, weather)",
                "history": "string",
                "culture": "string",
                "residents": []
              }
            ],
            "analysis_log": "Explain why specific characters were chosen. E.g. 'Mapped Ah Pu to Core. Identified Old Mu as main male lead.'"
          }
        `;

        addLog("[LOG] 发送数据包...");
        setProgress(40);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    { text: `SOURCE TEXT:\n${text.substring(0, 50000)}` } 
                ]
            },
            config: {
                responseMimeType: "application/json"
            }
        });

        setProgress(70);
        addLog("[LOG] 神经响应接收。解析 JSON 矩阵...");
        
        const rawText = response.text || "{}";
        let data;
        try {
             data = JSON.parse(rawText);
        } catch (e) {
             throw new Error("JSON Parse Failed");
        }
        
        // Visualize specifics based on analysis log
        if (data.analysis_log) {
            addLog(`[AI ANALYSIS] ${data.analysis_log}`);
        }

        const core = data.characters?.find((c:any) => c.name.toUpperCase().includes('PUU') || c.name.includes('阿葡'));
        if (core) addLog(`[LOG] 实体锚定：检测到阿葡 (Core_001)...`);
        
        const males = data.characters?.filter((c:any) => c.role !== 'Protagonist');
        if (males.length) addLog(`[LOG] 关系提取：识别男性角色 [${males[0].name}]...`);
        
        if (data.locations?.length) addLog(`[LOG] 空间构建：更新地点 [${data.locations[0].name}]...`);

        setProgress(90);
        addLog("[LOG] 注入本地数据库...");
        
        importBatchData(data);

        setProgress(100);
        setStep('complete');
        addLog("[SUCCESS] 注入完成，点击关闭同步数据库。");

    } catch (err: any) {
        console.error(err);
        setStep('error');
        addLog(`[ERROR] 协议中断: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center">
      {/* Draggable Window Container */}
      <div 
        className="pointer-events-auto bg-black border border-white shadow-2xl w-[600px] flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        
        {/* Header (Drag Handle) */}
        <div 
            className="flex items-center justify-between px-3 py-2 border-b border-white bg-surface cursor-move select-none"
            onMouseDown={handleMouseDown}
        >
            <div className="flex items-center gap-2 text-white">
                <GripHorizontal size={14} className="text-concrete" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">The Ingestion Sandbox</span>
            </div>
            <button 
                onClick={step === 'processing' ? undefined : onClose} 
                className={`text-white hover:text-red-500 transition-colors ${step === 'processing' ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
                <X size={14} />
            </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-0 overflow-hidden relative min-h-[300px]">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[size:10px_10px] bg-grid-pattern opacity-10 pointer-events-none"></div>

            {step === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 relative z-10">
                    {/* Added 'relative' here to contain the absolute input */}
                    <div className="relative border border-dashed border-white/30 p-8 w-full flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors text-center group">
                        <Upload size={24} className="text-concrete group-hover:text-white" />
                        <div>
                            <p className="font-display text-lg uppercase font-bold text-white">Upload .TXT Source</p>
                        </div>
                        <input 
                            type="file" 
                            accept=".txt"
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    
                    {file && (
                        <div className="w-full">
                             <div className="text-[9px] font-mono text-concrete uppercase border-l border-white pl-2 mb-2 truncate">
                                Target: {file.name}
                             </div>
                             <button 
                                onClick={processFile}
                                className="w-full py-2 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-concrete hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Cpu size={12} /> Activate
                            </button>
                        </div>
                    )}
                </div>
            )}

            {(step === 'processing' || step === 'complete' || step === 'error') && (
                <div className="flex-1 flex flex-col p-2 font-mono text-[10px] relative z-10">
                    
                    {/* Log Terminal */}
                    <div className="flex-1 bg-black border border-white/10 p-2 overflow-y-auto space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className="text-concrete hover:text-white transition-colors break-words">
                                {log}
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>

                    {/* Footer Status */}
                    <div className="mt-2 pt-2 border-t border-white/20">
                         {step === 'processing' && (
                             <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
                                 <ShieldAlert size={12} />
                                 <span className="uppercase tracking-widest font-bold">PROTOCOL ACTIVE: KEEP PAGE OPEN</span>
                             </div>
                         )}
                         {step === 'complete' && (
                             <div className="flex items-center gap-2 text-green-500">
                                 <CheckCircle2 size={12} />
                                 <span className="uppercase tracking-widest font-bold">SYSTEM UPDATE COMPLETE</span>
                             </div>
                         )}
                         {step === 'error' && (
                             <div className="flex items-center gap-2 text-red-500">
                                 <AlertTriangle size={12} />
                                 <span className="uppercase tracking-widest font-bold">PROCESS TERMINATED</span>
                             </div>
                         )}
                    </div>
                </div>
            )}
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 bg-white/10 w-full">
             <div 
                className={`h-full transition-all duration-500 ease-out ${step === 'error' ? 'bg-red-600' : 'bg-white'}`} 
                style={{ width: `${progress}%` }}
             ></div>
        </div>

      </div>
    </div>
  );
};

export default AIProcessingModal;