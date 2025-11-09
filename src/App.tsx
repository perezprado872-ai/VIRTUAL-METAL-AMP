import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateTone } from './services/geminiService';
import type { KnobSettings, GeneratedTone } from './types';
import Knob from './components/Knob';
import CrossIcon from './components/icons/CrossIcon';
import FolderIcon from './components/icons/FolderIcon';
import PentagramIcon from './components/icons/PentagramIcon';
import AudioVisualizer from './components/AudioVisualizer';

const App: React.FC = () => {
  const [knobSettings, setKnobSettings] = useState<KnobSettings>({
    gain: 50,
    bass: 50,
    mid: 50,
    treb: 50,
    vol: 75,
  });
  const [generatedTone, setGeneratedTone] = useState<GeneratedTone | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [irFileName, setIrFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReceivingSignal, setIsReceivingSignal] = useState(false);

  useEffect(() => {
    if (!audioStream) {
      setIsReceivingSignal(false);
    }
  }, [audioStream]);

  const handleKnobChange = (knob: keyof KnobSettings, value: number) => {
    setKnobSettings(prev => ({
      ...prev,
      [knob]: value,
    }));
  };

  // Fix: Corrected the malformed try-catch block, which was causing all the "Cannot find name" errors.
  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedTone(null);
    try {
      const data = await generateTone(knobSettings);
      setGeneratedTone(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [knobSettings]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleGenerate();
    }, 750); // Debounce API calls by 750ms

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [knobSettings, handleGenerate]);

  const connectAudio = async () => {
    setAudioError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          // These constraints help in getting higher quality audio
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        } 
      });
      setAudioStream(stream);
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Error accessing audio device:", err);
      setAudioError("Could not access audio device. Please ensure permissions are granted and an input device is available.");
    }
  };

  const handleFolderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);
    setIrFileName(null);
    
    if (file) {
      if (file.name.toLowerCase().endsWith('.wav')) {
        setIrFileName(file.name);
      } else {
        setFileError('Invalid file type. Please select a .wav file.');
      }
    }
    
    if (event.target) {
      event.target.value = ''; // Allow re-selecting the same file
    }
  };


  return (
    <main className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".wav,audio/wav"
            className="hidden"
        />
      <div className="w-full max-w-3xl mx-auto">
        {/* Amp Faceplate */}
        <div className="bg-neutral-900 p-1 shadow-2xl rounded-lg border border-neutral-800">
          {/* Top Panel */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-700 p-1.5 rounded-t-md">
            <div className="bg-black p-6 rounded-md shadow-inner">
                <div className="grid grid-cols-5 gap-4">
                    <Knob label="gain" value={knobSettings.gain} onChange={(v) => handleKnobChange('gain', v)} />
                    <Knob label="bass" value={knobSettings.bass} onChange={(v) => handleKnobChange('bass', v)} />
                    <Knob label="mid" value={knobSettings.mid} onChange={(v) => handleKnobChange('mid', v)} />
                    <Knob label="treb" value={knobSettings.treb} onChange={(v) => handleKnobChange('treb', v)} />
                    <Knob label="vol." value={knobSettings.vol} onChange={(v) => handleKnobChange('vol', v)} />
                </div>
            </div>
          </div>
          {/* Bottom Panel */}
          <div 
            className="bg-gradient-to-b from-red-600 to-red-800 p-6 flex justify-between items-center rounded-b-md shadow-inner h-[144px]" // Set a fixed height to prevent layout shift
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"6\" height=\"6\" viewBox=\"0 0 6 6\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.15\"%3E%3Cpath d=\"M5 0h1L0 6V5zM6 5v1H5z\"/%3E%3C/g%3E%3C/svg%3E')" }}
          >
            <button onClick={() => setIsSettingsOpen(true)} className="text-gray-300 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white rounded-full" aria-label="Settings">
              <CrossIcon className="w-12 h-12" />
            </button>
            <div aria-hidden="true" className="pointer-events-none w-20 h-20 flex items-center justify-center relative">
               <PentagramIcon className={`w-20 h-20 transition-all duration-300 ease-in-out ${isReceivingSignal ? 'text-red-500 [filter:drop-shadow(0_0_6px_rgba(239,68,68,0.8))]' : 'text-neutral-300 opacity-70'}`} />
                {audioStream && (
                    <div className="absolute inset-0">
                        <AudioVisualizer mediaStream={audioStream} onSignal={setIsReceivingSignal} />
                    </div>
                )}
            </div>
            <button onClick={handleFolderClick} className="text-gray-300 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white rounded-lg" aria-label="Load Impulse Response">
              <FolderIcon className="w-16 h-16" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Result Section */}
      <div className="w-full max-w-3xl mx-auto mt-6 min-h-[16rem] flex items-center justify-center text-gray-200">
        {isLoading && (
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-400">Dialing in the tone...</p>
            </div>
        )}
        {error && (
            <div className="text-center bg-red-900/50 border border-red-500 p-6 rounded-lg">
                <h3 className="font-bold text-red-300">Error</h3>
                <p className="mt-2 text-red-400">{error}</p>
            </div>
        )}
        {generatedTone && !isLoading && (
            <div className="bg-neutral-800/70 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-neutral-700 animate-fade-in w-full">
                <h2 className="text-4xl font-bold text-blue-400 tracking-wider text-center">{generatedTone.name}</h2>
                <p className="mt-4 text-gray-300 leading-relaxed text-left whitespace-pre-wrap">{generatedTone.description}</p>
            </div>
        )}
      </div>

      {/* IR File Display Section */}
      <div className="w-full max-w-3xl mx-auto mt-2 min-h-[2.5rem] text-center">
        {irFileName && (
          <div className="bg-green-900/50 border border-green-700 p-2 rounded-lg inline-block animate-fade-in">
            <p className="text-green-300">
              <span className="font-semibold">Cabinet IR Loaded:</span> {irFileName}
            </p>
          </div>
        )}
        {fileError && (
          <div className="bg-red-900/50 border border-red-500 p-2 rounded-lg inline-block animate-fade-in">
            <p className="text-red-300">{fileError}</p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-8 max-w-md w-full relative">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white" aria-label="Close settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">Audio Settings</h2>
            <p className="text-gray-400 text-center mb-6">
              To connect your guitar, plug it into an audio interface (e.g., Focusrite Scarlett Solo) and select it as your input device when prompted by your browser.
            </p>
            <button 
              onClick={connectAudio} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Connect Audio Input
            </button>
            {audioError && (
              <p className="text-red-400 text-center mt-4">{audioError}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
