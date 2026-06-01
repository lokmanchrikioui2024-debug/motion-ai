"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, User, Activity, Mountain, Settings, Wand2,
  Check, ChevronRight, X, Image as ImageIcon, Play
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FuturisticProgress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Upload", icon: Upload },
  { id: 2, label: "Model", icon: User },
  { id: 3, label: "Motion", icon: Activity },
  { id: 4, label: "Scene", icon: Mountain },
  { id: 5, label: "Settings", icon: Settings },
  { id: 6, label: "Generate", icon: Wand2 },
];

const modelOptions = [
  { id: "female", label: "Female", desc: "Elegant feminine silhouette", emoji: "👩" },
  { id: "male", label: "Male", desc: "Athletic masculine build", emoji: "👨" },
  { id: "unisex", label: "Unisex", desc: "Gender-neutral presentation", emoji: "🧑" },
];

const motionOptions = [
  { id: "walking", label: "Walking", desc: "Natural runway walk", preview: "🚶" },
  { id: "rotation", label: "360° Rotation", desc: "Full product showcase", preview: "🔄" },
  { id: "showcase", label: "Product Showcase", desc: "Highlight key details", preview: "✨" },
  { id: "fashion-pose", label: "Fashion Pose", desc: "Editorial poses", preview: "💃" },
  { id: "dynamic", label: "Dynamic Commercial", desc: "High-energy movement", preview: "⚡" },
];

const sceneOptions = [
  { id: "studio", label: "Studio", desc: "Clean white backdrop", color: "from-gray-400/20 to-white/10" },
  { id: "luxury-store", label: "Luxury Store", desc: "Upscale retail space", color: "from-amber-400/20 to-yellow-500/10" },
  { id: "street", label: "Street", desc: "Urban city backdrop", color: "from-slate-400/20 to-zinc-500/10" },
  { id: "beach", label: "Beach", desc: "Coastal outdoor vibes", color: "from-blue-400/20 to-cyan-500/10" },
  { id: "minimal-white", label: "Minimal White", desc: "Pure minimal aesthetic", color: "from-white/10 to-gray-200/5" },
  { id: "lifestyle", label: "Lifestyle", desc: "Real-world setting", color: "from-emerald-400/20 to-green-500/10" },
];

const formatOptions = [
  { id: "tiktok", label: "TikTok", desc: "9:16 vertical", dims: "1080×1920" },
  { id: "instagram", label: "Instagram", desc: "1:1 square", dims: "1080×1080" },
  { id: "youtube", label: "YouTube", desc: "16:9 landscape", dims: "1920×1080" },
  { id: "instagram-story", label: "Story", desc: "9:16 story", dims: "1080×1920" },
];

const resolutionOptions = ["720p", "1080p", "4K"];
const durationOptions = [10, 15, 20, 30];

