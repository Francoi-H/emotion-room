export const EMOTIONS = ['calm', 'focus', 'joy', 'chaos', 'melancholy', 'wonder'];

export const EMOTION_META = {
  calm:      { label: 'Calm',      icon: '◌', description: 'Slow, drifting, weightless' },
  focus:     { label: 'Focus',     icon: '◈', description: 'Sharp, rhythmic, geometric' },
  joy:       { label: 'Joy',       icon: '◉', description: 'Bright, energetic, bursting' },
  chaos:     { label: 'Chaos',     icon: '◌̈', description: 'Frantic, distorted, raw' },
  melancholy:{ label: 'Melancholy',icon: '◍', description: 'Dark, slow, heavy' },
  wonder:    { label: 'Wonder',    icon: '✦', description: 'Cosmic, luminous, vast' },
};

export const EMOTION_DEFAULTS = {
  calm: {
    waveSpeed: 0.08, particleCount: 60, particleSize: 2.2,
    colorPalette: ['#90dbf4','#a3c4f3','#cfbaf0','#f9c74f','#f1faee'],
    bgColor: '#0a1628', lightIntensity: 0.4, cameraMotion: 0.05,
    distortionLevel: 0.0, bloomStrength: 0.3, fogDensity: 0.015,
    waveAmplitude: 0.4, rotationSpeed: 0.01, glitchIntensity: 0.0, trailLength: 0.92,
  },
  focus: {
    waveSpeed: 0.3, particleCount: 200, particleSize: 1.4,
    colorPalette: ['#00b4d8','#0077b6','#caf0f8','#48cae4','#90e0ef'],
    bgColor: '#050a12', lightIntensity: 0.8, cameraMotion: 0.02,
    distortionLevel: 0.05, bloomStrength: 0.6, fogDensity: 0.008,
    waveAmplitude: 0.2, rotationSpeed: 0.05, glitchIntensity: 0.0, trailLength: 0.85,
  },
  joy: {
    waveSpeed: 0.9, particleCount: 500, particleSize: 2.8,
    colorPalette: ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b'],
    bgColor: '#120a1e', lightIntensity: 1.2, cameraMotion: 0.15,
    distortionLevel: 0.1, bloomStrength: 0.9, fogDensity: 0.005,
    waveAmplitude: 0.7, rotationSpeed: 0.12, glitchIntensity: 0.0, trailLength: 0.78,
  },
  chaos: {
    waveSpeed: 3.5, particleCount: 2000, particleSize: 1.2,
    colorPalette: ['#ff0054','#ff5400','#ffbd00','#00ff85','#7b2fff'],
    bgColor: '#030303', lightIntensity: 2.0, cameraMotion: 0.8,
    distortionLevel: 0.85, bloomStrength: 1.4, fogDensity: 0.0,
    waveAmplitude: 2.0, rotationSpeed: 0.6, glitchIntensity: 0.9, trailLength: 0.55,
  },
  melancholy: {
    waveSpeed: 0.12, particleCount: 120, particleSize: 1.6,
    colorPalette: ['#2d3561','#a23b72','#c73e1d','#3b1f2b','#44cf6c'],
    bgColor: '#08080f', lightIntensity: 0.25, cameraMotion: 0.03,
    distortionLevel: 0.15, bloomStrength: 0.2, fogDensity: 0.025,
    waveAmplitude: 0.3, rotationSpeed: 0.008, glitchIntensity: 0.0, trailLength: 0.95,
  },
  wonder: {
    waveSpeed: 0.5, particleCount: 800, particleSize: 2.0,
    colorPalette: ['#e040fb','#7c4dff','#40c4ff','#64ffda','#fff176'],
    bgColor: '#060418', lightIntensity: 1.0, cameraMotion: 0.1,
    distortionLevel: 0.2, bloomStrength: 1.1, fogDensity: 0.01,
    waveAmplitude: 0.9, rotationSpeed: 0.07, glitchIntensity: 0.05, trailLength: 0.88,
  },
};

export const PARAM_CONFIG = [
  { key: 'waveSpeed',       label: 'Wave Speed',       min: 0,   max: 5,    step: 0.01 },
  { key: 'particleCount',   label: 'Particle Count',   min: 10,  max: 3000, step: 10   },
  { key: 'particleSize',    label: 'Particle Size',    min: 0.5, max: 6,    step: 0.1  },
  { key: 'lightIntensity',  label: 'Light Intensity',  min: 0,   max: 3,    step: 0.05 },
  { key: 'cameraMotion',    label: 'Camera Motion',    min: 0,   max: 1,    step: 0.01 },
  { key: 'distortionLevel', label: 'Distortion',       min: 0,   max: 1,    step: 0.01 },
  { key: 'bloomStrength',   label: 'Bloom',            min: 0,   max: 2,    step: 0.05 },
  { key: 'waveAmplitude',   label: 'Wave Amplitude',   min: 0,   max: 3,    step: 0.05 },
  { key: 'rotationSpeed',   label: 'Rotation Speed',   min: 0,   max: 1,    step: 0.005},
  { key: 'glitchIntensity', label: 'Glitch',           min: 0,   max: 1,    step: 0.01 },
  { key: 'trailLength',     label: 'Trail Length',     min: 0.1, max: 0.99, step: 0.01 },
];
