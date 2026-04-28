import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3 } from 'lucide-react';
import './App.css';

// Componente Hi-Fi de CSS y Canvas Profundo (Interactivo + Flote Sutil)
const ParticleBackground = ({ isPlaying }: { isPlaying: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let ambientParticles: AmbientParticle[] = [];
    let magneticParticles: MagneticParticle[] = [];
    let targets: {x: number, y: number}[] = [];
    
    // Rastreador del mouse
    let mouse = { x: -1000, y: -1000 };

    // Diferentes rangos de opacidades, MAX 60% asegurado (0.6)
    const getSafeOpacity = () => Math.random() * 0.45 + 0.1; // 10% a 55%
    // Variedad enorme en tamaños (Puntos minúsculos y Orbes enormes desenfocados)
    const getRandomSize = (isForeground: boolean) => isForeground ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 0.2;

    // --- ENJAMBRE B: Estrellas Libres (Siempre de fondo) ---
    class AmbientParticle {
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      color: string;
      glow: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.angle = Math.random() * Math.PI * 2;
        
        const isForeground = Math.random() > 0.7;
        const opacity = getSafeOpacity();

        this.size = getRandomSize(isForeground);
        this.speed = isForeground ? Math.random() * 0.15 + 0.05 : Math.random() * 0.05 + 0.01;
        this.glow = isForeground ? Math.random() * 8 + 4 : 0;

        const colors = [
          `rgba(0, 243, 255, ${opacity})`,
          `rgba(0, 255, 179, ${opacity})`,
          `rgba(155, 208, 255, ${opacity})`
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Reactividad del Puntero (Efecto Olas/Separación)
        const dxMouse = this.x - mouse.x;
        const dyMouse = this.y - mouse.y;
        const dist = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
        if (dist < 120) {
           const force = (120 - dist) / 120;
           this.x += (dxMouse / dist) * force * 2;
           this.y += (dyMouse / dist) * force * 2;
        }

        // Flote sutil omnidireccional
        this.angle += (Math.random() - 0.5) * 0.02;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Loop pacífico
        if (this.y < -30) this.y = canvas!.height + 30;
        if (this.y > canvas!.height + 30) this.y = -30;
        if (this.x > canvas!.width + 30) this.x = -30;
        if (this.x < -30) this.x = canvas!.width + 30;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        if (this.glow > 0) {
          ctx.shadowBlur = this.glow;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // --- ENJAMBRE A: Partículas Magnéticas (Puntillismo Dinámico) ---
    class MagneticParticle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      speed: number;
      color: string;
      wobbleOffset: number;
      hasTarget: boolean;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.targetX = this.x;
        this.targetY = this.y;
        this.speedX = 0;
        this.speedY = 0;
        
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.1 + 0.05;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.hasTarget = false;
        
        this.size = getRandomSize(false); // Fino para la imagen

        const opacity = getSafeOpacity();
        const colors = [
          `rgba(0, 255, 179, ${opacity})`,
          `rgba(255, 255, 255, ${opacity})`,
          `rgba(0, 243, 255, ${opacity})`
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      assignTarget(tx: number, ty: number) {
        this.targetX = tx;
        this.targetY = ty;
        this.hasTarget = true;
      }

      update(isPlaying: boolean) {
        if (isPlaying && this.hasTarget) {
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          
          this.speedX += dx * 0.05;
          this.speedY += dy * 0.05;
          this.speedX *= 0.83;
          this.speedY *= 0.83;
          
          const time = Date.now() * 0.002;
          this.x += this.speedX + Math.sin(time + this.wobbleOffset) * 0.6;
          this.y += this.speedY + Math.cos(time + this.wobbleOffset) * 0.6;

          // INTERACCIÓN ELÁSTICA: El mouse rompe momentáneamente el magnetismo del rostro
          const dxMouse = this.x - mouse.x;
          const dyMouse = this.y - mouse.y;
          const dist = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
          if (dist < 100) {
             const force = (100 - dist) / 100;
             this.x += (dxMouse / dist) * force * 15;
             this.y += (dyMouse / dist) * force * 15;
          }

        } else {
          // Si está en Pausa, rompe y flota
          // Interacción reactiva en pausa
          const dxMouse = this.x - mouse.x;
          const dyMouse = this.y - mouse.y;
          const dist = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
          if (dist < 100) {
             const force = (100 - dist) / 100;
             this.x += (dxMouse / dist) * force * 2;
             this.y += (dyMouse / dist) * force * 2;
          }

          this.angle += (Math.random() - 0.5) * 0.02;
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          
          if (this.y < -10) this.y = canvas!.height + 10;
          if (this.y > canvas!.height + 10) this.y = -10;
          if (this.x < -10) this.x = canvas!.width + 10;
          if (this.x > canvas!.width + 10) this.x = -10;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      ambientParticles = [];
      magneticParticles = [];
      for (let i = 0; i < 550; i++) ambientParticles.push(new AmbientParticle());
      for (let i = 0; i < 3500; i++) magneticParticles.push(new MagneticParticle());
    };

    const createTargets = () => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      const img = new Image();
      img.onload = () => {
        const size = Math.min(offCanvas.width, offCanvas.height) * 0.95;
        const xOffset = (offCanvas.width - size) / 2; 
        const yOffset = (offCanvas.height - size) / 2;
        
        offCtx.drawImage(img, xOffset, yOffset, size, size);
        const data = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
        
        targets = [];
        const step = window.innerWidth > 1000 ? 5 : 4;
        for (let y = 0; y < offCanvas.height; y += step) {
          for (let x = 0; x < offCanvas.width; x += step) {
            const index = (y * offCanvas.width + x) * 4;
            if (data[index + 3] > 128) {
              targets.push({ x, y });
            }
          }
        }
        
        for (let i = 0; i < magneticParticles.length; i++) {
          if (targets.length > 0) {
            const t = targets[i % targets.length];
            magneticParticles[i].assignTarget(t.x, t.y);
          }
        }
      };
      
      img.src = '/jesus.png';
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createTargets();
    };

    // 1. PRIMERO le damos al Canvas el tamaño real de la pantalla
    resize();
    window.addEventListener('resize', resize);

    // 2. LUEGO instanciamos las 4000 partículas para que usen la escala correcta
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isPlay = isPlayingRef.current;
      
      for (let i = 0; i < ambientParticles.length; i++) {
        ambientParticles[i].update();
        ambientParticles[i].draw();
      }
      for (let i = 0; i < magneticParticles.length; i++) {
        magneticParticles[i].update(isPlay);
        magneticParticles[i].draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-canvas ${isPlaying ? 'particles-visible' : 'particles-hidden'}`}
    />
  );
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Turntable Physics Refs
  const recordRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);

  const STREAM_URL = 'https://radio.radiobt.live/listen/feinfinita/radio.mp3';

  // Sincronizar estado para el motor de físicas
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Motor de físicas para el Vinilo (Inercia natural)
  useEffect(() => {
    let animationId: number;
    let rotation = 0;
    let velocity = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 16.66; // Normaliza a framerates variables
      lastTime = time;

      if (isPlayingRef.current) {
        velocity += 0.03 * dt; // Acelera suave (Motor enciende)
        if (velocity > 3.5) velocity = 3.5; // Top RPM
      } else {
        velocity -= 0.012 * dt; // Desacelera lento (Fricción al apagar motor)
        if (velocity < 0) velocity = 0;
      }

      if (velocity > 0) {
        rotation += velocity * dt;
        if (recordRef.current) {
          recordRef.current.style.transform = `rotate(${rotation}deg)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.volume = volume;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = STREAM_URL + '?t=' + Date.now();
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Play error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="hero-container">
      {/* Fondo Animado Responsivo */}
      <ParticleBackground isPlaying={isPlaying} />

      {/* Left Typography Container */}
      <div className="hero-left">
        <div className="hero-text">
          <div className="brand">
            <Disc3 size={18} />
            Radio Fe Infinita
          </div>
          
          <h1 className="title">
            Conecta tu ser,<br />
            Renueva tu <span>Fe</span>.
          </h1>
          
          <p className="description">
            Experimenta una calidad de sonido audiófila las 24 horas del día. 
            Alabanza majestuosa, adoración inmersiva y un mensaje continuo de esperanza en alta fidelidad.
          </p>
        </div>

        <div className="controls-deck">
          <button className="btn-play" onClick={togglePlay}>
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{marginLeft: '4px'}} />}
          </button>

          <div className="volume-wrapper">
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="vol-slider"
            />
          </div>
        </div>
      </div>

      {/* Right Turntable Deck */}
      <div className="hero-right">
        <div className="turntable-base">
          
          <div className="platter"></div>
          
          <div ref={recordRef} className="record-disc">
            <div className="grooves"></div>
            <div className="reflection"></div>
            <div className="label">
              <div className="label-text">FE INFINITA<br/><span style={{fontSize:'0.45rem', fontWeight:400, color:'#555', letterSpacing:'0px', textShadow: 'none'}}>ALABANZA & ADORACIÓN 24/7</span></div>
              <div className="spindle"></div>
            </div>
          </div>

          <div className={`tonearm-assembly ${isPlaying ? 'tonearm-playing' : ''}`}>
            <div className="counterweight"></div>
            <div className="pivot-base">
              <div className="pivot-center"></div>
            </div>
            <div className="arm-tube"></div>
            <div className="headshell"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
