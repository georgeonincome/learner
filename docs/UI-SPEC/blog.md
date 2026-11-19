# UI-SPEC/blog.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/blog.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (2 top-level sections)

### Section 1 (id 4246132d)
- desktop: paddingTop:100px; paddingBottom:0px; paddingLeft:0; paddingRight:0; background:; backgroundImage:; backgroundSize:cover; backgroundRepeat:no-repeat; backgroundColor:#fafafa
- tablet: paddingTop:100px; paddingBottom:0px; paddingLeft:0; paddingRight:0; background:; backgroundImage:; backgroundSize:cover; backgroundRepeat:no-repeat; backgroundColor:#fafafa
- mobile: (inherits desktop)
    - Row (2 col) align=start/center
      - Column
        - Box: paddingBottom:50px
          - Heading: "Our Blog"
            - desktop: fontSize=20px fontWeight=700 lineHeight=1.2 color=#3040C4
          - Heading: "Resources for makers and creatives to learn, sell and grow"
            - desktop: fontSize=40px fontWeight=800 lineHeight=1.2 color=#1B164F
            - mobile: fontSize=30px fontWeight=800 lineHeight=1.2 color=#1B164F
          - Heading: "Learn how to grow and scale your online course business using our online course platform. EzyCourse blog is designed to "
            - desktop: fontSize=19px fontWeight=400 lineHeight=1.6 color=#606060
      - Column — alignSelf:end
          - Img: "" alt=""

### Section 2 (id 7a730f39)
- desktop: backgroundColor:#f4f4f4; paddingTop:30px; paddingBottom:50px; paddingLeft:0; paddingRight:0
- tablet: backgroundColor:#f4f4f4; paddingTop:0px; paddingBottom:50px; paddingLeft:0; paddingRight:0
- mobile: (inherits desktop)
    - Row (1 col) align=start/start
      - AllBlogs (dynamic blog card grid)
