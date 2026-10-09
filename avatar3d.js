// <al-avatar> — bespoke stylised-realism figure of Anton. Procedural sculpt (no external model).
// Slow auto-spin, drag to rotate, scroll nudges spin, head + eyes follow the cursor.
(function () {
  if (customElements.get('al-avatar')) return;
  const THREE_URL = 'https://unpkg.com/three@0.184.0/build/three.module.js';
  let T, V;
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pw = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const hash = (x, y, z) => { const s = Math.sin(x * 12989.8 + y * 78233 + z * 37719) * 43758.5453; return s - Math.floor(s); };
  const spline = (xs, ys) => (x) => {
    const n = xs.length; if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const t = (x - xs[i]) / (xs[i + 1] - xs[i]), p0 = ys[Math.max(0, i - 1)], p1 = ys[i], p2 = ys[i + 1], p3 = ys[Math.min(n - 1, i + 2)];
    return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  };
  const lin = (xs, ys) => (x) => {
    const n = xs.length; if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++; return lerp(ys[i], ys[i + 1], (x - xs[i]) / (xs[i + 1] - xs[i]));
  };
  const col = (h) => new T.Color(h);

  // ---------- geometry helpers ----------
  function grid(nu, nv, fn, flip) {
    const n = nu * (nv + 1), pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), c = new Float32Array(n * 3), idx = [];
    let k = 0;
    for (let j = 0; j <= nv; j++) for (let i = 0; i < nu; i++) {
      const r = fn(i / nu, j / nv); pos[k * 3] = r[0]; pos[k * 3 + 1] = r[1]; pos[k * 3 + 2] = r[2];
      uv[k * 2] = i / nu; uv[k * 2 + 1] = j / nv; const cc = r[3] || [1, 1, 1]; c[k * 3] = cc[0]; c[k * 3 + 1] = cc[1]; c[k * 3 + 2] = cc[2]; k++;
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const i1 = (i + 1) % nu, a = j * nu + i, b = j * nu + i1, cI = (j + 1) * nu + i, d = (j + 1) * nu + i1;
      if (flip) idx.push(a, b, cI, b, d, cI); else idx.push(a, cI, b, b, cI, d);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('uv', new T.BufferAttribute(uv, 2)); g.setAttribute('color', new T.BufferAttribute(c, 3));
    g.setIndex(idx); g.computeVertexNormals(); return fixSeams(g);
  }
  function fixSeams(g) {
    const p = g.attributes.position, n = g.attributes.normal, map = new Map();
    for (let i = 0; i < p.count; i++) {
      const key = Math.round(p.getX(i) * 2e5) + '|' + Math.round(p.getY(i) * 2e5) + '|' + Math.round(p.getZ(i) * 2e5);
      let e = map.get(key); if (!e) map.set(key, e = { x: 0, y: 0, z: 0, ids: [] });
      e.x += n.getX(i); e.y += n.getY(i); e.z += n.getZ(i); e.ids.push(i);
    }
    map.forEach((e) => { if (e.ids.length < 2) return; const l = Math.hypot(e.x, e.y, e.z) || 1; e.ids.forEach((i) => n.setXYZ(i, e.x / l, e.y / l, e.z / l)); });
    return g;
  }
  // capsule-like limb hanging along -y from origin; rFn(t) radius, t 0=top 1=bottom
  function limb(len, rFn, ex, nu, nv, colFn) {
    ex = ex || (() => [1, 1]); const c0 = rFn(0), c1 = rFn(1), tot = len + c0 + c1;
    return grid(nu || 28, nv || 36, (u, v) => {
      const s = (1 - v) * tot - c0; let r, t;
      if (s < 0) { t = 0; r = c0 * Math.sqrt(Math.max(0, 1 - (s / c0) ** 2)); }
      else if (s > len) { t = 1; r = c1 * Math.sqrt(Math.max(0, 1 - ((s - len) / c1) ** 2)); }
      else { t = s / len; r = rFn(t); }
      const e = ex(t), a = 2 * Math.PI * u - Math.PI / 2;
      return [Math.cos(a) * r * e[0], -s, Math.sin(a) * r * e[1], colFn ? colFn(t, a) : null];
    });
  }
  function blob(sx, sy, sz, e, wu, wv, deform) {
    const g = new T.SphereGeometry(1, wu || 32, wv || 24), p = g.attributes.position, k = 2 / e;
    for (let i = 0; i < p.count; i++) {
      let x = pw(p.getX(i), k) * sx, y = pw(p.getY(i), k) * sy, z = pw(p.getZ(i), k) * sz;
      if (deform) { const r = deform(x, y, z); x = r[0]; y = r[1]; z = r[2]; }
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals(); return fixSeams(g);
  }
  function mesh(geo, mat, c, parent, x, y, z) { const m = new T.Mesh(geo, mat); if (c != null) m.userData.col = c; m.position.set(x || 0, y || 0, z || 0); if (parent) parent.add(m); return m; }
  function mergeByMaterial(root) {
    root.updateMatrixWorld(true);
    const inv = new T.Matrix4().copy(root.matrixWorld).invert(), buckets = new Map(), out = new T.Group(), v = new V();
    root.traverse((o) => { if (o.isMesh && !o.isInstancedMesh) { if (!buckets.has(o.material)) buckets.set(o.material, []); buckets.get(o.material).push(o); } });
    buckets.forEach((list, mat) => {
      let vc = 0, ic = 0;
      list.forEach((o) => { vc += o.geometry.attributes.position.count; ic += o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count; });
      const P = new Float32Array(vc * 3), N = new Float32Array(vc * 3), U = new Float32Array(vc * 2), C = new Float32Array(vc * 3), I = new Uint32Array(ic);
      let off = 0, io = 0;
      list.forEach((o) => {
        const g = o.geometry, m = new T.Matrix4().multiplyMatrices(inv, o.matrixWorld), nm = new T.Matrix3().getNormalMatrix(m), flip = m.determinant() < 0;
        const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv, cA = g.attributes.color, tint = o.userData.col != null ? col(o.userData.col) : new T.Color(1, 1, 1);
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i).applyMatrix4(m); P.set([v.x, v.y, v.z], (off + i) * 3);
          v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); N.set([v.x, v.y, v.z], (off + i) * 3);
          U[(off + i) * 2] = uv ? uv.getX(i) : 0; U[(off + i) * 2 + 1] = uv ? uv.getY(i) : 0;
          C[(off + i) * 3] = (cA ? cA.getX(i) : 1) * tint.r; C[(off + i) * 3 + 1] = (cA ? cA.getY(i) : 1) * tint.g; C[(off + i) * 3 + 2] = (cA ? cA.getZ(i) : 1) * tint.b;
        }
        const ix = g.index ? g.index.array : null, cnt = ix ? ix.length : p.count;
        for (let i = 0; i < cnt; i += 3) {
          const a = ix ? ix[i] : i, b = ix ? ix[i + 1] : i + 1, c = ix ? ix[i + 2] : i + 2;
          I[io++] = a + off; I[io++] = (flip ? c : b) + off; I[io++] = (flip ? b : c) + off;
        }
        off += p.count;
      });
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(P, 3)); g.setAttribute('normal', new T.BufferAttribute(N, 3));
      g.setAttribute('uv', new T.BufferAttribute(U, 2)); g.setAttribute('color', new T.BufferAttribute(C, 3)); g.setIndex(new T.BufferAttribute(I, 1));
      const mm = new T.Mesh(g, mat); mm.name = mat.name; mm.castShadow = true; mm.receiveShadow = !mat.userData.noRecv; out.add(mm);
    });
    return out;
  }
  function canvasTex(w, h, f, srgb) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const ctx = cv.getContext('2d'), im = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = f(x, y), i = (y * w + x) * 4; im.data[i] = c[0]; im.data[i + 1] = c[1]; im.data[i + 2] = c[2]; im.data[i + 3] = c[3] == null ? 255 : c[3]; }
    ctx.putImageData(im, 0, 0); const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
  }

  // ---------- head sculpt ----------
  const HX = 0.0705, HY = 0.122, HZ = 0.098;
  const B = [];
  const bump = (cx, cy, cz, sx, sy, sz, a, mirror) => { B.push([cx, cy, cz, sx, sy, sz, a]); if (mirror) B.push([-cx, cy, cz, sx, sy, sz, a]); };
  bump(0, 0.004, 0.098, 0.0085, 0.02, 0.03, 0.006);       // nasal bridge
  bump(0, -0.018, 0.1, 0.0078, 0.014, 0.03, 0.013);       // nose mid
  bump(0, -0.034, 0.1, 0.0088, 0.0088, 0.03, 0.018);       // nose tip
  bump(0.0108, -0.038, 0.09, 0.0062, 0.0062, 0.03, 0.0068, 1); // alae
  bump(0, -0.05, 0.096, 0.012, 0.0055, 0.03, -0.0022);    // under nose
  bump(0.0315, 0.002, 0.09, 0.0155, 0.0105, 0.03, -0.009, 1); // eye sockets
  bump(0.03, 0.022, 0.09, 0.02, 0.0075, 0.03, 0.0045, 1); // brow ridge
  bump(0, 0.018, 0.098, 0.01, 0.01, 0.03, 0.0025);        // glabella
  bump(0.05, -0.024, 0.07, 0.016, 0.012, 0.03, 0.004, 1); // cheekbones
  bump(0.05, -0.062, 0.06, 0.014, 0.016, 0.03, -0.0012, 1); // cheek hollows
  bump(0.021, -0.054, 0.082, 0.004, 0.012, 0.03, -0.0007, 1); // nasolabial
  bump(0, -0.0648, 0.092, 0.014, 0.0044, 0.03, 0.0058);   // upper lip
  bump(0, -0.0585, 0.096, 0.0042, 0.0045, 0.03, -0.0012); // philtrum
  bump(0, -0.0772, 0.088, 0.013, 0.0048, 0.03, 0.0064);   // lower lip
  bump(0, -0.0712, 0.094, 0.011, 0.0014, 0.03, -0.0022);   // mouth line
  bump(0.017, -0.0688, 0.09, 0.007, 0.0016, 0.03, -0.0022, 1); // smile corners
  bump(0.028, -0.062, 0.082, 0.01, 0.011, 0.03, 0.0038, 1); // smile cheeks
  bump(0.0255, -0.0672, 0.084, 0.0032, 0.004, 0.03, -0.0014, 1); // corner dimples
  bump(0.042, -0.036, 0.074, 0.016, 0.013, 0.03, 0.0032, 1); // raised cheeks
  bump(0, -0.089, 0.086, 0.014, 0.004, 0.03, -0.0018);    // mentolabial
  bump(0, -0.104, 0.078, 0.021, 0.012, 0.03, 0.011);      // chin
  bump(0.058, -0.086, 0.0, 0.014, 0.016, 0.03, 0.0085, 1); // jaw angles
  bump(0.07, 0.032, 0.045, 0.02, 0.02, 0.03, -0.003, 1);  // temples
  function headF(d, out) {
    const x = d.x, y = d.y, z = d.z;
    const w = y >= 0 ? 1 - 0.07 * y * y : 1 - 0.02 * -y - 0.13 * ss(0.6, 1, -y);
    let px = x * HX * w, py = y * HY * (y < 0 ? 1.05 : 1), pz = z * HZ;
    if (z < 0) { pz *= 1.06 + 0.05 * Math.max(0, y); if (y < 0) pz *= 1 - 0.5 * ss(0.15, 0.85, -y); }
    else { if (y < 0) pz *= 1 + 0.22 * ss(0.3, 0.9, -y); if (y > 0.3) pz *= 1 - 0.07 * ss(0.3, 1, y); }
    let disp = 0;
    for (let i = 0; i < B.length; i++) { const b = B[i], dx = (px - b[0]) / b[3], dy = (py - b[1]) / b[4], dz = (pz - b[2]) / b[5], e = dx * dx + dy * dy + dz * dz; if (e < 9) disp += b[6] * Math.exp(-e); }
    const L = Math.hypot(px, py, pz) || 1; return out.set(px + px / L * disp, py + py / L * disp, pz + pz / L * disp);
  }
  function headN(d, out) {
    const ref = Math.abs(d.y) < 0.9 ? new V(0, 1, 0) : new V(1, 0, 0), t1 = new V().crossVectors(d, ref).normalize(), t2 = new V().crossVectors(d, t1), e = 0.003;
    const a = headF(d.clone().addScaledVector(t1, e).normalize(), new V()).sub(headF(d.clone().addScaledVector(t1, -e).normalize(), new V()));
    const b = headF(d.clone().addScaledVector(t2, e).normalize(), new V()).sub(headF(d.clone().addScaledVector(t2, -e).normalize(), new V()));
    out.crossVectors(a, b).normalize(); if (out.dot(headF(d, new V())) < 0) out.negate(); return out;
  }
  function surfAt(x, y) {
    const d = new V(x / HX, y / HY, 0), p = new V();
    d.z = Math.sqrt(Math.max(1e-4, 1 - d.x * d.x - d.y * d.y));
    for (let i = 0; i < 10; i++) { headF(d, p); d.x += (x - p.x) / HX * 0.9; d.y += (y - p.y) / HY * 0.9; d.z = Math.sqrt(Math.max(1e-4, 1 - d.x * d.x - d.y * d.y)); }
    headF(d, p); return { p, n: headN(d, new V()), d };
  }
  // hair regions
  const hairY = lin([0, 0.5, 0.85, 1.15, 1.35, 1.5, 1.75, 2.1, 2.6, 3.15], [0.064, 0.06, 0.044, 0.026, -0.008, 0.0, 0.022, -0.03, -0.07, -0.09]);
  const hm = (p) => ss(-0.002, 0.009, p.y - hairY(Math.abs(Math.atan2(p.x, p.z))));
  const tf = (p) => ss(0.066, 0.044, Math.abs(p.x)) * ss(0.018, 0.05, p.y);
  const Tshell = (p) => { const h = hm(p), ramp = ss(0, 0.02, p.y - hairY(Math.abs(Math.atan2(p.x, p.z)))); return h * (0.0012 + tf(p) * ramp * (0.007 + 0.011 * ss(-0.07, 0.075, p.z))) - 0.003 * (1 - h); };
  function shellPos(d, extra, out) {
    const p = headF(d, new V()), n = headN(d, new V()), t = tf(p), dir = new V(n.x, n.y + 0.5 * t, n.z).normalize();
    return out.copy(p).addScaledVector(dir, Tshell(p) + extra);
  }

  function buildHead(mats, C) {
    const raw = new T.Group(), hairRaw = new T.Group(), keep = [];
    const g = new T.SphereGeometry(1, 168, 128), p = g.attributes.position, cols = new Float32Array(p.count * 3), dirs = [], d = new V(), q = new V();
    const skin = col(C.skin), lip = col(C.lip), cheek = col(C.cheek), stub = col(C.stubble), sock = col(C.socket), nost = col(0x5c2f27), browBase = col(0xb38d70), hairSide = col(C.hairSide);
    const G = (q, cx, cy, sx, sy) => Math.exp(-(((q.x - cx) / sx) ** 2 + ((q.y - cy) / sy) ** 2));
    for (let i = 0; i < p.count; i++) {
      d.fromBufferAttribute(p, i).normalize(); dirs.push(d.clone()); headF(d, q); p.setXYZ(i, q.x, q.y, q.z);
      const c = skin.clone(), front = ss(-0.01, 0.04, q.z), ax = Math.abs(q.x), aq = { x: ax, y: q.y };
      c.lerp(cheek, 0.35 * G(aq, 0.048, -0.03, 0.018, 0.016) * front);
      const lm = Math.max(G(q, 0, -0.0645, 0.0175, 0.0042), G(q, 0, -0.078, 0.0145, 0.0048)) * front;
      c.lerp(lip, ss(0.3, 0.8, lm) * 0.85);
      const st = ss(-0.046, -0.06, q.y) * ss(-0.035, 0.0, q.z) * (1 - ss(0.2, 0.6, lm)) * ss(0.078, 0.06, ax);
      const mo = G(aq, 0.006, -0.055, 0.02, 0.005) * front * (1 - ss(0.2, 0.6, lm));
      c.lerp(stub, Math.min(1, (st * 0.26 + mo * 0.18)) * (0.85 + 0.3 * hash(q.x, q.y, q.z)));
      c.lerp(sock, 0.35 * G(aq, 0.031, 0.006, 0.017, 0.012) * front);
      c.lerp(nost, 0.8 * G(aq, 0.0098, -0.0445, 0.0034, 0.0022) * front);
      c.lerp(browBase, 0.35 * G(aq, 0.032, 0.026, 0.02, 0.004) * front);
      c.lerp(hairSide, 0.5 * hm(q));
      c.multiplyScalar(1 - 0.2 * ss(-0.1, -0.12, q.y) * ss(0.05, -0.02, q.z));
      cols.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new T.BufferAttribute(cols, 3)); g.computeVertexNormals(); fixSeams(g);
    mesh(g, mats.skin, null, raw);

    // hair shell (faded sides + volume under locks)
    const sg = g.clone(), sp = sg.attributes.position, sc = sg.attributes.color, hmv = new Float32Array(sp.count), topC = col(C.hairBase), w = new V();
    for (let i = 0; i < sp.count; i++) {
      headF(dirs[i], q); hmv[i] = hm(q); const t = tf(q); shellPos(dirs[i], 0, w); sp.setXYZ(i, w.x, w.y, w.z);
      const fade = ss(hairY(Math.abs(Math.atan2(q.x, q.z))), hairY(Math.abs(Math.atan2(q.x, q.z))) + 0.04, q.y);
      const c = skin.clone().lerp(hairSide, 0.45 + 0.5 * fade).lerp(topC, ss(0.1, 0.6, t)).multiplyScalar(0.85 + 0.3 * hash(q.z, q.x, q.y));
      sc.setXYZ(i, c.r, c.g, c.b);
    }
    const si = sg.index.array, ni = [];
    for (let i = 0; i < si.length; i += 3) if (Math.max(hmv[si[i]], hmv[si[i + 1]], hmv[si[i + 2]]) > 0.0005) ni.push(si[i], si[i + 1], si[i + 2]);
    sg.setIndex(ni); sg.computeVertexNormals(); fixSeams(sg);
    const shell = new T.Mesh(sg, mats.hairShell); shell.castShadow = true; shell.receiveShadow = true; keep.push(shell);

    // sculpted locks
    const roots = []; let tries = 0;
    while (roots.length < 480 && tries < 80000) {
      tries++; const dd = new V(rnd() * 2 - 1, rnd(), rnd() * 2 - 1); const l2 = dd.lengthSq(); if (l2 > 1 || l2 < 0.02) continue; dd.normalize();
      headF(dd, q); if (hm(q) < 0.7 || tf(q) < 0.3) continue; if (rnd() > 0.4 + 0.6 * ss(-0.08, 0.08, q.z)) continue; roots.push(dd);
    }
    const LP = [], LC = [], LU = [], LI = []; const RAD = 7, STEPS = 12;
    const cRoot = col(C.hairRoot), cMid = col(C.hairMid), cTip = col(C.hairTip);
    roots.forEach((d0) => {
      headF(d0, q); const zf = ss(-0.08, 0.085, q.z);
      const L = lerp(0.03, 0.05, zf) * (0.75 + 0.5 * rnd()), sweep = -0.1 + (rnd() - 0.5) * 0.5, w0 = 0.0036 + rnd() * 0.0026, lift = 0.0015 + rnd() * 0.0045 * (0.5 + zf);
      const bright = 0.85 + rnd() * 0.32, curl = (rnd() - 0.5) * 0.5, pts = [], dd = d0.clone();
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS; pts.push(shellPos(dd, -0.0025 + lift * Math.sin(Math.PI * Math.min(1, t * 1.15)) + 0.0015 * t, new V()));
        const gdir = new V(sweep + curl * Math.sin(t * 3), 0, -1); gdir.addScaledVector(dd, -dd.dot(gdir)).normalize();
        dd.addScaledVector(gdir, (L / STEPS) / 0.11).normalize();
      }
      const base = LP.length / 3;
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS, P = pts[i], tan = pts[Math.min(STEPS, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize();
        const rad = P.clone().normalize(), side = new V().crossVectors(tan, rad).normalize(), up = new V().crossVectors(side, tan).normalize();
        const wd = w0 * (1 - 0.95 * Math.pow(t, 1.2)) + 0.0002;
        const cc = t < 0.45 ? cRoot.clone().lerp(cMid, ss(0, 0.45, t)) : cMid.clone().lerp(cTip, ss(0.45, 1, t));
        for (let j = 0; j < RAD; j++) {
          const th = (j / RAD) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th);
          LP.push(P.x + side.x * cs * wd + up.x * sn * wd * 0.6, P.y + side.y * cs * wd + up.y * sn * wd * 0.6, P.z + side.z * cs * wd + up.z * sn * wd * 0.6);
          const sh = bright * (0.72 + 0.28 * (0.5 + 0.5 * sn)); LC.push(cc.r * sh, cc.g * sh, cc.b * sh); LU.push(t, j / RAD);
        }
      }
      for (let i = 0; i < STEPS; i++) for (let j = 0; j < RAD; j++) {
        const a = base + i * RAD + j, b = base + i * RAD + (j + 1) % RAD, c = a + RAD, e = b + RAD; LI.push(a, c, b, b, c, e);
      }
    });
    const lg = new T.BufferGeometry(); lg.setAttribute('position', new T.Float32BufferAttribute(LP, 3)); lg.setAttribute('color', new T.Float32BufferAttribute(LC, 3));
    lg.setAttribute('uv', new T.Float32BufferAttribute(LU, 2)); lg.setIndex(LI); lg.computeVertexNormals();
    const locks = new T.Mesh(lg, mats.hair); locks.castShadow = true; locks.receiveShadow = true; keep.push(locks);

    // brows (instanced hairs)
    const bc = 2 * 120, bm = new T.InstancedMesh(new T.ConeGeometry(0.00055, 1, 4, 1).translate(0, 0.5, 0), mats.brow, bc); let bi = 0;
    const mtx = new T.Matrix4(), qu = new T.Quaternion(), Y = new V(0, 1, 0);
    [-1, 1].forEach((s) => { for (let k = 0; k < 120; k++) {
      const u = rnd(), band = lerp(0.0034, 0.0014, u), x = lerp(0.011, 0.051, u), y = 0.021 + 0.0072 * Math.sin(Math.PI * Math.pow(u, 0.75)) - 0.003 * u + (rnd() * 2 - 1) * band;
      const sa = surfAt(x, y), a = lerp(1.25, 0.22, ss(0, 0.4, u)) + (rnd() - 0.5) * 0.3, dir = new V(Math.cos(a), Math.sin(a), 0);
      dir.addScaledVector(sa.n, -sa.n.dot(dir)).normalize().addScaledVector(sa.n, 0.12).normalize();
      const pos = sa.p.clone().addScaledVector(sa.n, 0.0002); pos.x *= s; dir.x *= s;
      qu.setFromUnitVectors(Y, dir); mtx.compose(pos, qu, new V(1, 0.0055 + rnd() * 0.0035, 1)); bm.setMatrixAt(bi++, mtx);
    } });
    keep.push(bm);

    // eyes
    const eyes = [];
    [-1, 1].forEach((s) => {
      const ex = 0.0315, sa = surfAt(ex, 0.002), c = new V(s * ex, 0.002, sa.p.z - 0.0034), r = 0.0118, rl = 0.0126;
      const eg = new T.Group(); eg.position.copy(c); eg.rotation.y = s * 0.07; raw.add(eg);
      const up = new T.Group(); up.rotation.x = -0.36; eg.add(up);
      mesh(new T.SphereGeometry(rl, 40, 16, 0, Math.PI, 0, Math.PI / 2), mats.skin, C.lid, up);
      const rimU = mesh(new T.TorusGeometry(rl, 0.00095, 6, 40, Math.PI), mats.skin, 0x3a2b23, up); rimU.rotation.x = Math.PI / 2;
      const lo = new T.Group(); lo.rotation.x = 0.2; eg.add(lo);
      mesh(new T.SphereGeometry(rl, 40, 16, 0, Math.PI, Math.PI / 2, Math.PI / 2), mats.skin, C.lid, lo);
      const rimL = mesh(new T.TorusGeometry(rl, 0.0008, 6, 40, Math.PI), mats.skin, 0xc98d7d, lo); rimL.rotation.x = Math.PI / 2;
      const eb = new T.Mesh(new T.SphereGeometry(r, 48, 32).rotateX(Math.PI / 2), mats.eye); eb.position.copy(c); eb.rotation.y = s * 0.07; keep.push(eb); eyes.push(eb);
    });
    // mouth line
    const mp = []; for (let i = 0; i <= 8; i++) { const x = lerp(-0.0235, 0.0235, i / 8), y = -0.0714 + 0.0048 * Math.pow(Math.abs(x) / 0.0235, 2.0); mp.push(new V(x, y, surfAt(x, y).p.z - 0.0003)); }
    mesh(new T.TubeGeometry(new T.CatmullRomCurve3(mp), 32, 0.00046, 5), mats.skin, 0x8f564c, raw);
    // ears
    [-1, 1].forEach((s) => {
      const side = new T.Group(); side.scale.x = s; raw.add(side);
      const eg = new T.Group(); eg.position.set(0.0685, -0.011, -0.006); eg.rotation.set(-0.15, -0.32, 0); side.add(eg);
      const P = [[0, 0.02], [-0.008, 0.028], [-0.02, 0.03], [-0.03, 0.022], [-0.034, 0.008], [-0.031, -0.008], [-0.024, -0.02], [-0.017, -0.03], [-0.008, -0.035], [0, -0.03], [0.004, -0.018], [0.003, 0]];
      const sh = new T.Shape(); sh.moveTo(-P[0][0], P[0][1]); sh.splineThru(P.slice(1).concat([P[0]]).map((v) => new T.Vector2(-v[0], v[1])));
      const pg = new T.ExtrudeGeometry(sh, { depth: 0.003, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.0025, bevelSegments: 3, curveSegments: 28 }); pg.rotateY(Math.PI / 2);
      mesh(pg, mats.skin, C.ear, eg);
      mesh(new T.TubeGeometry(new T.CatmullRomCurve3(P.slice(0, 9).map((v) => new V(0.0058, v[1] * 0.97, v[0] * 0.97))), 48, 0.0031, 8), mats.skin, C.skin, eg);
      mesh(new T.TubeGeometry(new T.CatmullRomCurve3([[-0.006, 0.019], [-0.016, 0.02], [-0.022, 0.011], [-0.021, -0.004], [-0.014, -0.014]].map((v) => new V(0.0048, v[1], v[0]))), 32, 0.0021, 6), mats.skin, C.skin, eg);
      mesh(new T.SphereGeometry(0.0042, 16, 12), mats.skin, C.skin, eg, 0.003, -0.004, 0.003);
      mesh(new T.SphereGeometry(0.0075, 16, 12).scale(0.55, 1, 1), mats.skin, 0xc9877a, eg, 0.0022, -0.006, -0.012);
    });
    const out = mergeByMaterial(raw); keep.forEach((k) => out.add(k));
    return { group: out, eyes };
  }

  // ---------- body ----------
  function buildBody(mats, C) {
    const raw = new T.Group();
    // neck
    mesh(grid(48, 24, (u, v) => {
      const y = lerp(1.38, 1.6, v), a = 2 * Math.PI * u - Math.PI / 2, r = spline([1.38, 1.45, 1.52, 1.6], [0.062, 0.055, 0.053, 0.053])(y);
      const tr = 0.0028 * Math.exp(-((a - Math.PI / 2) ** 2) / 0.08) * ss(1.44, 1.5, y) * ss(1.58, 1.52, y);
      const scm = 0.002 * Math.exp(-((Math.abs(Math.cos(a)) - 0.7) ** 2) / 0.02) * ss(1.42, 1.55, y) * (Math.sin(a) > 0 ? 1 : 0);
      const ao = 1 - 0.25 * ss(1.44, 1.38, y) - 0.15 * ss(1.55, 1.6, y) * (Math.sin(a) > 0 ? 1 : 0);
      return [Math.cos(a) * (r + tr + scm), y, Math.sin(a) * (r + tr + scm) * 0.93 + lerp(-0.005, -0.012, v) + (y - 1.38) * 0.12, [ao, ao, ao]];
    }), mats.skin, C.skin, raw);
    // tee
    const tY = [0.88, 0.95, 1.05, 1.15, 1.25, 1.33, 1.38, 1.405, 1.43, 1.45, 1.465];
    const tW = spline(tY, [0.17, 0.168, 0.164, 0.166, 0.174, 0.18, 0.184, 0.174, 0.144, 0.106, 0.075]);
    const tD = spline(tY, [0.112, 0.108, 0.102, 0.108, 0.118, 0.116, 0.108, 0.1, 0.088, 0.075, 0.062]);
    const tZ = spline(tY, [0, 0, 0.002, 0.006, 0.01, 0.006, 0, -0.004, -0.008, -0.01, -0.008]);
    const tee = mesh(grid(120, 80, (u, v) => {
      const y = lerp(0.872, 1.465, v), a = 2 * Math.PI * u - Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), side = ss(0.72, 0.97, Math.abs(ca));
      let x = tW(y) * pw(ca, 0.77), z = tD(y) * pw(sa, 0.77), f = 0;
      f += 0.0012 * ss(1.06, 0.92, y) * Math.sin(a * 6 + y * 24 + Math.sin(a * 3) * 1.5);
      f += 0.0012 * side * ss(1.16, 1.25, y) * ss(1.38, 1.3, y) * Math.sin(y * 110 + z * Math.sign(ca) * 90);
      f -= 0.002 * side * ss(1.24, 1.33, y) * ss(1.4, 1.34, y);
      
      f += 0.001 * ss(0.89, 0.875, y);
      const L = Math.hypot(x, z) || 1; x += x / L * f; z += z / L * f + tZ(y);
      const yy = y - 0.22 * ss(1.4, 1.465, y) * (z - tZ(y));
      const ao = clamp(1 + f * 40, 0.86, 1.05) * (1 - 0.22 * side * ss(1.2, 1.32, y) * ss(1.4, 1.34, y)) * (1 - 0.06 * ss(0.9, 0.872, y));
      return [x, yy, z, [ao, ao, ao]];
    }), mats.tee, C.tee, raw);
    const collar = mesh(new T.TorusGeometry(0.07, 0.0062, 12, 72).rotateX(Math.PI / 2).scale(1.07, 1, 0.89), mats.tee, C.teeRib, raw, 0, 1.463, -0.008); collar.rotation.x = 0.22;
    // pelvis + legs
    mesh(blob(0.148, 0.088, 0.098, 2.6, 48, 32), mats.trousers, C.trousers, raw, 0, 0.862, 0.002);
    const lR = spline([0, 0.12, 0.35, 0.47, 0.6, 0.8, 1], [0.09, 0.086, 0.07, 0.062, 0.062, 0.055, 0.053]);
    const legGeo = grid(72, 110, (u, v) => {
      const y = lerp(-0.8, 0.03, v), t = clamp(-y / 0.8, 0, 1), a = 2 * Math.PI * u - Math.PI / 2;
      let r = lR(t), f = 0;
      f += 0.0016 * Math.exp(-((a - Math.PI / 2) ** 2) / 0.006) * ss(0.08, 0.2, t) * ss(0.98, 0.85, t);
      f += 0.0008 * ss(0.38, 0.47, t) * ss(0.58, 0.49, t) * Math.sin(t * 120 + a * 1.5);
      f += 0.0016 * ss(0.88, 0.98, t) * Math.sin(t * 90 + Math.sin(a * 2) * 1.4);
      
      r += f; const seam = Math.exp(-(a * a) / 0.0015), ao = clamp(1 + f * 60, 0.75, 1.08) * (1 - 0.22 * seam) * (1 - 0.15 * ss(0.1, 0, t) * (Math.cos(a) < 0 ? 1 : 0));
      return [r * Math.cos(a) * 0.96, y, r * Math.sin(a) + 0.004 * Math.sin(Math.PI * t), [ao, ao, ao]];
    });
    // arms, hands, shoes per side
    [-1, 1].forEach((s) => {
      const side = new T.Group(); side.scale.x = s; raw.add(side);
      const hip = new T.Group(); hip.position.set(0.088, 0.9, 0); hip.rotation.z = 0.02; side.add(hip);
      mesh(legGeo, mats.trousers, C.trousers, hip);
      // shoulder + arm
      const sh = new T.Group(); sh.position.set(0.176, 1.385, -0.01); sh.rotation.set(0.04, 0, 0.1); side.add(sh);
      mesh(blob(0.058, 0.05, 0.061, 2.2, 32, 24), mats.tee, C.tee, sh, -0.006, -0.004, 0);
      mesh(grid(48, 28, (u, v) => {
        const y = lerp(-0.15, 0.012, v), a = 2 * Math.PI * u - Math.PI / 2, f = 0.0009 * Math.sin(a * 3 + y * 40) * ss(-0.03, -0.13, y);
        const r = 0.056 + 0.002 * ss(-0.15, 0, y) + f, ao = clamp(1 + f * 70, 0.75, 1.05);
        return [Math.cos(a) * r, y, Math.sin(a) * r * 1.08, [ao, ao, ao]];
      }), mats.tee, C.tee, sh);
      mesh(new T.TorusGeometry(0.0562, 0.0028, 8, 48).rotateX(Math.PI / 2).scale(1, 1, 1.08), mats.tee, C.teeRib, sh, 0, -0.148, 0);
      mesh(limb(0.285, spline([0, 0.25, 0.55, 0.85, 1], [0.047, 0.045, 0.041, 0.036, 0.034]), () => [1, 1.05]), mats.skin, C.skinBody, sh);
      const el = new T.Group(); el.position.set(0, -0.285, 0); el.rotation.set(-0.22, 0, -0.05); sh.add(el);
      mesh(limb(0.255, spline([0, 0.2, 0.5, 1], [0.036, 0.039, 0.034, 0.025]), (t) => [1 - 0.22 * t, 1 + 0.12 * t]), mats.skin, C.skinBody, el);
      const hand = new T.Group(); hand.position.set(0, -0.258, 0); hand.rotation.set(-0.06, 0.28, 0); el.add(hand);
      buildHand(hand, mats, C);
      // shoe
      const shoe = new T.Group(); shoe.position.set(0.102, 0, 0.022); shoe.rotation.y = 0.08; side.add(shoe);
      buildShoe(shoe, mats, C);
    });
    // chest print
    const pc = document.createElement('canvas'); pc.width = 512; pc.height = 64; const x = pc.getContext('2d');
    x.fillStyle = '#ecebe6'; x.font = '600 40px Manrope, Helvetica, Arial, sans-serif'; x.textBaseline = 'middle'; x.fillText('HEBRON IT ACADEMY', 8, 34);
    x.fillStyle = '#e8572a'; x.fillRect(452, 18, 30, 30); x.fillStyle = '#ecebe6'; x.fillRect(466, 18, 3, 30); x.fillRect(452, 32, 30, 3);
    const pt = new T.CanvasTexture(pc); pt.colorSpace = T.SRGBColorSpace; pt.anisotropy = 8;
    const print = new T.Mesh(new T.PlaneGeometry(0.084, 0.0105), new T.MeshStandardMaterial({ map: pt, transparent: true, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2 }));
    print.position.set(0.058, 1.262, 0.1262); print.rotation.y = 0.2; print.name = 'chest_print';
    const out = mergeByMaterial(raw); out.add(print); return out;
  }
  function buildHand(h, mats, C) {
    const sk = C.skinBody;
    mesh(blob(0.0145, 0.047, 0.04, 2.6, 32, 24, (x, y, z) => [x - 0.005 * (z / 0.04) ** 2 - 0.002 * (y < 0 ? 0 : y / 0.047), y, z]), mats.skin, sk, h, 0, -0.05, 0.002);
    mesh(blob(0.016, 0.03, 0.017, 2.2, 24, 18), mats.skin, sk, h, -0.004, -0.04, 0.026);
    const F = [[0.029, [0.042, 0.026, 0.022], 0.0085, -0.08, [0.22, 0.32, 0.22]], [0.0095, [0.046, 0.029, 0.024], 0.0088, -0.02, [0.26, 0.36, 0.24]], [-0.0095, [0.043, 0.028, 0.023], 0.0083, 0.04, [0.32, 0.42, 0.28]], [-0.027, [0.034, 0.021, 0.019], 0.0073, 0.1, [0.4, 0.48, 0.32]]];
    F.forEach((f) => {
      let par = new T.Group(); par.position.set(0.001, -0.092, f[0]); par.rotation.set(f[3], 0, -f[4][0]); h.add(par);
      let r = f[2];
      for (let k = 0; k < 3; k++) {
        const L = f[1][k], r0 = r, r1 = r * 0.92;
        mesh(limb(L, (t) => lerp(r0, r1, t), () => [0.88, 1], 16, 14), mats.skin, sk, par);
        if (k === 2) { const n = mesh(new T.SphereGeometry(1, 16, 12), mats.skin, C.nail, par, r1 * 0.66, -L * 0.62, 0); n.scale.set(0.0022, L * 0.36, r1 * 0.78); }
        const j = new T.Group(); j.position.set(0, -L, 0); j.rotation.z = -(f[4][k + 1] || 0); par.add(j); par = j; r = r1;
      }
    });
    let tp = new T.Group(); tp.position.set(-0.004, -0.03, 0.034); tp.rotation.set(-0.55, 0, -0.28); h.add(tp);
    [[0.034, 0.0112], [0.029, 0.0097], [0.024, 0.0089]].forEach((s, k) => {
      mesh(limb(s[0], (t) => lerp(s[1], s[1] * 0.93, t), () => [0.9, 1], 16, 14), mats.skin, sk, tp);
      if (k === 2) { const n = mesh(new T.SphereGeometry(1, 16, 12), mats.skin, C.nail, tp, s[1] * 0.6, -s[0] * 0.6, 0); n.scale.set(0.0024, s[0] * 0.38, s[1] * 0.8); }
      const j = new T.Group(); j.position.set(0, -s[0], 0); j.rotation.z = -0.22; tp.add(j); tp = j;
    });
  }
  function buildShoe(g, mats, C) {
    const W = spline([-0.065, -0.05, 0, 0.06, 0.12, 0.17, 0.2, 0.208], [0.02, 0.033, 0.038, 0.04, 0.046, 0.04, 0.025, 0.01]);
    const H = spline([-0.065, -0.04, 0.0, 0.05, 0.09, 0.14, 0.18, 0.208], [0.055, 0.07, 0.072, 0.06, 0.048, 0.038, 0.03, 0.022]);
    const base = 0.022, cOf = (z) => { const v = Math.acos(clamp((0.07 - z) / 0.135, -1, 1)) / Math.PI; return Math.pow(Math.sin(Math.PI * v), 0.45); };
    mesh(grid(64, 72, (u, v) => {
      const z = 0.07 - 0.135 * Math.cos(Math.PI * v), c = Math.pow(Math.sin(Math.PI * v), 0.45), a = 2 * Math.PI * u, ca = Math.cos(a), sa = Math.sin(a);
      const y = sa > 0 ? base + H(z) * c * pw(sa, 0.9) : base + 0.004 * sa;
      const crease = 0.0012 * ss(0.12, 0.15, z) * ss(0.18, 0.15, z) * Math.sin(a * 6) * (sa > 0.3 ? 1 : 0);
      const ao = 1 - 0.12 * ss(0.4, 0, sa);
      return [W(z) * c * pw(ca, 0.8) * (1 + crease * 20), y + crease, z, [ao, ao, ao]];
    }, true), mats.leather, C.leather, g);
    const panelPts = []; const yP = 0.04;
    for (let k = 0; k <= 24; k++) { const z = lerp(-0.058, 0.196, k / 24), c = cOf(z), sA = (yP - base) / (H(z) * c); if (sA >= 1) continue; panelPts.push(new V(W(z) * c * Math.pow(Math.sqrt(1 - sA * sA), 0.8) + 0.0007, yP, z)); }
    const loop = panelPts.concat(panelPts.slice().reverse().map((p) => new V(-p.x, p.y, p.z)));
    mesh(new T.TubeGeometry(new T.CatmullRomCurve3(loop, true), 120, 0.0008, 5, true), mats.leather, 0xc9c7bf, g);
    [0.035, 0.058, 0.081, 0.104].forEach((z) => { const b = mesh(new T.BoxGeometry(0.046, 0.0028, 0.0055), mats.leather, 0xe4e3dd, g, 0, base + H(z) * cOf(z) + 0.001, z); b.rotation.x = 0.3; });
    mesh(new T.BoxGeometry(0.012, 0.022, 0.004), mats.leather, 0xd9d6cf, g, 0, base + 0.06, -0.064);
    const shp = new T.Shape(), FP = [[0, -0.065], [0.035, -0.05], [0.04, 0.0], [0.042, 0.06], [0.048, 0.12], [0.044, 0.17], [0.028, 0.2], [0, 0.208], [-0.028, 0.2], [-0.044, 0.165], [-0.046, 0.12], [-0.031, 0.05], [-0.032, 0.0], [-0.033, -0.05], [0, -0.065]];
    shp.moveTo(FP[0][0], FP[0][1]); shp.splineThru(FP.slice(1).map((p) => new T.Vector2(p[0], p[1])));
    const sole = new T.ExtrudeGeometry(shp, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 4, curveSegments: 48 }); sole.rotateX(Math.PI / 2); sole.translate(0, 0.021, 0);
    mesh(sole, mats.sole, C.sole, g);
    const strip = new T.ExtrudeGeometry(shp, { depth: 0.005, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.0056, bevelSegments: 2, curveSegments: 48 }); strip.rotateX(Math.PI / 2); strip.translate(0, 0.0062, 0);
    mesh(strip, mats.lime, 0xb8ff3d, g);
  }

  function makeMaterials() {
    const pores = canvasTex(256, 256, () => { const v = 128 + (rnd() - 0.5) * 90; return [v, v, v]; });
    pores.repeat.set(30, 18);
    const knit = canvasTex(256, 256, (x, y) => { const v = 128 + 60 * Math.sin(x * Math.PI / 2) * (0.7 + 0.3 * Math.sin(y * Math.PI / 3)) + (rnd() - 0.5) * 50; return [v, v, v]; });
    knit.repeat.set(36, 28);
    const twill = canvasTex(256, 256, (x, y) => { const v = 128 + 55 * Math.sin((x + y) * Math.PI / 3) + (rnd() - 0.5) * 40; return [v, v, v]; });
    twill.repeat.set(10, 24);
    const rows = Array.from({ length: 256 }, () => rnd()), cols = Array.from({ length: 256 }, () => rnd());
    const strandL = canvasTex(256, 256, (x, y) => { const v = 80 + 150 * rows[y] * (0.85 + 0.15 * rnd()); return [v, v, v]; });
    const strandS = canvasTex(256, 256, (x, y) => { const v = 80 + 150 * cols[x] * (0.85 + 0.15 * rnd()); return [v, v, v]; });
    strandS.repeat.set(6, 3);
    const eye = canvasTex(512, 256, (x, y) => {
      const th = (y + 0.5) / 256 * Math.PI, ph = x / 512 * Math.PI * 2, ir = 0.5, pr = 0.19;
      if (th < pr) return [12, 14, 18];
      if (th < ir) {
        const t = (th - pr) / (ir - pr), st = 0.5 + 0.5 * Math.sin(ph * 41 + Math.sin(ph * 13) * 2.2), n = rnd() * 0.15;
        let r = lerp(122, 104, t), gg = lerp(126, 146, t), b = lerp(120, 182, t);
        const k = 0.78 + 0.32 * st + n; r *= k; gg *= k; b *= k;
        const lim = ss(0.78, 1, t); r = lerp(r, 44, lim); gg = lerp(gg, 60, lim); b = lerp(b, 84, lim);
        const coll = Math.exp(-((t - 0.22) ** 2) / 0.006); r = lerp(r, 140, coll * 0.4); gg = lerp(gg, 128, coll * 0.4); b = lerp(b, 108, coll * 0.4);
        return [r, gg, b];
      }
      const back = ss(0.9, 1.6, th); return [lerp(242, 226, back), lerp(238, 200, back), lerp(232, 196, back)];
    }, true);
    eye.wrapT = T.ClampToEdgeWrapping;
    const P = (o) => new T.MeshPhysicalMaterial(Object.assign({ vertexColors: true, color: 0xffffff }, o));
    const m = {
      skin: P({ name: 'skin', roughness: 0.56, sheen: 0.35, sheenRoughness: 0.5, sheenColor: new T.Color(0xffc4ae), bumpMap: pores, bumpScale: 0.12, emissive: new T.Color(0x3a1208), emissiveIntensity: 0.18, clearcoat: 0.06, clearcoatRoughness: 0.5 }),
      hair: P({ name: 'hair_locks', roughness: 0.48, sheen: 0.7, sheenRoughness: 0.32, sheenColor: new T.Color(0xe2c9a2), bumpMap: strandL, bumpScale: 0.8, side: T.DoubleSide }),
      hairShell: P({ name: 'hair_base', roughness: 0.62, sheen: 0.4, sheenRoughness: 0.4, sheenColor: new T.Color(0xcdb08a), bumpMap: strandS, bumpScale: 0.9 }),
      brow: new T.MeshStandardMaterial({ name: 'brows', color: 0x6c533f, roughness: 0.7 }),
      eye: new T.MeshPhysicalMaterial({ name: 'eye', map: eye, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.03 }),
      tee: P({ name: 'tee_cotton', roughness: 0.92, sheen: 1, sheenRoughness: 0.75, sheenColor: new T.Color(0x56627f), bumpMap: knit, bumpScale: 0.5, side: T.DoubleSide }),
      trousers: P({ name: 'trousers_twill', roughness: 0.86, sheen: 0.6, sheenRoughness: 0.7, sheenColor: new T.Color(0x5a5a5c), bumpMap: twill, bumpScale: 0.45 }),
      leather: P({ name: 'sneaker_leather', roughness: 0.42, clearcoat: 0.25, clearcoatRoughness: 0.35 }),
      sole: P({ name: 'sneaker_sole', roughness: 0.78 }),
      lime: P({ name: 'sole_accent', roughness: 0.55 })
    };
    m.brow.userData.noRecv = true;
    return m;
  }
  const C = {
    skin: 0xebc2ae, skinBody: 0xe8bea8, lip: 0xc7887c, cheek: 0xe7a690, stubble: 0xae8b73, socket: 0xcf977f, lid: 0xe0ab92, ear: 0xe2a690, nail: 0xf0c6b5,
    hairSide: 0x8a7562, hairBase: 0x7c624a, hairRoot: 0x6e5641, hairMid: 0xa08263, hairTip: 0xcdb08a,
    tee: 0x1b2135, teeRib: 0x161b2b, trousers: 0x1f1e1d, leather: 0xf1f0ec, sole: 0xf3f2ee
  };

  function buildEnv(r) {
    const pm = new T.PMREMGenerator(r), sc = new T.Scene();
    const box = new T.Mesh(new T.BoxGeometry(14, 9, 14), new T.MeshBasicMaterial({ color: 0x77766f, side: T.BackSide })); box.position.y = 3.5; sc.add(box);
    const floor = new T.Mesh(new T.PlaneGeometry(14, 14), new T.MeshBasicMaterial({ color: 0xbdbbb4 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.98; sc.add(floor);
    const panel = (w, h, x, y, z, k) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(1, 1, 1).multiplyScalar(k), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 1, 0); sc.add(m); };
    panel(5, 3, 0, 7.5, 0.5, 2.6); panel(2.4, 3.4, 4.2, 2.6, 4, 4.2); panel(2, 3, -4.6, 2.2, 2.4, 1.5); panel(3, 2.2, -2.4, 3.2, -5.5, 3.2);
    const t = pm.fromScene(sc, 0.03).texture; pm.dispose(); return t;
  }

  class ALAvatar extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      Object.assign(this.style, { display: 'block', position: 'relative', touchAction: 'pan-y', cursor: 'grab' });
      if (!this.style.width) this.style.width = '100%'; if (!this.style.height) this.style.height = '100%';
      const gen = this._gen = (this._gen || 0) + 1;
      import(THREE_URL).then((mod) => { if (gen === this._gen && this.isConnected) { T = mod; V = T.Vector3; this.setup(); } }).catch((e) => console.warn('al-avatar: three failed', e));
    }
    setup() {
      seed = 11;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.NeutralToneMapping; r.toneMappingExposure = 1.0;
      r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
      r.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(r.domElement);
      const scene = new T.Scene(); scene.environment = buildEnv(r); scene.environmentIntensity = 0.55;
      const cam = new T.PerspectiveCamera(24, 1, 0.05, 50);
      scene.add(new T.HemisphereLight(0xffffff, 0xd6d4cd, 0.4));
      const key = new T.DirectionalLight(0xfff6ee, 2.2); key.position.set(1.2, 3.4, 2.8); key.castShadow = true;
      Object.assign(key.shadow.camera, { left: -1, right: 1, top: 1.2, bottom: -1.2, near: 0.5, far: 9 }); key.shadow.camera.updateProjectionMatrix();
      key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 7; key.shadow.bias = -0.0002; key.shadow.normalBias = 0.012;
      key.target.position.set(0, 0.9, 0); scene.add(key, key.target);
      const fill = new T.DirectionalLight(0xeef2ff, 0.45); fill.position.set(-2.2, 1.4, 1.8); scene.add(fill);
      const rim = new T.DirectionalLight(0xffffff, 1.3); rim.position.set(-1.6, 2.6, -2.6); scene.add(rim);
      const ground = new T.Mesh(new T.PlaneGeometry(6, 6), new T.ShadowMaterial({ opacity: 0.1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      const bc = document.createElement('canvas'); bc.width = bc.height = 128; const bx = bc.getContext('2d'), gr = bx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(17,17,17,0.55)'); gr.addColorStop(0.5, 'rgba(17,17,17,0.18)'); gr.addColorStop(1, 'rgba(17,17,17,0)'); bx.fillStyle = gr; bx.fillRect(0, 0, 128, 128);
      const blobM = new T.Mesh(new T.PlaneGeometry(0.62, 0.5), new T.MeshBasicMaterial({ map: new T.CanvasTexture(bc), transparent: true, depthWrite: false, opacity: 0.55 }));
      blobM.rotation.x = -Math.PI / 2; blobM.position.set(0, 0.001, 0.06); scene.add(blobM);

      const mats = makeMaterials(), g = new T.Group(); g.name = 'anton'; scene.add(g);
      g.add(buildBody(mats, C));
      const pivot = new T.Group(); pivot.position.set(0, 1.535, -0.005); g.add(pivot);
      const H = buildHead(mats, C); H.group.position.set(0, 0.09, 0.015); pivot.add(H.group);

      const fit = () => {
        const w = this.clientWidth || 1, h = this.clientHeight || 1; r.setSize(w, h, false); cam.aspect = w / h;
        const fh = 1.86, dist = (fh / 2) / Math.tan(T.MathUtils.degToRad(cam.fov / 2)) / Math.min(1, cam.aspect / 0.5);
        cam.position.set(0, 0.98, dist); cam.lookAt(0, 0.89, 0); cam.updateProjectionMatrix();
      };
      fit(); this._ro = new ResizeObserver(fit); this._ro.observe(this);
      let rot = -0.45, vel = reduced ? 0 : 0.0035, drag = false, lx = 0, lastY = scrollY, mx = 0, my = 0;
      const down = (e) => { drag = true; lx = e.clientX; this.style.cursor = 'grabbing'; try { this.setPointerCapture(e.pointerId); } catch (_) {} };
      const move = (e) => { if (drag) { const dx = e.clientX - lx; lx = e.clientX; rot += dx * 0.011; vel = dx * 0.0011; } };
      const up = () => { drag = false; this.style.cursor = 'grab'; };
      this.addEventListener('pointerdown', down); this.addEventListener('pointermove', move); this.addEventListener('pointerup', up); this.addEventListener('pointercancel', up);
      this._gm = (e) => { const b = this.getBoundingClientRect(); mx = clamp((e.clientX - (b.left + b.width / 2)) / (innerWidth / 2), -1, 1); my = clamp((e.clientY - (b.top + b.height * 0.2)) / (innerHeight / 2), -1, 1); };
      addEventListener('mousemove', this._gm, { passive: true });
      const base = reduced ? 0 : 0.0035; let t0 = performance.now();
      this._dbg = { T, cam, g, scene, set view(v) { this.v = v; } };
      const dbg = this._dbg;
      const loop = (now) => {
        this._raf = requestAnimationFrame(loop);
        try {
        const dt = Math.min(48, now - t0) / 16.67; t0 = now;
        const sy = scrollY, ds = sy - lastY; lastY = sy;
        if (!drag) { vel += (base - vel) * 0.03 * dt; if (!reduced) vel += clamp(ds, -60, 60) * 0.0001; rot += vel * dt; }
        g.rotation.y = dbg.rot != null ? dbg.rot : rot;
        const face = Math.max(0, Math.cos(g.rotation.y)), k = reduced ? 1 : 0.06 * dt;
        pivot.rotation.y += (mx * 0.32 * face - pivot.rotation.y) * Math.min(1, k);
        pivot.rotation.x += (my * 0.14 * face - pivot.rotation.x) * Math.min(1, k);
        H.eyes.forEach((e, i) => { e.rotation.y = (i ? 1 : -1) * 0.07 + mx * 0.22 * face; e.rotation.x = my * 0.12 * face; });
        if (dbg.v) { cam.position.set(dbg.v[0], dbg.v[1], dbg.v[2]); cam.lookAt(dbg.v[3], dbg.v[4], dbg.v[5]); cam.fov = dbg.v[6] || 24; cam.updateProjectionMatrix(); }
        r.render(scene, cam);
        } catch (err) { if (!this._err) { this._err = err; console.warn('al-avatar loop', err); } }
      };
      g.rotation.y = rot; r.render(scene, cam);
      this._raf = requestAnimationFrame(loop);
      this._r = r;
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf); if (this._ro) this._ro.disconnect(); removeEventListener('mousemove', this._gm);
      if (this._r) { this._r.dispose(); this._r.domElement.remove(); this._r = null; } this._init = false; this._gen = (this._gen || 0) + 1;
    }
  }
  customElements.define('al-avatar', ALAvatar);
})();
