/* @ds-bundle: {"format":4,"namespace":"AntonLutsykDesignSystem_0097c3","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"ContactBlock","sourcePath":"components/layout/ContactBlock.jsx"},{"name":"ExperienceRow","sourcePath":"components/lists/ExperienceRow.jsx"},{"name":"ProjectRow","sourcePath":"components/lists/ProjectRow.jsx"},{"name":"SkillList","sourcePath":"components/lists/SkillList.jsx"},{"name":"Stat","sourcePath":"components/lists/Stat.jsx"},{"name":"ImagePreview","sourcePath":"components/media/ImagePreview.jsx"},{"name":"Marquee","sourcePath":"components/media/Marquee.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Header","sourcePath":"components/navigation/Header.jsx"},{"name":"Navigation","sourcePath":"components/navigation/Navigation.jsx"},{"name":"BodyText","sourcePath":"components/type/BodyText.jsx"},{"name":"DisplayHeading","sourcePath":"components/type/DisplayHeading.jsx"},{"name":"Metadata","sourcePath":"components/type/Metadata.jsx"},{"name":"SectionLabel","sourcePath":"components/type/SectionLabel.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"5b9661f538b6","components/actions/TextLink.jsx":"4b859f7194cf","components/icon/Icon.jsx":"c5b3dc9528ac","components/layout/ContactBlock.jsx":"a5c889deb4b8","components/lists/ExperienceRow.jsx":"fe196bcb2d4e","components/lists/ProjectRow.jsx":"12b914fc4fd8","components/lists/SkillList.jsx":"0f8c9d79d72d","components/lists/Stat.jsx":"a600704ba2dd","components/media/ImagePreview.jsx":"2bd3ba7635d3","components/media/Marquee.jsx":"80902878b77e","components/navigation/Footer.jsx":"ad48047634cf","components/navigation/Header.jsx":"dca8f4998ee6","components/navigation/Navigation.jsx":"ffa93bedfae2","components/type/BodyText.jsx":"52cce806810e","components/type/DisplayHeading.jsx":"58ed57a19c2c","components/type/Metadata.jsx":"f71c4c7730d2","components/type/SectionLabel.jsx":"07b910a45636","ui_kits/portfolio/CaseStudy.jsx":"ca80a3e59bb0","ui_kits/portfolio/Home.jsx":"b97bcf3c9611","ui_kits/portfolio/Work.jsx":"6c180927a7ad","ui_kits/portfolio/data.js":"0ce8c02cbc55"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AntonLutsykDesignSystem_0097c3 = window.AntonLutsykDesignSystem_0097c3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/icon/Icon.jsx
try { (() => {
const SOURCES = ['https://unpkg.com/lucide-static@0.469.0/icons/', 'https://unpkg.com/lucide-static@latest/icons/'];
const cache = {};
function load(name) {
  if (!cache[name]) {
    cache[name] = fetch(SOURCES[0] + name + '.svg').then(r => r.ok ? r.text() : fetch(SOURCES[1] + name + '.svg').then(r2 => r2.ok ? r2.text() : '')).catch(() => '');
  }
  return cache[name];
}
function Icon({
  name = 'arrow-up-right',
  size = 16,
  strokeWidth = 1.5,
  label,
  className,
  style
}) {
  const [svg, setSvg] = React.useState('');
  React.useEffect(() => {
    let alive = true;
    load(name).then(t => {
      if (alive) setSvg(t);
    });
    return () => {
      alive = false;
    };
  }, [name]);
  const html = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/width="24"/, 'width="100%"').replace(/height="24"/, 'height="100%"').replace(/stroke-width="[\d.]+"/, 'stroke-width="' + strokeWidth + '"');
  return /*#__PURE__*/React.createElement("span", {
    className: 'al-icon' + (className ? ' ' + className : ''),
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: Object.assign({
      width: size,
      height: size
    }, style),
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = 'arrow-up-right',
  iconPosition = 'end',
  magnetic = true,
  fullWidth = false,
  href,
  target,
  onClick,
  disabled = false,
  type = 'button',
  className
}) {
  const ref = React.useRef(null);
  const [t, setT] = React.useState({
    x: 0,
    y: 0
  });
  const onMove = e => {
    if (!magnetic || disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({
      x: (e.clientX - (r.left + r.width / 2)) * 0.22,
      y: (e.clientY - (r.top + r.height / 2)) * 0.32
    });
  };
  const Tag = href ? 'a' : 'button';
  const cls = ['al-btn', 'al-btn--' + variant, size !== 'md' ? 'al-btn--' + size : '', fullWidth ? 'al-btn--full' : '', className].filter(Boolean).join(' ');
  const iconSize = size === 'lg' ? 22 : size === 'sm' ? 14 : 18;
  const ic = icon ? /*#__PURE__*/React.createElement("span", {
    className: "al-btn__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize
  })) : null;
  return /*#__PURE__*/React.createElement(Tag, {
    ref: ref,
    className: cls,
    href: href,
    target: target,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    "aria-disabled": disabled || undefined,
    type: Tag === 'button' ? type : undefined,
    onMouseMove: onMove,
    onMouseLeave: () => setT({
      x: 0,
      y: 0
    }),
    style: magnetic ? {
      transform: 'translate(' + t.x.toFixed(1) + 'px,' + t.y.toFixed(1) + 'px)'
    } : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "al-btn__inner",
    style: magnetic ? {
      transform: 'translate(' + (t.x * 0.4).toFixed(1) + 'px,' + (t.y * 0.4).toFixed(1) + 'px)'
    } : undefined
  }, iconPosition === 'start' ? ic : null, /*#__PURE__*/React.createElement("span", {
    className: "al-btn__label"
  }, children), iconPosition === 'end' ? ic : null));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/TextLink.jsx
