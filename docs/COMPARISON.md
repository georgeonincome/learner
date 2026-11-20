# COMPARISON.md — layout comparison (no screenshots)

Captured reference HTML+CSS from `_reference/site` vs Lena templates at five breakpoints.
Tolerance: ±4px on bounding boxes and computed font size. Brand colour/copy/images may differ.

| Template | Width | Status | Sections (ref/lena) | Max box Δ | Max type Δ | Notes |
|---|---:|---|---|---:|---:|---|
| home | 375 | FAIL | 11/5 | 2352 | 8 | section order ref=[section,section,section,section,section,section,section,section,section,section,div] lena=[section,section,section,section,section]; max box  |
| home | 768 | FAIL | 11/5 | 1224 | 20 | section order ref=[section,section,section,section,section,section,section,section,section,section,div] lena=[section,section,section,section,section]; max box  |
| home | 1024 | FAIL | 11/5 | 999 | 20 | section order ref=[section,section,section,section,section,section,section,section,section,section,div] lena=[section,section,section,section,section]; max box  |
| home | 1280 | FAIL | 11/5 | 999 | 20 | section order ref=[section,section,section,section,section,section,section,section,section,section,div] lena=[section,section,section,section,section]; max box  |
| home | 1536 | FAIL | 11/5 | 1018 | 20 | section order ref=[section,section,section,section,section,section,section,section,section,section,div] lena=[section,section,section,section,section]; max box  |
| catalog | 375 | FAIL | 7/2 | 999 | 2 | section order ref=[section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px |
| catalog | 768 | FAIL | 7/2 | 999 | 24 | section order ref=[section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 24px |
| catalog | 1024 | FAIL | 7/2 | 999 | 18 | section order ref=[section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 18px |
| catalog | 1280 | FAIL | 7/2 | 999 | 18 | section order ref=[section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 18px |
| catalog | 1536 | FAIL | 7/2 | 999 | 18 | section order ref=[section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 18px |
| course-detail | 375 | FAIL | 14/0 | 999 | 999 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[]; max box delta 999px |
| course-detail | 768 | FAIL | 14/0 | 999 | 999 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[]; max box delta 999px |
| course-detail | 1024 | FAIL | 14/0 | 999 | 999 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[]; max box delta 999px |
| course-detail | 1280 | FAIL | 14/0 | 999 | 999 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[]; max box delta 999px |
| course-detail | 1536 | FAIL | 14/0 | 999 | 999 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[]; max box delta 999px |
| books | 375 | FAIL | 14/2 | 1164 | 15 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[section,section]; max  |
| books | 768 | FAIL | 14/2 | 999 | 7 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[section,section]; max  |
| books | 1024 | FAIL | 14/2 | 999 | 7 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[section,section]; max  |
| books | 1280 | FAIL | 14/2 | 999 | 7 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[section,section]; max  |
| books | 1536 | FAIL | 14/2 | 1008 | 7 | section order ref=[section,section,section,section,section,section,section,section,section,section,section,section,section,section] lena=[section,section]; max  |
| blog | 375 | FAIL | 3/1 | 2645 | 0 | section order ref=[section,section,div] lena=[div]; max box delta 2645px |
| blog | 768 | FAIL | 3/1 | 1420 | 4 | section order ref=[section,section,div] lena=[div]; max box delta 1420px |
| blog | 1024 | FAIL | 3/1 | 999 | 4 | section order ref=[section,section,div] lena=[div]; max box delta 999px |
| blog | 1280 | FAIL | 3/1 | 999 | 4 | section order ref=[section,section,div] lena=[div]; max box delta 999px |
| blog | 1536 | FAIL | 3/1 | 999 | 4 | section order ref=[section,section,div] lena=[div]; max box delta 999px |
| auth | 375 | FAIL | 2/1 | 999 | 2 | section order ref=[section,div] lena=[div]; max box delta 999px |
| auth | 768 | FAIL | 2/1 | 999 | 3 | section order ref=[section,div] lena=[div]; max box delta 999px |
| auth | 1024 | FAIL | 2/1 | 999 | 6 | section order ref=[section,div] lena=[div]; max box delta 999px; max type delta 6px |
| auth | 1280 | FAIL | 2/1 | 999 | 6 | section order ref=[section,div] lena=[div]; max box delta 999px; max type delta 6px |
| auth | 1536 | FAIL | 2/1 | 1088 | 6 | section order ref=[section,div] lena=[div]; max box delta 1088px; max type delta 6px |
| about-us | 375 | FAIL | 3/2 | 999 | 12 | section order ref=[section,section,div] lena=[section,section]; max box delta 999px; max type delta 12px |
| about-us | 768 | FAIL | 3/2 | 999 | 34 | section order ref=[section,section,div] lena=[section,section]; max box delta 999px; max type delta 34px |
| about-us | 1024 | FAIL | 3/2 | 999 | 34 | section order ref=[section,section,div] lena=[section,section]; max box delta 999px; max type delta 34px |
| about-us | 1280 | FAIL | 3/2 | 999 | 34 | section order ref=[section,section,div] lena=[section,section]; max box delta 999px; max type delta 34px |
| about-us | 1536 | FAIL | 3/2 | 999 | 34 | section order ref=[section,section,div] lena=[section,section]; max box delta 999px; max type delta 34px |
| contact-us | 375 | FAIL | 5/2 | 999 | 9 | section order ref=[section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 9px |
| contact-us | 768 | FAIL | 5/2 | 999 | 31 | section order ref=[section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 31px |
| contact-us | 1024 | FAIL | 5/2 | 999 | 31 | section order ref=[section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 31px |
| contact-us | 1280 | FAIL | 5/2 | 999 | 31 | section order ref=[section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 31px |
| contact-us | 1536 | FAIL | 5/2 | 999 | 31 | section order ref=[section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 31px |
| testimonials | 375 | FAIL | 8/2 | 999 | 7 | section order ref=[section,section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 7px |
| testimonials | 768 | FAIL | 8/2 | 999 | 2 | section order ref=[section,section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px |
| testimonials | 1024 | FAIL | 8/2 | 999 | 10 | section order ref=[section,section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 10px |
| testimonials | 1280 | FAIL | 8/2 | 999 | 10 | section order ref=[section,section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 10px |
| testimonials | 1536 | FAIL | 8/2 | 999 | 10 | section order ref=[section,section,section,section,section,section,section,div] lena=[section,section]; max box delta 999px; max type delta 10px |

Summary: 0 PASS / 45 cells.
