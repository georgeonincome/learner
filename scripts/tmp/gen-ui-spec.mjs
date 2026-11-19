// Generate UI-SPEC markdown for builder-page templates from reference block trees.
// Measurements come from settings.style.{desktop,tablet,mobile} — code, not screenshots.
import fs from 'node:fs';
import path from 'node:path';

const SCRATCH = '/home/george_jackson/.hermes/cache/scratch/savvypro-audit';
const OUT = process.argv[2];
const found = JSON.parse(fs.readFileSync(SCRATCH + '/next-data.json', 'utf8'));

function getPresent(key) {
  const pp = found[key]?.props?.pageProps;
  if (!pp) return null;
  let ist = pp.initialState;
  if (typeof ist === 'string') { try { ist = JSON.parse(ist); } catch { return null; } }
  return ist?.builder?.present || null;
}
function blocks(present) {
  const map = {};
  for (const n of Object.values(present.nodes || {}))
    for (const b of Object.values(n.data || {})) map[b.id] = b;
  return map;
}
function styleStr(blk, dev) {
  const st = blk?.settings?.style?.[dev];
  if (!st) return '';
  return Object.entries(st).map(([k, v]) => `${k}:${v}`).join('; ');
}
function textOf(blk) {
  const g = blk?.settings?.general || {};
  const t = g.text || g.content || g.title || '';
  if (typeof t === 'string') return t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
  if (t && typeof t === 'object') return JSON.stringify(t).slice(0, 120);
  return '';
}
function fontOf(blk, dev) {
  const st = blk?.settings?.style?.[dev] || {};
  const keys = ['fontSize', 'fontWeight', 'lineHeight', 'fontFamily', 'color', 'textAlign', 'letterSpacing'];
  return keys.filter(k => st[k] !== undefined).map(k => `${k}=${st[k]}`).join(' ');
}

// template -> capture key
const templates = {
  'home': 'ref:index.html',
  'books': 'ref:books.html',
  'blog': 'ref:blog.html',
  'all-products': 'ref:all-products.html',
  'mini-courses': 'ref:mini-courses.html',
  'offers': 'ref:offers.html',
  'appointment': 'raw:appointment.html',
  'testimonials': 'ref:testimonials.html',
  'path-landing-getting-started': 'ref:getting-started-page.html',
  'path-landing-learn-digital-skills': 'ref:learn-digital-skills.html',
  'path-landing-grow-my-business': 'ref:grow-my-business.html',
  'path-landing-build-expert': 'ref:build-your-expert-business.html',
  'path-landing-business-solutions': 'ref:business-solutions.html',
  'lead-magnet-freebies': 'raw:freebies.html',
  'lead-magnet-101-pdf': 'ref:101-digital-skills-pdf-download.html',
  'legal-privacy': 'ref:savvypro-privacy-policy.html',
  'legal-terms': 'ref:savvypro-terms-and-conditions.html',
  'contact-us': 'ref:contact-us.html',
  'about-us': 'ref:about-us.html',
  'inner-circle': 'ref:inner-circle.html',
  'for-businesses': 'ref:for-businesses.html',
  'content-creation-school': 'ref:content-creation-school.html',
  'choose-your-path': 'ref:choose-your-path.html',
};

