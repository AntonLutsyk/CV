// <al-avatar-glb> — loads assets/anton.glb, auto-fits to feet on ground, slow 360° spin, drag to rotate, scroll nudges.
(function () {
  if (customElements.get('al-avatar-glb')) return;
  const V = '0.184.0', THREE_URL = `https://esm.sh/three@${V}`;
  const base = new URL('.', document.currentScript ? document.currentScript.src : location.href).href;
  const MODEL = new URL('assets/anton.glb', base).href;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  class AL extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      Object.assign(this.style, { display: 'block', position: 'relative', touchAction: 'pan-y', cursor: 'grab' });
      if (!this.style.width) this.style.width = '100%'; if (!this.style.height) this.style.height = '100%';
      const gen = this._gen = (this._gen || 0) + 1;
      (async () => {
        const T = await import(THREE_URL);
        const { GLTFLoader } = await import(`https://esm.sh/three@${V}/examples/jsm/loaders/GLTFLoader.js`);
        const { RoomEnvironment } = await import(`https://esm.sh/three@${V}/examples/jsm/environments/RoomEnvironment.js`);
        const gltf = await new GLTFLoader().loadAsync(MODEL);
        if (gen === this._gen && this.isConnected) this.setup(T, gltf, RoomEnvironment);
      })().catch((e) => console.warn('al-avatar-glb failed', e));
    }
    setup(T, gltf, RoomEnvironment) {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.outputColorSpace = T.SRGBColorSpace;
      r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
      r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
      r.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transform:translateY(24px) scale(.985);transform-origin:50% 100%;transition:opacity 1.2s cubic-bezier(.16,1,.3,1),transform 1.4s cubic-bezier(.16,1,.3,1)';
      this.appendChild(r.domElement);
      const scene = new T.Scene(), cam = new T.PerspectiveCamera(22, 1, 0.05, 100);
      const pm = new T.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.55;
      scene.add(new T.HemisphereLight(0xfff8f0, 0xd8d2c8, 0.7));
      const key = new T.DirectionalLight(0xffeedd, 1.7); key.position.set(0.9, 5.2, 2.2); key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 10; key.shadow.blurSamples = 20; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
      scene.add(key, key.target);

      // normalise model: height 1.78, feet at y=0, centred
      // clean scan texture: remove bright speckles on dark fabric (median of a 3px ring)
      const despeckle = (tex) => {
        const im = tex && tex.image; if (!im || !im.width) return tex;
        const W = im.width, H = im.height, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(im, 0, 0);
        const id = cx.getImageData(0, 0, W, H), d = id.data, src = new Uint8ClampedArray(d), Lm = new Float32Array(W * H);
        for (let i = 0; i < W * H; i++) Lm[i] = 0.3 * src[i * 4] + 0.59 * src[i * 4 + 1] + 0.11 * src[i * 4 + 2];
        const off = [], R0 = 3; for (let a = 0; a < 8; a++) off.push([Math.round(Math.cos(a * Math.PI / 4) * R0), Math.round(Math.sin(a * Math.PI / 4) * R0)]);
        const v = new Array(8), ix = new Array(8);
        for (let pass = 0; pass < 2; pass++) {
          for (let y = R0; y < H - R0; y++) for (let x = R0; x < W - R0; x++) {
            const i = y * W + x, c = Lm[i]; if (c < 45) continue;
            for (let k = 0; k < 8; k++) { const j = (y + off[k][1]) * W + x + off[k][0]; v[k] = Lm[j]; ix[k] = j; }
            const sorted = v.slice().sort((a, b) => a - b), med = (sorted[3] + sorted[4]) / 2;
            if (med < 95 && c > med + 28 && c > sorted[6] + 10) {
              let bj = ix[0], bd = 1e9; for (let k = 0; k < 8; k++) { const dd = Math.abs(v[k] - med); if (dd < bd) { bd = dd; bj = ix[k]; } }
              d[i * 4] = src[bj * 4]; d[i * 4 + 1] = src[bj * 4 + 1]; d[i * 4 + 2] = src[bj * 4 + 2]; Lm[i] = Lm[bj];
            }
          }
          src.set(d);
        }
        // slightly deeper, warmer skin tone (skin-hued pixels only, soft mask)
        for (let i = 0; i < W * H; i++) {
          const o = i * 4, rr = d[o], gg = d[o + 1], bb = d[o + 2], L = 0.3 * rr + 0.59 * gg + 0.11 * bb;
          if (L < 70 || rr <= gg || gg < bb) continue;
          const warm = (rr - bb) / (rr + 1), sat = (Math.max(rr, gg, bb) - Math.min(rr, gg, bb)) / (Math.max(rr, gg, bb) + 1);
          let w = Math.min(1, Math.max(0, (warm - 0.08) / 0.12)) * Math.min(1, Math.max(0, (0.6 - sat) / 0.15)) * Math.min(1, (L - 70) / 40);
          if (w <= 0) continue;
          d[o] = rr * (1 - 0.1 * w); d[o + 1] = gg * (1 - 0.16 * w); d[o + 2] = bb * (1 - 0.22 * w);
        }
        cx.putImageData(id, 0, 0);
        const nt = new T.CanvasTexture(cv); nt.flipY = tex.flipY; nt.colorSpace = tex.colorSpace; nt.wrapS = tex.wrapS; nt.wrapT = tex.wrapT; nt.channel = tex.channel;
        nt.anisotropy = r.capabilities.getMaxAnisotropy(); nt.needsUpdate = true; return nt;
      };
      const model = gltf.scene; model.traverse((o) => { if (!o.isMesh) return; o.castShadow = true; o.receiveShadow = true; const m = o.material; if (!m) return;
        m.side = T.FrontSide; if (m.map) m.map = despeckle(m.map);
        if ('roughness' in m) { m.roughness = Math.max(m.roughness ?? 1, 0.82); m.metalness = 0; m.roughnessMap = null; m.metalnessMap = null; m.envMapIntensity = 0.7; }
        m.needsUpdate = true; });
      let box = new T.Box3().setFromObject(model); const size = box.getSize(new T.Vector3());
      const sc = 1.78 / (size.y || 1); model.scale.setScalar(sc);
      box = new T.Box3().setFromObject(model); const c = box.getCenter(new T.Vector3());
      model.position.x -= c.x; model.position.z -= c.z; model.position.y -= box.min.y;
      const g = new T.Group(); g.add(model); scene.add(g);
      const H = 1.78;
      Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 0.1, far: 14 }); key.shadow.camera.updateProjectionMatrix();
      key.target.position.set(0, H / 2, 0);
      const ground = new T.Mesh(new T.PlaneGeometry(8, 8), new T.ShadowMaterial({ opacity: 0.07 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

      let lw = -1, lh = -1;
      const fit = () => {
        const W = this.clientWidth || 1, Hh = this.clientHeight || 1; lw = this.clientWidth; lh = this.clientHeight; r.setSize(W, Hh, false); cam.aspect = W / Hh;
        const fh = H * 1.04, dist = (fh / 2) / Math.tan(T.MathUtils.degToRad(cam.fov / 2)) / Math.min(1, cam.aspect / 0.42);
        cam.position.set(0, H * 0.52, dist); cam.lookAt(0, H * 0.5, 0); cam.updateProjectionMatrix();
      };
      fit(); this._ro = new ResizeObserver(fit); this._ro.observe(this);

      let rot = 0, vel = 0, drag = false, lx = 0, lastY = scrollY, t0 = performance.now();
      const BASE = reduced ? 0 : 0.28; // rad/s
      const down = (e) => { drag = true; lx = e.clientX; vel = 0; this.style.cursor = 'grabbing'; try { this.setPointerCapture(e.pointerId); } catch (_) {} };
      const move = (e) => { if (!drag) return; const dx = e.clientX - lx; lx = e.clientX; rot += dx * 0.01; vel = dx * 0.6; };
      const up = () => { drag = false; this.style.cursor = 'grab'; };
      this.addEventListener('pointerdown', down); this.addEventListener('pointermove', move); this.addEventListener('pointerup', up); this.addEventListener('pointercancel', up);
      const loop = (now) => {
        this._raf = requestAnimationFrame(loop);
        if (this.clientWidth !== lw || this.clientHeight !== lh) fit();
        const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
        const ds = scrollY - lastY; lastY = scrollY;
        if (!drag) { if (!reduced) vel += ds * 0.04; vel += (BASE - vel) * Math.min(1, dt * 1.6); rot += vel * dt; }
        g.rotation.y = rot;
        r.render(scene, cam);
      };
      r.render(scene, cam);
      requestAnimationFrame(() => requestAnimationFrame(() => { r.domElement.style.opacity = '1'; r.domElement.style.transform = 'none'; }));
      this._raf = requestAnimationFrame(loop); this._r = r; this._dbg = { T, cam, g, scene };
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf); if (this._ro) { this._ro.disconnect(); this._ro = null; }
      if (this._r) { this._r.dispose(); this._r.domElement.remove(); this._r = null; } this._init = false; this._gen = (this._gen || 0) + 1;
    }
  }
  customElements.define('al-avatar-glb', AL);
})();
