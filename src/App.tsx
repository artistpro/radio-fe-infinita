import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const STREAM_URL = 'https://radio.radiobt.live/listen/feinfinita/radio.mp3';

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = STREAM_URL;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Play error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="hero-wrapper">
      {/* Cinematic Background */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      <div className="orb-3"></div>

      <div className="content-layer">
        <div className="header-brand">RADIO FE INFINITA</div>

        {/* Back Typography */}
        <div className="title-container">
          <h1 className="massive-title">INFINITA</h1>
          <div className="subtitle">ESTACIÓN DE ALABANZA CRISTIANA</div>
        </div>

        {/* The Insane Vinyl Player */}
        <div className="interactive-player">
          {isPlaying && (
            <div className="live-badge">
              <div className="dot"></div> EN VIVO
            </div>
          )}

          <div className="giant-vinyl" onClick={togglePlay}>
            <div className={`glow-ring ${isPlaying ? 'playing-glow' : ''}`}></div>
            <div className="grooves-inner"></div>
            
            <div className={`spin-container ${isPlaying ? 'spin-anim' : ''} ${!isPlaying && audioRef.current?.currentTime ? 'paused-anim' : ''}`} style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="vinyl-core">
                <div className="vinyl-hole"></div>
                <div style={{ position: 'absolute', color: '#111', fontSize: 'clamp(0.6rem, 2vw, 1rem)', fontWeight: 900, textTransform: 'uppercase', top: '15%' }}>
                  24/7
                </div>
              </div>
            </div>

            {/* Play Glass Button floating in middle */}
            <div className="play-action-btn">
              {isPlaying ? <Pause size={48} fill="#fff" /> : <Play size={48} fill="#fff" style={{ marginLeft: '8px' }} />}
            </div>

            {/* Tonearm */}
            <div className={`giant-tonearm ${isPlaying ? 'engaged' : ''}`}>
              <svg viewBox="0 0 100 150" fill="none" stroke="#ddd" strokeWidth="6" style={{ width: '100%', height: '100%' }}>
                <path d="M 80 10 Q 50 10 40 60 L 20 130 L 10 135" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="80" cy="10" r="15" fill="#222" stroke="#444" strokeWidth="4" />
                <rect x="0" y="125" width="25" height="35" fill="#111" rx="5" stroke="#333" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Marquee Ticker */}
        <div className="marquee-container">
          <div className="marquee-content">
            <span style={{ paddingRight: '2rem' }}>✦ SINTONIZA AHORA ✦ MÚSICA CRISTIANA 24/7 ✦ ALABANZA Y ADORACIÓN ✦ FE INFINITA RADIO ✦</span>
            <span style={{ paddingRight: '2rem' }}>✦ SINTONIZA AHORA ✦ MÚSICA CRISTIANA 24/7 ✦ ALABANZA Y ADORACIÓN ✦ FE INFINITA RADIO ✦</span>
            <span style={{ paddingRight: '2rem' }}>✦ SINTONIZA AHORA ✦ MÚSICA CRISTIANA 24/7 ✦ ALABANZA Y ADORACIÓN ✦ FE INFINITA RADIO ✦</span>
            <span style={{ paddingRight: '2rem' }}>✦ SINTONIZA AHORA ✦ MÚSICA CRISTIANA 24/7 ✦ ALABANZA Y ADORACIÓN ✦ FE INFINITA RADIO ✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