try { (() => {
function TextLink({
  children,
  href = '#',
  external = false,
  icon,
  tone = 'default',
  size,
  underline = true,
  onClick,
  className
}) {
  const ic = icon === undefined ? external ? 'arrow-up-right' : null : icon;
  const cls = ['al-link', tone === 'muted' ? 'al-link--muted' : '', !underline ? 'al-link--plain' : '', size ? 'al-link--' + size : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: href,
    onClick: onClick,
    target: external ? '_blank' : undefined,
    rel: external ? 'noreferrer' : undefined
  }, children, ic ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: size === 'lg' ? 20 : 14
  }) : null);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/lists/ExperienceRow.jsx
try { (() => {
function ExperienceRow({
  period,
  current = false,
  role,
  company,
  location,
  description,
  tags = []
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "al-xrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-xrow__period"
  }, current ? /*#__PURE__*/React.createElement("i", {
    className: "al-dot"
  }) : null, /*#__PURE__*/React.createElement("span", null, period)), /*#__PURE__*/React.createElement("div", {
    className: "al-xrow__role"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "al-xrow__title"
  }, role), /*#__PURE__*/React.createElement("div", {
    className: "al-xrow__company"
  }, company, location ? /*#__PURE__*/React.createElement("span", null, " \u2014 ", location) : null)), description ? /*#__PURE__*/React.createElement("p", {
    className: "al-xrow__desc"
  }, description) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    className: "al-xrow__tags"
  }, tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t
  }, t))));
}
Object.assign(__ds_scope, { ExperienceRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/ExperienceRow.jsx", error: String((e && e.message) || e) }); }

// components/lists/ProjectRow.jsx
try { (() => {
function Ph({
  title,
  ratio
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "al-ph"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-ph__row"
  }, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement("span", null, "IMG")), /*#__PURE__*/React.createElement("div", {
    className: "al-ph__row"
  }, /*#__PURE__*/React.createElement("span", null, "Preview"), /*#__PURE__*/React.createElement("span", null, ratio)));
}
function ProjectRow({
  index,
  title,
  client,
  services,
  year,
  image,
  imageAlt = '',
  href,
  onClick,
  preview = true
}) {
  const [hover, setHover] = React.useState(false);
  const box = React.useRef(null);
  const pos = React.useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0
  });
  const raf = React.useRef(0);
  const tick = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.14;
    p.y += (p.ty - p.y) * 0.14;
    if (box.current) box.current.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0) translate(-50%,-55%)';
    raf.current = requestAnimationFrame(tick);
  };
  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const enter = e => {
    const p = pos.current;
    p.x = p.tx = e.clientX;
    p.y = p.ty = e.clientY;
    setHover(true);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };
  const move = e => {
    pos.current.tx = e.clientX;
    pos.current.ty = e.clientY;
  };
  const leave = () => {
    setHover(false);
    setTimeout(() => {
      if (!box.current || !box.current.classList.contains('is-on')) cancelAnimationFrame(raf.current);
    }, 700);
  };
  const Tag = href ? 'a' : 'div';
  const media = image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt
  }) : /*#__PURE__*/React.createElement(Ph, {
    title: title,
    ratio: "4:3"
  });
  const floating = preview ? /*#__PURE__*/React.createElement("div", {
    ref: box,
    className: 'al-cursor-preview' + (hover ? ' is-on' : ''),
    "aria-hidden": "true"
  }, media) : null;
  const RD = typeof window !== 'undefined' ? window.ReactDOM : null;
  return /*#__PURE__*/React.createElement(Tag, {
    className: "al-prow",
    href: href,
    onClick: onClick,
    onMouseEnter: preview ? enter : undefined,
    onMouseMove: preview ? move : undefined,
    onMouseLeave: preview ? leave : undefined,
    role: href ? undefined : 'link',
    tabIndex: href ? undefined : 0
  }, /*#__PURE__*/React.createElement("span", {
    className: "al-prow__idx"
  }, /*#__PURE__*/React.createElement("span", null, index)), /*#__PURE__*/React.createElement("span", {
    className: "al-prow__title"
  }, title, client ? /*#__PURE__*/React.createElement("em", {
    className: "al-prow__client"
  }, client) : null), /*#__PURE__*/React.createElement("span", {
    className: "al-prow__services"
  }, Array.isArray(services) ? services.join(', ') : services), /*#__PURE__*/React.createElement("span", {
    className: "al-prow__year"
  }, year), /*#__PURE__*/React.createElement("span", {
    className: "al-prow__arrow"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 22
  })), preview ? /*#__PURE__*/React.createElement("span", {
    className: "al-prow__thumb",
    style: {
      position: 'relative'
    }
  }, media) : null, floating && RD && RD.createPortal ? RD.createPortal(floating, document.body) : floating);
}
Object.assign(__ds_scope, { ProjectRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/ProjectRow.jsx", error: String((e && e.message) || e) }); }

// components/lists/SkillList.jsx
try { (() => {
function SkillList({
  index,
  title,
  items = [],
  variant = 'list',
  className
}) {
  const cls = ['al-skills', 'al-skills--' + variant, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, title || index ? /*#__PURE__*/React.createElement("div", {
    className: "al-skills__head"
  }, title ? /*#__PURE__*/React.createElement("h3", {
    className: "al-skills__title"
  }, title) : /*#__PURE__*/React.createElement("span", null), index ? /*#__PURE__*/React.createElement("span", {
    className: "al-skills__idx"
  }, index) : null) : null, /*#__PURE__*/React.createElement("ul", {
    className: "al-skills__list"
  }, items.map(it => {
    const o = typeof it === 'string' ? {
      label: it
    } : it;
    return /*#__PURE__*/React.createElement("li", {
      className: "al-skills__item",
      key: o.label
    }, /*#__PURE__*/React.createElement("span", {
      className: "al-skills__text"
    }, o.label), o.meta ? /*#__PURE__*/React.createElement("span", {
      className: "al-skills__meta"
    }, o.meta) : null);
  })));
}
Object.assign(__ds_scope, { SkillList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/SkillList.jsx", error: String((e && e.message) || e) }); }

// components/lists/Stat.jsx
try { (() => {
function useInView(threshold) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: threshold == null ? 0.15 : threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
function Stat({
  value,
  suffix,
  label,
  index,
  note,
  countUp = true,
  duration = 1600,
  size = 'lg'
}) {
  const [ref, inView] = useInView(0.4);
  const num = Number(value);
  const isNum = countUp && value !== '' && !isNaN(num) && isFinite(num);
  const [n, setN] = React.useState(isNum ? 0 : value);
  React.useEffect(() => {
    if (!inView || !isNum) return;
    let start = 0;
    let raf = 0;
    const dec = String(value).indexOf('.') > -1 ? String(value).split('.')[1].length : 0;
    const step = t => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 4);
      setN((num * e).toFixed(dec));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: 'al-stat' + (size === 'sm' ? ' al-stat--sm' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-stat__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "al-stat__label"
  }, label), index ? /*#__PURE__*/React.createElement("span", {
    className: "al-stat__idx"
  }, index) : null), /*#__PURE__*/React.createElement("div", {
    className: "al-stat__value"
  }, isNum ? n : value, suffix ? /*#__PURE__*/React.createElement("span", {
    className: "al-stat__suffix"
  }, suffix) : null), note ? /*#__PURE__*/React.createElement("p", {
    className: "al-stat__note"
  }, note) : null);
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/Stat.jsx", error: String((e && e.message) || e) }); }

// components/media/ImagePreview.jsx
try { (() => {
function useInView(threshold) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: threshold == null ? 0.15 : threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
function useScrollProgress(ref, enabled) {
  const [p, setP] = React.useState(0.5);
  React.useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        setP(Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))));
      });
    };
    on();
    document.addEventListener('scroll', on, {
      passive: true,
      capture: true
    });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('scroll', on, {
        capture: true
      });
      window.removeEventListener('resize', on);
    };
  }, [enabled]);
  return p;
}
function ImagePreview({
  src,
  alt = '',
  ratio = '4/5',
  caption,
  meta,
  index,
  reveal = true,
  hover = 'zoom',
  parallax = 0,
  placeholder = 'Image',
  className,
  style
}) {
  const [ref, inView] = useInView(0.15);
  const p = useScrollProgress(ref, !!parallax);
  const cls = ['al-figure', reveal ? 'al-figure--reveal' : '', reveal && inView ? 'al-figure--in' : '', hover === 'zoom' ? 'al-figure--zoom' : '', hover === 'mono' ? 'al-figure--mono al-figure--zoom' : '', className].filter(Boolean).join(' ');
  const y = parallax ? ((p - 0.5) * parallax).toFixed(1) : 0;
  return /*#__PURE__*/React.createElement("figure", {
    ref: ref,
    className: cls,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-figure__frame",
    style: {
      '--ratio': ratio
    }
  }, index ? /*#__PURE__*/React.createElement("span", {
    className: "al-figure__idx"
  }, index) : null, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: parallax ? {
      translate: '0 ' + y + 'px'
    } : undefined
  }) : /*#__PURE__*/React.createElement("div", {
    className: "al-ph"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-ph__row"
  }, /*#__PURE__*/React.createElement("span", null, placeholder), /*#__PURE__*/React.createElement("span", null, "IMG")), /*#__PURE__*/React.createElement("div", {
    className: "al-ph__row"
  }, /*#__PURE__*/React.createElement("span", null, "Drop asset"), /*#__PURE__*/React.createElement("span", null, String(ratio).replace('/', ':'))))), caption || meta ? /*#__PURE__*/React.createElement("figcaption", {
    className: "al-figure__cap"
  }, /*#__PURE__*/React.createElement("span", null, caption), /*#__PURE__*/React.createElement("span", null, meta)) : null);
}
Object.assign(__ds_scope, { ImagePreview });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/ImagePreview.jsx", error: String((e && e.message) || e) }); }

