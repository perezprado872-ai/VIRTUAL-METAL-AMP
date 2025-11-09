import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  mediaStream: MediaStream;
  onSignal: (hasSignal: boolean) => void;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ mediaStream, onSignal }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameId = useRef<number>(0);
  const hasSignalRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<number | null>(null);


  useEffect(() => {
    if (mediaStream && canvasRef.current) {
      // Ensure we have a single AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);
      sourceRef.current = source;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const draw = () => {
        animationFrameId.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2;
          
          ctx.fillStyle = `rgba(59, 130, 246, ${barHeight / 150})`; // blue-500 with opacity
          ctx.shadowColor = '#60a5fa'; // blue-400
          ctx.shadowBlur = 10;

          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }

        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        const SIGNAL_THRESHOLD = 10;
        const SILENCE_DELAY = 200;

        if (average > SIGNAL_THRESHOLD) {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          if (!hasSignalRef.current) {
            hasSignalRef.current = true;
            onSignal(true);
          }
        } else {
          if (hasSignalRef.current && silenceTimerRef.current === null) {
            silenceTimerRef.current = window.setTimeout(() => {
              hasSignalRef.current = false;
              onSignal(false);
              silenceTimerRef.current = null;
            }, SILENCE_DELAY);
          }
        }
      };

      draw();
    }

    return () => {
      // Cleanup on component unmount or stream change
      cancelAnimationFrame(animationFrameId.current);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      // Do not close the audio context, as it might be shared or reused.
    };
  }, [mediaStream, onSignal]);

  return <canvas ref={canvasRef} width="80" height="80" />;
};

export default AudioVisualizer;