const summary = [];
for (const [tpl, key] of Object.entries(templates)) {
  const present = getPresent(key);
  if (!present) { summary.push([tpl, 'NO BUILDER DATA']); continue; }
  const map = blocks(present);
  const ids = present.nodeTreeIDS || [];
  const lines = [];
  lines.push(`# UI-SPEC/${tpl}.md — reference measurements from block-tree code`);
  lines.push('');
  lines.push(`Source: \`__NEXT_DATA__\` builder.present of ${key.replace('ref:', '_reference/site/www.savvypro.org/')} (captured 2026-11-16/19).`);
  lines.push('Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.');
  lines.push('Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.');
  lines.push('Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).');
  lines.push('');
  lines.push(`## Section order (${ids.length} top-level sections)`);
  let secNo = 0;
  const walk = (id, depth, out) => {
    const b = map[id]; if (!b) return;
    const t = b.type;
    if (t === 'Section') {
      secNo++;
      out.push(`\n### Section ${secNo} (id ${id.slice(0, 8)})`);
      out.push(`- desktop: ${styleStr(b, 'desktop') || '(none)'}`);
      out.push(`- tablet: ${styleStr(b, 'tablet') || '(inherits desktop)'}`);
      out.push(`- mobile: ${styleStr(b, 'mobile') || '(inherits desktop)'}`);
    } else if (['Heading', 'Text', 'InlineText', 'RichText'].includes(t)) {
      const txt = textOf(b);
      out.push(`${'  '.repeat(depth)}- ${t}: "${txt}"`);
      const fd = fontOf(b, 'desktop'), fm = fontOf(b, 'mobile');
      if (fd) out.push(`${'  '.repeat(depth)}  - desktop: ${fd}`);
      if (fm) out.push(`${'  '.repeat(depth)}  - mobile: ${fm}`);
    } else if (t === 'Button' || t === 'IconButton') {
      const g = b.settings?.general || {};
      const label = (g.text || g.label || '').toString().replace(/<[^>]+>/g, '').slice(0, 60);
      const link = b.settings?.link || {};
      out.push(`${'  '.repeat(depth)}- ${t}: "${label}" link=${JSON.stringify(link).slice(0, 120)}`);
      const fd = fontOf(b, 'desktop');
      const sd = styleStr(b, 'desktop');
      if (sd) out.push(`${'  '.repeat(depth)}  - desktop: ${sd.slice(0, 220)}`);
      const sm = styleStr(b, 'mobile');
      if (sm) out.push(`${'  '.repeat(depth)}  - mobile: ${sm.slice(0, 220)}`);
    } else if (t === 'Img') {
      const g = b.settings?.general || {};
      out.push(`${'  '.repeat(depth)}- Img: ${JSON.stringify(g.src || g.image || '').slice(0, 110)} alt=${JSON.stringify(g.alt || '').slice(0, 60)}`);
      const sd = styleStr(b, 'desktop'); if (sd) out.push(`${'  '.repeat(depth)}  - desktop: ${sd.slice(0, 160)}`);
    } else if (t === 'Row') {
      const g = b.settings?.general || {};
      const kids = (b.nodes || []).length;
      out.push(`${'  '.repeat(depth)}- Row (${kids} col${g.isSlider ? ', SLIDER' : ''}) align=${g.horizontalAlignment || 'none'}/${g.verticalAlignment || 'none'}`);
      const sd = styleStr(b, 'desktop'); if (sd) out.push(`${'  '.repeat(depth)}  - desktop: ${sd.slice(0, 180)}`);
    } else if (t === 'Column') {
      const sd = styleStr(b, 'desktop');
      out.push(`${'  '.repeat(depth)}- Column${sd ? ' — ' + sd.slice(0, 140) : ''}`);
    } else if (t === 'AllBlogs') {
      out.push(`${'  '.repeat(depth)}- AllBlogs (dynamic blog card grid)`);
    } else if (t === 'List') {
      out.push(`${'  '.repeat(depth)}- List`);
    } else if (t === 'Container' || t === 'Box') {
      const sd = styleStr(b, 'desktop');
      if (sd) out.push(`${'  '.repeat(depth)}- ${t}: ${sd.slice(0, 160)}`);
    }
    for (const c of b.nodes || []) walk(c, depth + 1, out);
  };
  for (const id of ids) walk(id, 0, lines);
  fs.writeFileSync(path.join(OUT, tpl + '.md'), lines.join('\n') + '\n');
  summary.push([tpl, ids.length + ' sections', lines.length + ' lines']);
}
console.log(summary.map(s => s.join(' | ')).join('\n'));