// components/media/Marquee.jsx
try { (() => {
function Marquee({
  items = [],
  size = 'lg',
  speed = 40,
  direction = 'left',
  separator = 'dot',
  alternate = true,
  inverse = false,
  bordered = true,
  pauseOnHover = true,
  className
}) {
  const reps = Math.max(1, Math.ceil(8 / Math.max(1, items.length)));
  const seq = [];
  for (let r = 0; r < reps; r++) items.forEach(it => seq.push(it));
  const group = k => /*#__PURE__*/React.createElement("span", {
    className: "al-marquee__group",
    "aria-hidden": k > 0 ? 'true' : undefined,
    key: k
  }, seq.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: 'al-marquee__item' + (alternate && i % 2 === 1 ? ' al-marquee__item--alt' : '')
  }, it), separator === 'dot' ? /*#__PURE__*/React.createElement("span", {
    className: "al-marquee__sep"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "al-marquee__septext"
  }, separator))));
  const cls = ['al-marquee', 'al-marquee--' + size, direction === 'right' ? 'al-marquee--right' : '', pauseOnHover ? 'al-marquee--pause' : '', inverse ? 'al-inverse' : '', bordered ? '' : 'al-marquee--borderless', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: {
      '--marquee-speed': speed + 's'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-marquee__track"
  }, group(0), group(1)));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Marquee.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function useInView(threshold) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: threshold == null ? 0.15 : threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
