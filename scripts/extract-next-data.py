#!/usr/bin/env python3
"""Regenerate the authoritative reference data extracts from the raw SSR captures.

Reads lena/captured/*.html (181 live captures, 2026-11-19), pulls every
__NEXT_DATA__ blob, and writes:
  .cache/next-data.json        — {capture_key: pageProps}  (gitignored, ~85 MB)
  database/reference/all-courses.json — {course_id: full course object} (committed;
                                 the M1 seed source: 32 courses / 305 chapters /
                                 1106 lessons / prices)

Run: python3 scripts/extract-next-data.py
"""
import json, os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAP = os.path.join(ROOT, 'captured')
CACHE = os.path.join(ROOT, '.cache')
REFOUT = os.path.join(ROOT, 'database', 'reference')
os.makedirs(CACHE, exist_ok=True)
os.makedirs(REFOUT, exist_ok=True)

blob_re = re.compile(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', re.S)
next_data = {}
courses = {}
for f in sorted(glob.glob(os.path.join(CAP, '*.html'))):
    key = os.path.basename(f)[:-5]
    html = open(f, encoding='utf-8', errors='replace').read()
    m = blob_re.search(html)
    if not m:
        continue
    try:
        data = json.loads(m.group(1))
    except json.JSONDecodeError:
        continue
    pp = (data.get('props') or {}).get('pageProps') or {}
    next_data[key] = pp
    # course objects live in pageProps.course (course-detail pages)
    c = pp.get('course')
    if isinstance(c, dict) and c.get('id'):
        courses[str(c['id'])] = c

json.dump(next_data, open(os.path.join(CACHE, 'next-data.json'), 'w'))
json.dump(courses, open(os.path.join(REFOUT, 'all-courses.json'), 'w'), indent=1)
ch = sum(len(c.get('chapter') or []) for c in courses.values())
le = sum(len(x.get('lessons') or []) for c in courses.values() for x in (c.get('chapter') or []))
print(f'pageProps blobs: {len(next_data)}; courses: {len(courses)}; chapters: {ch}; lessons: {le}')
print('wrote', os.path.join(CACHE, 'next-data.json'))
print('wrote', os.path.join(REFOUT, 'all-courses.json'))
