import * as THREE from 'three';

/**
 * EmotionScene
 * Self-contained Three.js renderer. Mount it to a canvas element,
 * feed it `params`, and call `dispose()` when done.
 */
export class EmotionScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.params = null;
    this.clock = new THREE.Clock();
    this.time = 0;
    this.rafId = null;
    this._objects = [];

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._startLoop();
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
  }

  _initCamera() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    this.camera.position.set(0, 0, 30);
    this._camOrigin = this.camera.position.clone();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Apply a new parameter set, rebuilding geometry if needed */
  applyParams(params) {
    const prevCount = this.params?.particleCount;
    this.params = { ...params };

    // Update background
    const bg = new THREE.Color(params.bgColor);
    this.renderer.setClearColor(bg, 1);
    this.scene.fog.color.copy(bg);
    this.scene.fog.density = params.fogDensity;

    // Rebuild particle system if count changed significantly or first load
    if (!prevCount || Math.abs(prevCount - params.particleCount) > 5) {
      this._buildParticles();
    }

    // Update particle sizes
    if (this.particleMaterial) {
      this.particleMaterial.size = params.particleSize;
    }

    // Rebuild wave mesh if needed
    if (!this.waveMesh) this._buildWave();
    if (!this.gridMesh) this._buildGrid();

    this._applyColors();
  }

  resize(w, h) {
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    this._clearObjects();
    this.renderer.dispose();
  }

  // ── Scene builders ─────────────────────────────────────────────────────────

  _clearObjects() {
    for (const obj of this._objects) {
      this.scene.remove(obj);
      obj.geometry?.dispose();
      obj.material?.dispose();
    }
    this._objects = [];
    this.particleMesh = null;
    this.particleMaterial = null;
    this.waveMesh = null;
    this.gridMesh = null;
  }

  _buildParticles() {
    // Remove old particles
    if (this.particleMesh) {
      this.scene.remove(this.particleMesh);
      this.particleMesh.geometry.dispose();
      this.particleMesh.material.dispose();
      this._objects = this._objects.filter(o => o !== this.particleMesh);
    }

    const count = Math.floor(this.params.particleCount);
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;
      velocities[i3]     = (Math.random() - 0.5) * 0.05;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      sizes[i] = Math.random() * 0.5 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo._velocities = velocities; // store for animation

    this.particleMaterial = new THREE.PointsMaterial({
      size: this.params.particleSize,
      sizeAttenuation: true,
      vertexColors: false,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particleMesh = new THREE.Points(geo, this.particleMaterial);
    this.scene.add(this.particleMesh);
    this._objects.push(this.particleMesh);
  }

  _buildWave() {
    const geo = new THREE.PlaneGeometry(100, 80, 80, 60);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    this.waveMesh = new THREE.Mesh(geo, mat);
    this.waveMesh.rotation.x = -Math.PI / 2.5;
    this.waveMesh.position.y = -12;
    this.scene.add(this.waveMesh);
    this._objects.push(this.waveMesh);
  }

  _buildGrid() {
    const geo = new THREE.PlaneGeometry(120, 120, 40, 40);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    this.gridMesh = new THREE.Mesh(geo, mat);
    this.gridMesh.rotation.x = -Math.PI / 2;
    this.gridMesh.position.y = -20;
    this.scene.add(this.gridMesh);
    this._objects.push(this.gridMesh);
  }

  // ── Color application ──────────────────────────────────────────────────────

  _applyColors() {
    if (!this.params || !this.particleMaterial) return;
    const palette = this.params.colorPalette;
    const c = new THREE.Color(palette[0]);
    this.particleMaterial.color = c;

    if (this.waveMesh) {
      this.waveMesh.material.color = new THREE.Color(palette[1] ?? palette[0]);
    }
  }

  // ── Render loop ────────────────────────────────────────────────────────────

  _startLoop() {
    const loop = () => {
      this.rafId = requestAnimationFrame(loop);
      const delta = Math.min(this.clock.getDelta(), 0.05);
      this.time += delta;
      this._update(delta);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  _update(delta) {
    if (!this.params) return;
    const p = this.params;
    const t = this.time;

    // ── Camera drift ──────────────────────────────────────────────────────────
    const camAmp = p.cameraMotion * 3;
    this.camera.position.x = Math.sin(t * 0.17) * camAmp;
    this.camera.position.y = Math.cos(t * 0.13) * camAmp * 0.5;
    this.camera.lookAt(0, 0, 0);

    // ── Glitch camera shake ───────────────────────────────────────────────────
    if (p.glitchIntensity > 0.1 && Math.random() < p.glitchIntensity * 0.15) {
      this.camera.position.x += (Math.random() - 0.5) * p.glitchIntensity * 2;
      this.camera.position.y += (Math.random() - 0.5) * p.glitchIntensity * 2;
    }

    // ── Particles ─────────────────────────────────────────────────────────────
    if (this.particleMesh) {
      const pos = this.particleMesh.geometry.attributes.position;
      const vel = this.particleMesh.geometry._velocities;
      const count = pos.count;
      const ws = p.waveSpeed;
      const amp = p.waveAmplitude;
      const palette = p.colorPalette;

      // Swap color every cycle through the palette
      const colorIdx = Math.floor(t * ws * 0.3) % palette.length;
      this.particleMaterial.color.set(palette[colorIdx]);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Wave displacement
        const wave = Math.sin(x * 0.1 + t * ws) * amp
                   + Math.cos(z * 0.08 + t * ws * 0.7) * amp * 0.5;

        pos.setXYZ(
          i,
          x + vel[i3]     * ws * 60 * delta,
          y + vel[i3 + 1] * ws * 60 * delta + wave * delta * 0.3,
          z + vel[i3 + 2] * ws * 60 * delta
        );

        // Wrap boundaries
        if (Math.abs(pos.getX(i)) > 40) pos.setX(i, -pos.getX(i) * 0.95);
        if (Math.abs(pos.getY(i)) > 30) pos.setY(i, -pos.getY(i) * 0.95);
        if (Math.abs(pos.getZ(i)) > 20) pos.setZ(i, -pos.getZ(i) * 0.95);
      }
      pos.needsUpdate = true;

      this.particleMesh.rotation.y += p.rotationSpeed * delta;
      this.particleMesh.rotation.x += p.rotationSpeed * 0.3 * delta;
    }

    // ── Wave mesh deformation ─────────────────────────────────────────────────
    if (this.waveMesh) {
      const geo = this.waveMesh.geometry;
      const verts = geo.attributes.position;
      for (let i = 0; i < verts.count; i++) {
        const x = verts.getX(i);
        const z = verts.getZ(i); // original Z is 0; use initial Y offset
        const wave = Math.sin(x * 0.15 + t * p.waveSpeed)
                   * Math.cos(i * 0.08 + t * p.waveSpeed * 0.5)
                   * p.waveAmplitude * 2;
        verts.setZ(i, wave);
      }
      verts.needsUpdate = true;
      this.waveMesh.material.color.set(
        p.colorPalette[Math.floor(t * 0.5) % p.colorPalette.length]
      );
      this.waveMesh.material.opacity = 0.04 + p.lightIntensity * 0.06;
    }

    // ── Grid pulse (focus / geometric feel) ───────────────────────────────────
    if (this.gridMesh) {
      this.gridMesh.material.opacity = 0.02 + Math.sin(t * p.waveSpeed * 2) * 0.02 * p.lightIntensity;
    }

    // ── Exposure driven by light intensity ────────────────────────────────────
    this.renderer.toneMappingExposure = 0.6 + p.lightIntensity * 0.6;
  }
}