function Footer({
  name = 'Anton Lutsyk',
  tagline,
  columns = [],
  year = 2026,
  note,
  onTop
}) {
  const [ref, inView] = useInView(0.2);
  const top = () => {
    if (onTop) onTop();else window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "al-footer al-inverse"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-footer__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-footer__top"
  }, tagline ? /*#__PURE__*/React.createElement("p", {
    className: "al-footer__tagline"
  }, tagline) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    className: "al-footer__cols"
  }, columns.map(c => /*#__PURE__*/React.createElement("div", {
    className: "al-footer__col",
    key: c.label
  }, /*#__PURE__*/React.createElement("h4", null, c.label), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href || '#',
    onClick: l.onClick,
    target: l.external ? '_blank' : undefined,
    rel: l.external ? 'noreferrer' : undefined
  }, l.label)))))), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: 'al-footer__mark al-footer__mark--anim' + (inView ? ' al-footer__mark--in' : ''),
    "aria-hidden": "true"
  }, name.split('').map((ch, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      animationDelay: i * 40 + 'ms'
    }
  }, ch))), /*#__PURE__*/React.createElement("div", {
    className: "al-footer__base"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9", year, " ", name), note ? /*#__PURE__*/React.createElement("span", null, note) : null, /*#__PURE__*/React.createElement("button", {
    className: "al-footer__top-btn",
    onClick: top
  }, "To top ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up",
    size: 14
  })))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navigation.jsx
try { (() => {
function Navigation({
  items = [],
  active,
  onNavigate,
  variant = 'inline',
  separator = '/',
  ariaLabel = 'Primary'
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: 'al-nav al-nav--' + variant,
    "aria-label": ariaLabel
  }, items.map((it, i) => {
    const id = it.id || it.label;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: id
    }, variant === 'inline' && i > 0 && separator ? /*#__PURE__*/React.createElement("span", {
      className: "al-nav__sep",
      "aria-hidden": "true"
    }, separator) : null, /*#__PURE__*/React.createElement("a", {
      className: "al-nav__item",
      href: it.href || '#',
      "aria-current": active === id ? 'page' : undefined,
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(id);
        }
      }
    }, variant === 'stacked' ? /*#__PURE__*/React.createElement("span", {
      className: "al-nav__num"
    }, String(i + 1).padStart(2, '0')) : null, /*#__PURE__*/React.createElement("span", {
      className: "al-nav__text"
    }, it.label), it.count != null ? /*#__PURE__*/React.createElement("sup", null, it.count) : null));
  }));
}
Object.assign(__ds_scope, { Navigation });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navigation.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Header.jsx
try { (() => {
function Header({
  name = 'Anton Lutsyk',
  mark = '©26',
  role = 'UX/UI Designer',
  items = [],
  active,
  onNavigate,
  status = 'Available for projects',
  sticky = true
}) {
  const [open, setOpen] = React.useState(false);
  const go = id => {
    setOpen(false);
    if (onNavigate) onNavigate(id);
  };
  return /*#__PURE__*/React.createElement("header", {
    className: 'al-header' + (sticky ? '' : ' al-header--static')
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-header__in"
  }, /*#__PURE__*/React.createElement("a", {
    className: "al-header__brand",
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }, name, /*#__PURE__*/React.createElement("sup", null, mark)), role ? /*#__PURE__*/React.createElement("span", {
    className: "al-header__role al-label"
  }, role) : null, /*#__PURE__*/React.createElement("div", {
    className: "al-header__nav"
  }, /*#__PURE__*/React.createElement(__ds_scope.Navigation, {
    items: items,
    active: active,
    onNavigate: go
  })), status ? /*#__PURE__*/React.createElement("span", {
    className: "al-header__status al-label"
  }, /*#__PURE__*/React.createElement("i", {
    className: "al-dot"
  }), status) : null, /*#__PURE__*/React.createElement("button", {
    className: "al-header__menu al-label",
    onClick: () => setOpen(true),
    "aria-expanded": open
  }, "Menu ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 14
  }))), open ? /*#__PURE__*/React.createElement("div", {
    className: "al-menu al-inverse",
    role: "dialog",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-menu__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "al-header__brand",
    style: {
      color: 'var(--fg-1)'
    }
  }, name, /*#__PURE__*/React.createElement("sup", null, mark)), /*#__PURE__*/React.createElement("button", {
    className: "al-header__menu al-label",
    style: {
      display: 'inline-flex'
    },
    onClick: () => setOpen(false)
  }, "Close ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  }))), /*#__PURE__*/React.createElement(__ds_scope.Navigation, {
    items: items,
    active: active,
    onNavigate: go,
    variant: "stacked"
  }), /*#__PURE__*/React.createElement("div", {
    className: "al-menu__foot al-label"
  }, status ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "al-dot"
  }), status) : null, /*#__PURE__*/React.createElement("span", null, role))) : null);
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Header.jsx", error: String((e && e.message) || e) }); }

