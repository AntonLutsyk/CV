// <al-avatar-photo> — photoreal 2.5D figure: cut-out photo displaced by an inflated depth map.
// Idle sway, drag to turn (springs back), scroll nudges, cursor tilt. Respects reduced motion.
(function () {
  if (customElements.get('al-avatar-photo')) return;
  const THREE_URL = 'https://unpkg.com/three@0.184.0/build/three.module.js';
  const base = new URL('.', document.currentScript ? document.currentScript.src : location.href).href;
  const IMG = 'assets/anton-figure.png?v=3', DEPTH = 'assets/anton-depth.png?v=3';
  const PX_W = 520, PX_H = 1472, FEET = 1447, HEAD = 19; // crop px; feet / hair-top rows
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = new URL(src, base).href; });

  class AL extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      Object.assign(this.style, { display: 'block', position: 'relative', touchAction: 'pan-y', cursor: 'grab' });
      if (!this.style.width) this.style.width = '100%'; if (!this.style.height) this.style.height = '100%';
      const gen = this._gen = (this._gen || 0) + 1;
      Promise.all([import(THREE_URL), load(IMG), load(DEPTH)]).then(([T, img, dimg]) => { if (gen === this._gen && this.isConnected) this.setup(T, img, dimg); })
        .catch((e) => console.warn('al-avatar-photo failed', e));
    }
    setup(T, img, dimg) {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.outputColorSpace = T.SRGBColorSpace;
      r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
      r.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(r.domElement);
      const scene = new T.Scene(), cam = new T.PerspectiveCamera(22, 1, 0.05, 50);

      // world scale: figure height 1.78m
      const figPx = FEET - HEAD, s = 1.78 / figPx, w = PX_W * s, h = PX_H * s, feetY = (PX_H - FEET) * s;
      // depth samples
      const dc = document.createElement('canvas'); dc.width = dimg.width; dc.height = dimg.height;
      const dx = dc.getContext('2d'); dx.drawImage(dimg, 0, 0); const dd = dx.getImageData(0, 0, dc.width, dc.height).data;
      const depthAt = (u, v) => {
        const fx = clamp(u * (dc.width - 1), 0, dc.width - 1), fy = clamp((1 - v) * (dc.height - 1), 0, dc.height - 1);
        const x0 = fx | 0, y0 = fy | 0, x1 = Math.min(dc.width - 1, x0 + 1), y1 = Math.min(dc.height - 1, y0 + 1), tx = fx - x0, ty = fy - y0;
        const g = (x, y) => dd[(y * dc.width + x) * 4] / 255;
        return (g(x0, y0) * (1 - tx) + g(x1, y0) * tx) * (1 - ty) + (g(x0, y1) * (1 - tx) + g(x1, y1) * tx) * ty;
      };
      const SX = 180, SY = 500, geo = new T.PlaneGeometry(w, h, SX, SY), p = geo.attributes.position, uv = geo.attributes.uv;
      const DEPTH_M = 0.12; // max front bulge (m)
      for (let i = 0; i < p.count; i++) {
        const z = depthAt(uv.getX(i), uv.getY(i));
        p.setZ(i, Math.pow(z, 1.15) * DEPTH_M);
      }
      geo.translate(0, h / 2 - feetY, 0); geo.computeVertexNormals();
      const tex = new T.Texture(img); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = r.capabilities.getMaxAnisotropy(); tex.needsUpdate = true;
      const mat = new T.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, side: T.FrontSide });
      const fig = new T.Mesh(geo, mat);
      fig.customDepthMaterial = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking, map: tex, alphaTest: 0.5 });
      // back: flat dark silhouette so edge-on views never show a hole
      const back = new T.Mesh(new T.PlaneGeometry(w, h).translate(0, h / 2 - feetY, -0.002), new T.MeshBasicMaterial({ map: tex, color: 0x2a2a2a, alphaTest: 0.5, side: T.BackSide }));
      const g = new T.Group(); g.add(fig, back); scene.add(g);

      const key = new T.DirectionalLight(0xffffff, 1); key.position.set(-1.6, 3.2, 1.6); key.castShadow = true;
      Object.assign(key.shadow.camera, { left: -1.2, right: 1.2, top: 2.2, bottom: -0.4, near: 0.5, far: 8 }); key.shadow.camera.updateProjectionMatrix();
      key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 10; key.shadow.blurSamples = 16; key.shadow.bias = -0.0004;
      key.target.position.set(0, 0.6, 0); scene.add(key, key.target);
      
      const bc = document.createElement('canvas'); bc.width = bc.height = 128; const bx = bc.getContext('2d'), gr = bx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(17,17,17,0.5)'); gr.addColorStop(0.45, 'rgba(17,17,17,0.16)'); gr.addColorStop(1, 'rgba(17,17,17,0)'); bx.fillStyle = gr; bx.fillRect(0, 0, 128, 128);
      const blob = new T.Mesh(new T.PlaneGeometry(0.7, 0.22), new T.MeshBasicMaterial({ map: new T.CanvasTexture(bc), transparent: true, depthWrite: false, opacity: 0.62 }));
      blob.rotation.x = -Math.PI / 2; blob.position.set(0, 0.001, 0.03); scene.add(blob);

      const fit = () => {
        const W = this.clientWidth || 1, H = this.clientHeight || 1; r.setSize(W, H, false); cam.aspect = W / H;
        const fh = 1.84, dist = (fh / 2) / Math.tan(T.MathUtils.degToRad(cam.fov / 2)) / Math.min(1, cam.aspect / 0.42);
        cam.position.set(0, 0.92, dist); cam.lookAt(0, 0.89, 0); cam.updateProjectionMatrix();
      };
      fit(); this._ro = new ResizeObserver(fit); this._ro.observe(this);

      let yaw = 0, drag = false, lx = 0, dragYaw = 0, mx = 0, my = 0, lastY = scrollY, scrollKick = 0, t0 = performance.now(), tAcc = 0;
      const down = (e) => { drag = true; lx = e.clientX; this.style.cursor = 'grabbing'; try { this.setPointerCapture(e.pointerId); } catch (_) {} };
      const move = (e) => { if (drag) { dragYaw = clamp(dragYaw + (e.clientX - lx) * 0.005, -0.5, 0.5); lx = e.clientX; } };
      const up = () => { drag = false; this.style.cursor = 'grab'; };
      this.addEventListener('pointerdown', down); this.addEventListener('pointermove', move); this.addEventListener('pointerup', up); this.addEventListener('pointercancel', up);
      this._gm = (e) => { const b = this.getBoundingClientRect(); mx = clamp((e.clientX - (b.left + b.width / 2)) / (innerWidth / 2), -1, 1); my = clamp((e.clientY - (b.top + b.height / 2)) / (innerHeight / 2), -1, 1); };
      addEventListener('mousemove', this._gm, { passive: true });
      this._dbg = { T, cam, g };
      const dbg = this._dbg;
      const loop = (now) => {
        this._raf = requestAnimationFrame(loop);
        const dt = Math.min(48, now - t0) / 1000; t0 = now; tAcc += reduced ? 0 : dt;
        const ds = scrollY - lastY; lastY = scrollY; if (!reduced) scrollKick = clamp(scrollKick + ds * 0.001, -0.25, 0.25);
        scrollKick *= Math.pow(0.04, dt);
        if (!drag) dragYaw *= Math.pow(0.12, dt);
        const idle = reduced ? 0 : Math.sin(tAcc * 0.4) * 0.24;
        const target = idle + dragYaw + scrollKick + (reduced ? 0 : mx * 0.18);
        yaw += (target - yaw) * Math.min(1, dt * 4);
        g.rotation.y = dbg.rot != null ? dbg.rot : yaw;
        g.rotation.x = reduced ? 0 : my * -0.025;
        r.render(scene, cam);
      };
      fit(); r.render(scene, cam);
      this._raf = requestAnimationFrame(loop); this._r = r;
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf); if (this._ro) this._ro.disconnect(); removeEventListener('mousemove', this._gm);
      if (this._r) { this._r.dispose(); this._r.domElement.remove(); this._r = null; } this._init = false; this._gen = (this._gen || 0) + 1;
    }
  }
  customElements.define('al-avatar-photo', AL);
})();