const GENERATION_STAGES = [
  "Analyzing garment structure...",
  "Applying AI texture mapping...",
  "Generating motion sequence...",
  "Rendering scene composition...",
  "Finalizing video output...",
];

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("female");
  const [selectedMotion, setSelectedMotion] = useState("walking");
  const [selectedScene, setSelectedScene] = useState("studio");
  const [selectedFormat, setSelectedFormat] = useState("tiktok");
  const [selectedResolution, setSelectedResolution] = useState("4K");
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const [done, setDone] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadedPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxFiles: 1,
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);

    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      setProgressStage(GENERATION_STAGES[i]);
      await new Promise(r => setTimeout(r, 1200));
      setProgress(((i + 1) / GENERATION_STAGES.length) * 100);
    }

    setGenerating(false);
    setDone(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Generate Video</h1>
        <p className="text-slate-500 mt-1">Transform your garment into a professional marketing video</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
              <button
                onClick={() => isDone && setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  isActive ? "bg-violet-500/10 border border-violet-500/30 text-violet-300" :
                  isDone ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-pointer hover:bg-emerald-500/20" :
                  "bg-white/[0.03] border border-white/[0.05] text-slate-600"
                )}
              >
                {isDone ? <Check size={12} /> : <Icon size={12} />}
                <span className="hidden sm:block">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn("flex-1 h-px", isDone ? "bg-emerald-500/30" : "bg-white/[0.05]")} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-6 lg:p-8"
        >
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg">Upload Garment Image</h2>
              {uploadedPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-500/5">
                  <img src={uploadedPreview} alt="Uploaded" className="w-full max-h-64 object-contain p-4" />
                  <div className="absolute top-3 right-3">
                    <button onClick={() => { setUploadedFile(null); setUploadedPreview(null); }}
                      className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-red-500/50 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-3 flex items-center gap-2 border-t border-emerald-500/20">
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">{uploadedFile?.name}</span>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
                    isDragActive
                      ? "border-violet-500/50 bg-violet-500/5 scale-[1.01]"
                      : "border-white/[0.08] hover:border-violet-500/30 hover:bg-violet-500/[0.02]"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <Upload size={28} className="text-violet-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {isDragActive ? "Drop it here!" : "Drag & drop your garment"}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">Supports PNG, JPG, WEBP — Max 50MB</p>
                  <Button variant="secondary" size="sm" type="button">
                    <ImageIcon size={14} /> Browse Files
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Model */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg">Choose Your Model</h2>
              <div className="grid grid-cols-3 gap-4">
                {modelOptions.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={cn(
                      "p-5 rounded-2xl border text-center transition-all duration-200 hover:scale-[1.02]",
                      selectedModel === m.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                    )}
                  >
                    <div className="text-4xl mb-3">{m.emoji}</div>
                    <p className="text-white font-semibold text-sm">{m.label}</p>
                    <p className="text-slate-500 text-xs mt-1">{m.desc}</p>
                    {selectedModel === m.id && (
                      <div className="mt-3 flex justify-center">
                        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                          <Check size={11} className="text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Motion */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg">Select Motion Style</h2>
              <div className="space-y-3">
                {motionOptions.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMotion(m.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200",
                      selectedMotion === m.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="text-2xl w-10 text-center">{m.preview}</div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{m.label}</p>
                      <p className="text-slate-500 text-xs">{m.desc}</p>
                    </div>
                    {selectedMotion === m.id && <Check size={16} className="text-violet-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Scene */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg">Choose Scene & Background</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sceneOptions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScene(s.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02]",
                      selectedScene === s.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/[0.06] hover:border-white/[0.12]"
                    )}
                  >
                    <div className={cn("h-16 rounded-lg mb-3 bg-gradient-to-br", s.color)} />
                    <p className="text-white font-medium text-sm">{s.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Settings */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg">Video Settings</h2>
              
              <div className="space-y-5">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-3">Format</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formatOptions.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFormat(f.id)}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all",
                          selectedFormat === f.id
                            ? "border-violet-500/50 bg-violet-500/10"
                            : "border-white/[0.06] hover:border-white/[0.12]"
                        )}
                      >
                        <p className="text-white font-medium text-sm">{f.label}</p>
                        <p className="text-slate-500 text-xs">{f.desc}</p>
                        <p className="text-violet-400 text-xs font-mono mt-1">{f.dims}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm font-medium mb-3">Resolution</p>
                  <div className="flex gap-3">
                    {resolutionOptions.map(r => (
                      <button
                        key={r}
                        onClick={() => setSelectedResolution(r)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          selectedResolution === r
                            ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                            : "border-white/[0.06] text-slate-400 hover:border-white/[0.12]"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm font-medium mb-3">Duration</p>
                  <div className="flex gap-3">
                    {durationOptions.map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDuration(d)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          selectedDuration === d
                            ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                            : "border-white/[0.06] text-slate-400 hover:border-white/[0.12]"
                        )}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Generate */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-lg">Generate Your Video</h2>
              
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Model", value: modelOptions.find(m => m.id === selectedModel)?.label },
                  { label: "Motion", value: motionOptions.find(m => m.id === selectedMotion)?.label },
                  { label: "Scene", value: sceneOptions.find(s => s.id === selectedScene)?.label },
                  { label: "Format", value: formatOptions.find(f => f.id === selectedFormat)?.label },
                  { label: "Resolution", value: selectedResolution },
                  { label: "Duration", value: `${selectedDuration}s` },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-slate-500 text-xs">{item.label}</p>
                    <p className="text-white font-medium text-sm mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {generating && (
                <div className="space-y-4 p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    <span className="text-violet-300 font-medium">AI is generating your video...</span>
                  </div>
                  <FuturisticProgress value={progress} stage={progressStage} />
                  <p className="text-slate-500 text-xs">This usually takes 1-2 minutes. Don't close this window.</p>
                </div>
              )}

              {done && (
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <Check size={32} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Video Ready! 🎉</h3>
                    <p className="text-slate-500 text-sm mt-1">Your video has been generated successfully</p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="primary">
                      <Play size={16} /> Preview
                    </Button>
                    <Button variant="secondary">Download</Button>
                  </div>
                </div>
              )}

              {!generating && !done && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Wand2 size={16} className="text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Ready to generate</p>
                    <p className="text-slate-500 text-xs">This will use ~5 AI credits</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Back
        </Button>
        
        {step < 6 ? (
          <Button
            variant="primary"
            onClick={() => setStep(s => Math.min(6, s + 1))}
            disabled={step === 1 && !uploadedFile}
          >
            Continue <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={generating || done}
            loading={generating}
          >
            <Wand2 size={16} />
            {generating ? "Generating..." : done ? "Generated!" : "Generate Video"}
          </Button>
        )}
      </div>
    </div>
  );
}