// components/type/BodyText.jsx
try { (() => {
function BodyText({
  as = 'p',
  size = 'body',
  tone = 'primary',
  indent = false,
  maxWidth,
  children,
  className,
  style
}) {
  const Tag = as;
  const cls = ['al-body', 'al-body--' + size, tone === 'secondary' ? 'al-body--secondary' : '', indent ? 'al-body--indent' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, {
    className: cls,
    style: Object.assign({
      maxWidth: maxWidth == null ? size === 'lead' ? '30ch' : 'var(--measure)' : maxWidth
    }, style)
  }, children);
}
Object.assign(__ds_scope, { BodyText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/BodyText.jsx", error: String((e && e.message) || e) }); }

// components/type/DisplayHeading.jsx
try { (() => {
function useInView(threshold) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: threshold == null ? 0.15 : threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
function useScrollProgress(ref, enabled) {
  const [p, setP] = React.useState(0.5);
  React.useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        setP(Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))));
      });
    };
    on();
    document.addEventListener('scroll', on, {
      passive: true,
      capture: true
    });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('scroll', on, {
        capture: true
      });
      window.removeEventListener('resize', on);
    };
  }, [enabled]);
  return p;
}
function DisplayHeading({
  as = 'h2',
  size = 'h1',
  lines,
  children,
  reveal = true,
  delay = 0,
  drift = 0,
  muted = false,
  className,
  style
}) {
  const [ref, inView] = useInView(0.1);
  const p = useScrollProgress(ref, !!drift);
  const Tag = as;
  const content = lines && lines.length ? lines : [children];
  const cls = ['al-display', 'al-display--' + size, muted ? 'al-display--muted' : '', reveal ? 'al-reveal' : '', reveal && inView ? 'al-reveal--in' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, {
    ref: ref,
    className: cls,
    style: style
  }, content.map((ln, i) => {
    const x = drift ? (p - 0.5) * drift * (i % 2 ? -1 : 1) : 0;
    return /*#__PURE__*/React.createElement("span", {
      className: "al-line",
      key: i,
      style: drift ? {
        transform: 'translate3d(' + x.toFixed(1) + 'px,0,0)'
      } : undefined
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        '--i': i,
        '--delay': delay + 'ms'
      }
    }, ln));
  }));
}
Object.assign(__ds_scope, { DisplayHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/DisplayHeading.jsx", error: String((e && e.message) || e) }); }

// components/type/Metadata.jsx
try { (() => {
function Metadata({
  items = [],
  layout = 'row',
  divided = false,
  className,
  style
}) {
  const cls = ['al-meta', 'al-meta--' + layout, divided ? 'al-meta--divided' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("dl", {
    className: cls,
    style: style
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    className: "al-meta__item",
    key: it.label
  }, /*#__PURE__*/React.createElement("dt", {
    className: "al-meta__label"
  }, it.label, layout === 'inline' ? ':' : ''), /*#__PURE__*/React.createElement("dd", {
    className: "al-meta__value"
  }, it.value))));
}
Object.assign(__ds_scope, { Metadata });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/Metadata.jsx", error: String((e && e.message) || e) }); }

// components/type/SectionLabel.jsx
try { (() => {
function useInView(threshold) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: threshold == null ? 0.15 : threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
function SectionLabel({
  index,
  label,
  variant,
  accent = true,
  rule = false,
  aside,
  animate = true,
  className
}) {
  const v = variant || (index != null ? 'numbered' : 'braces');
  const [ref, inView] = useInView(0.4);
  const digits = index != null ? String(index).split('') : [];
  const cls = ['al-seclabel', 'al-seclabel--' + v, rule ? 'al-seclabel--rule' : '', animate ? 'al-seclabel--anim' : '', inView ? 'al-seclabel--in' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "al-seclabel__main"
  }, v === 'numbered' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: 'al-seclabel__num' + (accent ? ' al-seclabel__num--accent' : '')
  }, digits.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      animationDelay: i * 90 + 'ms'
    }
  }, d))), /*#__PURE__*/React.createElement("span", {
    className: "al-seclabel__slash"
  }, "/"), /*#__PURE__*/React.createElement("span", null, label)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "al-seclabel__brace"
  }, '{'), /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    className: "al-seclabel__brace"
  }, '}'))), aside ? /*#__PURE__*/React.createElement("span", {
    className: "al-seclabel__aside"
  }, aside) : null);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/layout/ContactBlock.jsx
