# UI-SPEC/all-products.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/all-products.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (2 top-level sections)

### Section 1 (id 60224b03)
- desktop: paddingTop:100px; paddingBottom:0px; paddingLeft:0; paddingRight:0; position:relative !important; zIndex:1px; overflowX:hidden; overflowY:hidden; background:#fafafa
- tablet: paddingTop:70px; paddingBottom:0px; paddingLeft:0; paddingRight:0; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; background:#FEFEFE
- mobile: paddingTop:50px; paddingBottom:0px; paddingLeft:0; paddingRight:0; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; background:#FEFEFE
    - Row (2 col) align=start/center
      - desktop: maxWidth:; borderRadius:17px 0px 0px 0px
      - Column
        - Box: paddingBottom:30px
          - Box: marginBottom:20px; position:relative !important; zIndex:1; width:fit-content
            - Heading: "All Products"
              - desktop: fontSize=22px fontWeight=700 color=#F8CF61
              - mobile: fontSize=18px fontWeight=700 color=#F8CF61
            - Box: width:42px; position:absolute !important; top:-10px; right:-60px
              - Img: "" alt=""
          - Heading: "What would You Like to Learn Today?&nbsp;"
            - desktop: fontSize=51px fontWeight=800 lineHeight=1.2 color=#1B164F
            - mobile: fontSize=38px fontWeight=800 lineHeight=1.2 color=#1B164F
          - Text: "Get practical knowledge to help you build your business, get more customer and grow."
            - desktop: fontSize=16px fontWeight=400 color=#606060
      - Column
        - Img: "" alt=""
  - Box: position:absolute !important; width:560px; top:0px; right:0px; opacity:0.1 !important; zIndex:-1
    - Img: "" alt=""

### Section 2 (id 93769849)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
