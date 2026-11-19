// Extract per-page specs from hydrated reference captures (read-only).
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

const SRC = process.argv[2];
const OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

function walk(node, fn) { fn(node); (node.childNodes || []).forEach(c => walk(c, fn)); }
function text(node) {
  let t = '';
  walk(node, n => { if (n.nodeName === '#text') t += n.value; });
  return t.replace(/\s+/g, ' ').trim();
}
function attr(node, name) {
  const a = (node.attrs || []).find(a => a.name === name);
  return a ? a.value : null;
}

const report = JSON.parse(fs.readFileSync(path.join(SRC, '_capture-report.json'), 'utf8'));
const specs = [];
for (const r of report.results) {
  if (!r.file) continue;
  const file = path.join(SRC, r.file);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const doc = parse(html);
  const spec = { url: r.url, file: r.file, bytes: html.length };
  const head = { title: null, meta: {}, jsonld: [], links: [] };
  const body = { headings: [], forms: [], sections: [], navLinks: [], images: 0, buttons: [] };
  walk(doc, n => {
    const tag = n.nodeName;
    if (tag === 'title') head.title = text(n);
    if (tag === 'meta') {
      const name = attr(n, 'name') || attr(n, 'property');
      if (name) head.meta[name] = (attr(n, 'content') || '').slice(0, 400);
    }
    if (tag === 'link' && ['canonical', 'alternate'].includes(attr(n, 'rel')))
      head.links.push({ rel: attr(n, 'rel'), href: attr(n, 'href'), hreflang: attr(n, 'hreflang') });
    if (tag === 'script' && attr(n, 'type') === 'application/ld+json') {
      const t = text(n);
      try { head.jsonld.push(JSON.parse(t)); } catch { head.jsonld.push({ _raw: t.slice(0, 500) }); }
    }
    if (/^h[1-3]$/.test(tag)) body.headings.push({ tag, text: text(n).slice(0, 200) });
    if (tag === 'img') body.images++;
    if (tag === 'form') {
      const fields = [];
      walk(n, c => {
        if (['input', 'select', 'textarea'].includes(c.nodeName))
          fields.push({ tag: c.nodeName, type: attr(c, 'type'), name: attr(c, 'name'), placeholder: attr(c, 'placeholder'), required: attr(c, 'required') !== null });
      });
      body.forms.push({ action: attr(n, 'action'), method: attr(n, 'method'), fields });
    }
    if (tag === 'button') { const t = text(n); if (t) body.buttons.push(t.slice(0, 80)); }
    if (tag === 'a') {
      const href = attr(n, 'href');
      if (href && href.startsWith('/') && !href.startsWith('//')) body.navLinks.push(href);
    }
    if (tag === 'section' || (tag === 'div' && attr(n, 'id'))) {
      const id = attr(n, 'id');
      const cls = attr(n, 'class') || '';
      if (tag === 'section' || id) body.sections.push({ tag, id, cls: cls.slice(0, 120), textLen: text(n).length, h: text(n).slice(0, 100) });
    }
  });
  body.navLinks = [...new Set(body.navLinks)];
  body.buttons = [...new Set(body.buttons)];
  spec.head = head; spec.body = body;
  specs.push(spec);
}
fs.writeFileSync(path.join(OUT, 'page-specs.json'), JSON.stringify(specs, null, 1));
console.log('specs:', specs.length);
const withLd = specs.filter(s => s.head.jsonld.length).length;
const withForms = specs.filter(s => s.body.forms.length).length;
console.log('with JSON-LD:', withLd, 'with forms:', withForms);