try { (() => {
function ContactBlock({
  index = '06',
  label = 'Contact',
  heading,
  email,
  links = [],
  note
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(email);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  const lines = heading ? Array.isArray(heading) ? heading : [heading] : null;
  return /*#__PURE__*/React.createElement("section", {
    className: "al-contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "al-contact__label"
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    index: index,
    label: label
  })), /*#__PURE__*/React.createElement("div", {
    className: "al-contact__main"
  }, lines ? /*#__PURE__*/React.createElement(__ds_scope.DisplayHeading, {
    as: "h2",
    size: "h1",
    lines: lines
  }) : null, /*#__PURE__*/React.createElement("a", {
    className: "al-contact__email",
    href: 'mailto:' + email
  }, email, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 48,
    strokeWidth: 1.25
  })), /*#__PURE__*/React.createElement("div", {
    className: "al-contact__row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "al-contact__copy al-label",
    onClick: copy
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: copied ? 'check' : 'copy',
    size: 14
  }), copied ? 'Copied' : 'Copy email'), /*#__PURE__*/React.createElement("div", {
    className: "al-contact__links"
  }, links.map(l => /*#__PURE__*/React.createElement(__ds_scope.TextLink, {
    key: l.label,
    href: l.href,
    external: true
  }, l.label))), note ? /*#__PURE__*/React.createElement("span", {
    className: "al-contact__note"
  }, /*#__PURE__*/React.createElement("i", {
    className: "al-dot"
  }), note) : null)));
}
Object.assign(__ds_scope, { ContactBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/ContactBlock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/CaseStudy.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CaseStudyScreen({
  id,
  openProject,
  go
}) {
  const {
    SectionLabel,
    DisplayHeading,
    BodyText,
    Metadata,
    ImagePreview,
    ProjectRow,
    Button,
    Icon
  } = window.AntonLutsykDesignSystem_0097c3;
  const D = window.PORTFOLIO;
  const i = Math.max(0, D.projects.findIndex(p => p.id === id));
  const p = D.projects[i];
  const next = D.projects[(i + 1) % D.projects.length];
  const chapters = [{
    n: '01',
    l: 'Challenge',
    h: 'What was broken',
    t: 'Placeholder — describe the problem, who it hurt and how you measured it. Keep it to three sentences.'
  }, {
    n: '02',
    l: 'Process',
    h: 'How we found the answer',
    t: 'Placeholder — research, flows, the two directions that were explored and why one won.'
  }, {
    n: '03',
    l: 'Outcome',
    h: 'What shipped',
    t: 'Placeholder — the final solution and a real, verifiable result.'
  }];
  return /*#__PURE__*/React.createElement("main", {
    key: p.id,
    "data-screen-label": 'Case — ' + p.title
  }, /*#__PURE__*/React.createElement("section", {
    className: "al-container k-hero"
  }, /*#__PURE__*/React.createElement("button", {
    className: "k-back al-label",
    onClick: () => go('work')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), "All work"), /*#__PURE__*/React.createElement("div", {
    className: "k-head",
    style: {
      marginTop: 'clamp(28px,4vw,56px)',
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: p.index,
    label: p.client
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(DisplayHeading, {
    as: "h1",
    size: "display",
    lines: [p.title]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "k-case-meta"
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "lead",
    indent: true
  }, p.summary), /*#__PURE__*/React.createElement(Metadata, {
    divided: true,
    items: [{
      label: 'Role',
      value: p.role
    }, {
      label: 'Platform',
      value: p.platform
    }, {
      label: 'Year',
      value: p.year
    }, {
      label: 'Duration',
      value: p.duration
    }]
  }))), /*#__PURE__*/React.createElement("section", {
    className: "al-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-gallery"
  }, /*#__PURE__*/React.createElement(ImagePreview, {
    ratio: "16/9",
    index: p.index,
    caption: p.title + ' — key screen',
    meta: "Fig. 01",
    parallax: 60,
    placeholder: "Hero shot"
  }), /*#__PURE__*/React.createElement(ImagePreview, {
    ratio: "4/5",
    caption: "Mobile flow",
    meta: "Fig. 02",
    placeholder: "Mobile"
  }), /*#__PURE__*/React.createElement(ImagePreview, {
    ratio: "4/3",
    caption: "Component detail",
    meta: "Fig. 03",
    placeholder: "Detail"
  }))), /*#__PURE__*/React.createElement("section", {
    className: "al-container k-sec"
  }, chapters.map(c => /*#__PURE__*/React.createElement("div", {
    className: "k-chapter",
    key: c.n
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: c.n,
    label: c.l
  }), /*#__PURE__*/React.createElement(DisplayHeading, {
    size: "h3",
    lines: [c.h]
  }), /*#__PURE__*/React.createElement(BodyText, {
    size: "small",
    tone: "secondary"
  }, c.t)))), /*#__PURE__*/React.createElement("section", {
    className: "al-container k-sec",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    label: "Next project"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main",
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "arrow-right",
    onClick: () => go('contact')
  }, "Start a project"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ProjectRow, _extends({}, next, {
    onClick: () => openProject(next.id)
  })))));
}
window.CaseStudyScreen = CaseStudyScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/CaseStudy.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KitDS = window.AntonLutsykDesignSystem_0097c3;
function HomeScreen({
  go,
  openProject
}) {
  const {
    SectionLabel,
    DisplayHeading,
    BodyText,
    Metadata,
    Button,
    Marquee,
    ProjectRow,
    ExperienceRow,
    SkillList,
    Stat,
    ImagePreview,
    ContactBlock,
    Icon
  } = KitDS;
  const D = window.PORTFOLIO;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "al-container k-hero",
    "data-screen-label": "Home \u2014 hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-hero__meta"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    label: "UX/UI Designer"
  }), /*#__PURE__*/React.createElement("span", {
    className: "al-label",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Portfolio \xA92026"), /*#__PURE__*/React.createElement("span", {
    className: "al-label",
    style: {
      color: 'var(--fg-2)'
    }
  }, "Web & mobile products"), /*#__PURE__*/React.createElement("span", {
    className: "al-label",
    style: {
      color: 'var(--fg-2)'
    }
  }, "(Index 01\u201406)")), /*#__PURE__*/React.createElement(DisplayHeading, {
    as: "h1",
    size: "mega",
    className: "k-hero__name",
    lines: ['Anton', 'Lutsyk'],
    drift: 160
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-hero__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k-hero__scroll al-label"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-down",
    size: 14
  }), "Scroll"), /*#__PURE__*/React.createElement(BodyText, {
    size: "lead",
    className: "k-hero__lead"
  }, "Independent digital designer with a ", /*#__PURE__*/React.createElement("em", null, "strong visual point of view"), " \u2014 designing B2B, SaaS, e-commerce and mobile products."), /*#__PURE__*/React.createElement("div", {
    className: "k-hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('contact')
  }, "Let's talk")))), /*#__PURE__*/React.createElement(Marquee, {
    size: "lg",
    items: D.disciplines,
    speed: 60
  }), /*#__PURE__*/React.createElement("section", {
    id: "about",
    className: "al-container k-sec--lg",
    "data-screen-label": "01 Intro"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01",
    label: "Intro"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(DisplayHeading, {
    size: "h1",
    lines: ['I design products', /*#__PURE__*/React.createElement("span", {
      key: "b"
    }, "that feel ", /*#__PURE__*/React.createElement("em", null, "obvious")), 'in hindsight.']
  }))), /*#__PURE__*/React.createElement("div", {
    className: "k-intro"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-intro__img"
  }, /*#__PURE__*/React.createElement(ImagePreview, {
    ratio: "4/5",
    placeholder: "Portrait",
    caption: "Anton Lutsyk",
    meta: "Fig. 01",
    hover: "mono"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-intro__text"
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "lead",
    indent: true
  }, "For 2+ years I've been turning complex B2B workflows and busy storefronts into calm, usable interfaces \u2014 from first flows to shipped design systems."), /*#__PURE__*/React.createElement(BodyText, {
    tone: "secondary"
  }, "I work closely with product managers and engineers, prototype early, and care about the details that make a product feel considered: hierarchy, rhythm, states and motion."), /*#__PURE__*/React.createElement(Metadata, {
    divided: true,
    items: [{
      label: 'Role',
      value: 'UX/UI Designer'
    }, {
      label: 'Focus',
      value: 'B2B, SaaS, E-com'
    }, {
      label: 'Platforms',
      value: 'Web, iOS, Android'
    }, {
      label: 'Status',
      value: 'Open to work'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-intro__stat"
  }, /*#__PURE__*/React.createElement(Stat, {
    value: 2,
    suffix: "+",
    label: "Years",
    note: "Designing digital products for web and mobile."
  })))), /*#__PURE__*/React.createElement("section", {
    id: "work",
    className: "al-container k-sec",
    "data-screen-label": "Selected work"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    label: "Selected work"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(DisplayHeading, {
    size: "h2",
    lines: ['Six products, shipped.']
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "arrow-right",
    onClick: () => go('work')
  }, "All projects"))), /*#__PURE__*/React.createElement("div", null, D.projects.slice(0, 4).map(p => /*#__PURE__*/React.createElement(ProjectRow, _extends({
    key: p.id
  }, p, {
    onClick: () => openProject(p.id)
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "al-container k-sec--lg",
    "data-screen-label": "02 Experience"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02",
    label: "Experience"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(DisplayHeading, {
    size: "h2",
    lines: ['Where I have been', /*#__PURE__*/React.createElement("span", {
      key: "b"
    }, "doing the ", /*#__PURE__*/React.createElement("em", null, "work."))]
  }))), /*#__PURE__*/React.createElement("div", null, D.experience.map(x => /*#__PURE__*/React.createElement(ExperienceRow, _extends({
    key: x.period
  }, x))))), /*#__PURE__*/React.createElement("section", {
    className: "al-container k-sec",
    "data-screen-label": "03 Expertise"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03",
    label: "Expertise"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "lead"
  }, "Four areas I practise every week \u2014 the overlap is where the interesting products happen."))), /*#__PURE__*/React.createElement("div", {
    className: "k-four"
  }, D.expertise.map(e => /*#__PURE__*/React.createElement(SkillList, _extends({
    key: e.index
  }, e))))), /*#__PURE__*/React.createElement("section", {
    className: "al-container k-sec--lg",
    "data-screen-label": "04 Skills"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "04",
    label: "Skills",
    aside: "(08)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(SkillList, {
    variant: "inline",
    items: D.disciplines
  }))), /*#__PURE__*/React.createElement("div", {
    className: "k-two"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement(SkillList, {
    title: "Toolkit",
    index: "/ Tools",
    items: D.tools
  }))), /*#__PURE__*/React.createElement("section", {
    className: "al-container k-sec",
    "data-screen-label": "05 Education"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head",
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "05",
    label: "Education"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(DisplayHeading, {
    size: "h2",
    lines: ['Learning, formally', /*#__PURE__*/React.createElement("span", {
      key: "b"
    }, "and ", /*#__PURE__*/React.createElement("em", null, "otherwise."))]
  }))), /*#__PURE__*/React.createElement("div", null, D.education.map(x => /*#__PURE__*/React.createElement(ExperienceRow, _extends({
    key: x.role
  }, x))))), /*#__PURE__*/React.createElement("section", {
    id: "contact",
    className: "al-container k-sec--lg",
    "data-screen-label": "06 Contact"
  }, /*#__PURE__*/React.createElement(ContactBlock, {
    heading: ["Let's build", /*#__PURE__*/React.createElement("span", {
      key: "b"
    }, "something ", /*#__PURE__*/React.createElement("em", null, "precise."))],
    email: D.email,
    links: D.socials,
    note: "Open to full-time & freelance"
  })));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Work.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function WorkScreen({
  openProject
}) {
  const {
    SectionLabel,
    DisplayHeading,
    ProjectRow,
    Marquee
  } = window.AntonLutsykDesignSystem_0097c3;
  const D = window.PORTFOLIO;
  const [f, setF] = React.useState('all');
  const filters = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'saas',
    label: 'B2B & SaaS'
  }, {
    id: 'ecom',
    label: 'E-commerce'
  }, {
    id: 'mobile',
    label: 'Mobile'
  }];
  const list = D.projects.filter(p => f === 'all' || p.tag === f);
  return /*#__PURE__*/React.createElement("main", {
    "data-screen-label": "Work index"
  }, /*#__PURE__*/React.createElement("section", {
    className: "al-container k-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head",
    style: {
      marginBottom: 'clamp(32px,5vw,72px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-head__label"
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    label: "Work"
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-head__main"
  }, /*#__PURE__*/React.createElement(DisplayHeading, {
    as: "h1",
    size: "display",
    lines: [/*#__PURE__*/React.createElement("span", {
      key: "a"
    }, "Index ", /*#__PURE__*/React.createElement("sup", {
      className: "al-label",
      style: {
        verticalAlign: 'top',
        fontSize: 14,
        letterSpacing: 0,
        color: 'var(--fg-2)'
      }
    }, "(", String(D.projects.length).padStart(2, '0'), ")"))]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "k-filters",
    role: "group",
    "aria-label": "Filter projects"
  }, filters.map(x => {
    const n = x.id === 'all' ? D.projects.length : D.projects.filter(p => p.tag === x.id).length;
    return /*#__PURE__*/React.createElement("button", {
      key: x.id,
      className: "k-filter",
      "aria-pressed": f === x.id,
      onClick: () => setF(x.id)
    }, x.label, /*#__PURE__*/React.createElement("sup", null, n));
  })), /*#__PURE__*/React.createElement("div", {
    className: "al-grid al-label k-hide-sm",
    style: {
      color: 'var(--fg-2)',
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      gridColumn: '1/2'
    }
  }, "No."), /*#__PURE__*/React.createElement("span", {
    style: {
      gridColumn: '2/8'
    }
  }, "Project"), /*#__PURE__*/React.createElement("span", {
    style: {
      gridColumn: '8/11'
    },
    className: "k-hide-sm"
  }, "Service"), /*#__PURE__*/React.createElement("span", {
    style: {
      gridColumn: '11/13'
    }
  }, "Year")), /*#__PURE__*/React.createElement("div", {
    key: f
  }, list.map(p => /*#__PURE__*/React.createElement(ProjectRow, _extends({
    key: p.id
  }, p, {
    onClick: () => openProject(p.id)
  }))))), /*#__PURE__*/React.createElement(Marquee, {
    size: "label",
    separator: "/",
    items: ['Available for projects', 'Q4 2026', 'Full-time & freelance', 'Web & mobile'],
    speed: 34
  }));
}
window.WorkScreen = WorkScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Work.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/data.js
try { (() => {
// Placeholder content — replace with Anton's real projects, companies and links.
window.PORTFOLIO = {
  email: 'hello@antonlutsyk.com',
  nav: [{
    id: 'work',
    label: 'Work',
    count: 6
  }, {
    id: 'about',
    label: 'About'
  }, {
    id: 'contact',
    label: 'Contact'
  }],
  disciplines: ['UX/UI Design', 'Product Design', 'Web Design', 'Mobile App Design', 'B2B & SaaS', 'Design Systems', 'Prototyping', 'Responsive Design'],
  projects: [{
    id: 'ledger',
    index: '01',
    title: 'Ledger',
    client: 'B2B finance SaaS',
    services: ['Product design', 'Design system'],
    year: '2025',
    tag: 'saas',
    summary: 'Rebuilding invoice reconciliation for finance teams who live in spreadsheets.',
    role: 'Lead product designer',
    platform: 'Web app',
    duration: '5 months'
  }, {
    id: 'fieldnote',
    index: '02',
    title: 'Fieldnote',
    client: 'field-service app',
    services: ['Mobile app', 'UX research'],
    year: '2025',
    tag: 'mobile',
    summary: 'An offline-first mobile tool for technicians logging jobs on site.',
    role: 'Product designer',
    platform: 'iOS, Android',
    duration: '4 months'
  }, {
    id: 'northshop',
    index: '03',
    title: 'Northshop',
    client: 'e-commerce',
    services: ['Web design', 'Checkout UX'],
    year: '2024',
    tag: 'ecom',
    summary: 'A calmer storefront and a three-step checkout for a homeware retailer.',
    role: 'UX/UI designer',
    platform: 'Responsive web',
    duration: '3 months'
  }, {
    id: 'atlas',
    index: '04',
    title: 'Atlas Admin',
    client: 'SaaS analytics',
    services: ['Dashboard', 'Data viz'],
    year: '2024',
    tag: 'saas',
    summary: 'Turning a dense analytics back-office into a readable daily tool.',
    role: 'UX/UI designer',
    platform: 'Web app',
    duration: '4 months'
  }, {
    id: 'kit01',
    index: '05',
    title: 'Kit/01',
    client: 'design system',
    services: ['Components', 'Documentation'],
    year: '2024',
    tag: 'saas',
    summary: 'A token-driven component library shared across three product teams.',
    role: 'Design system designer',
    platform: 'Figma, web',
    duration: 'Ongoing'
  }, {
    id: 'pulse',
    index: '06',
    title: 'Pulse',
    client: 'wellness concept',
    services: ['Mobile app', 'Prototyping'],
    year: '2023',
    tag: 'mobile',
    summary: 'A self-initiated habit app exploring motion as feedback.',
    role: 'Designer',
    platform: 'iOS',
    duration: '6 weeks'
  }],
  experience: [{
    period: '2024 — Now',
    current: true,
    role: 'Product Designer',
    company: 'B2B SaaS company',
    location: 'Remote',
    description: 'End-to-end design for a finance platform: discovery, flows, UI and the shared component library.',
    tags: ['B2B', 'SaaS', 'Design system']
  }, {
    period: '2023 — 2024',
    role: 'UX/UI Designer',
    company: 'Digital product studio',
    location: 'Hybrid',
    description: 'Websites, e-commerce and mobile apps for studio clients — from wireframes to developer handoff.',
    tags: ['Web', 'E-commerce', 'Mobile']
  }, {
    period: '2023',
    role: 'Junior UI Designer',
    company: 'Freelance',
    location: 'Remote',
    description: 'Landing pages and app interfaces for early-stage founders.',
    tags: ['Web', 'UI']
  }],
  expertise: [{
    index: '/ 001',
    title: 'Product',
    items: ['UX/UI Design', 'Product Design', 'User flows', 'UX research']
  }, {
    index: '/ 002',
    title: 'Interface',
    items: ['Web Design', 'Mobile App Design', 'Responsive Design', 'Interaction design']
  }, {
    index: '/ 003',
    title: 'Systems',
    items: ['Design Systems', 'Tokens', 'Documentation', 'Handoff']
  }, {
    index: '/ 004',
    title: 'Domains',
    items: ['B2B & SaaS', 'E-commerce', 'Dashboards', 'Mobile products']
  }],
  tools: [{
    label: 'Figma',
    meta: 'Daily'
  }, {
    label: 'FigJam',
    meta: 'Daily'
  }, {
    label: 'ProtoPie',
    meta: 'Prototyping'
  }, {
    label: 'Framer',
    meta: 'Web'
  }, {
    label: 'Notion',
    meta: 'Docs'
  }, {
    label: 'Jira',
    meta: 'Delivery'
  }],
  education: [{
    period: '2019 — 2023',
    role: "Bachelor's degree",
    company: 'University — field of study',
    description: 'Placeholder — add the institution and programme.',
    tags: ['Degree']
  }, {
    period: '2022',
    role: 'UX/UI Design programme',
    company: 'Online course',
    description: 'Placeholder — add the course provider.',
    tags: ['Certificate']
  }],
  socials: [{
    label: 'LinkedIn',
    href: '#'
  }, {
    label: 'Behance',
    href: '#'
  }, {
    label: 'Dribbble',
    href: '#'
  }, {
    label: 'Read.cv',
    href: '#'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ContactBlock = __ds_scope.ContactBlock;

__ds_ns.ExperienceRow = __ds_scope.ExperienceRow;

__ds_ns.ProjectRow = __ds_scope.ProjectRow;

__ds_ns.SkillList = __ds_scope.SkillList;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.ImagePreview = __ds_scope.ImagePreview;

__ds_ns.Marquee = __ds_scope.Marquee;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.Navigation = __ds_scope.Navigation;

__ds_ns.BodyText = __ds_scope.BodyText;

__ds_ns.DisplayHeading = __ds_scope.DisplayHeading;

__ds_ns.Metadata = __ds_scope.Metadata;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

})();
