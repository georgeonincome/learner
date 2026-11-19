# UI-SPEC/testimonials.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/testimonials.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (7 top-level sections)

### Section 1 (id 3cfde334)
- desktop: backgroundColor:#f8f8f8; paddingTop:100px; paddingBottom:100px; overflowX:hidden; overflowY:hidden; position:relative !important; zIndex:1; minHeight:650px; display:block; alignItems:null; flexDirection:null; justifyContent:null; flexWrap:null; clipPath:polygon(0 0, 100% 0, 100% 86%, 0% 100%)
- tablet: backgroundColor:#f8f8f8; paddingTop:60px; paddingBottom:60px; overflowX:hidden; overflowY:hidden; position:relative !important; zIndex:1; minHeight:100%; clipPath:none
- mobile: (inherits desktop)
    - Row (2 col) align=start/center
      - Column
          - Heading: "Why my clients come back for more lessons"
            - desktop: fontSize=60px fontWeight=700 lineHeight=1.2 fontFamily=Quicksand color=#1D1F22
            - mobile: fontSize=35px fontWeight=700 lineHeight=1.2 fontFamily=Quicksand color=#1D1F22
          - Text: "A free virtual class will entirely change your life. So, what are you waiting for."
            - desktop: fontSize=20px fontWeight=400 lineHeight=1.5 fontFamily=Josefin Sans color=#565759
      - Column
          - Box: maxHeight:auto; minWidth:auto; maxWidth:420px; paddingLeft:; marginLeft:auto; position:relative !important; zIndex:1
            - Img: "" alt=""
              - desktop: maxWidth:90%; marginLeft:auto; marginRight:auto
            - Box: position:absolute !important; bottom:0px; right:0px; width:100%; transform:rotate(3.5deg); marginBottom:11px
              - Img: "" alt=""
                - desktop: maxWidth:100%; position:static; bottom:0px; right:0px; width:
  - Box: background:rgb(13 71 211 / 26%); width:210px; height:210px; position:absolute !important; top:-40px; left:-36px; filter:blur(100px); borderRadius:50%; zIndex:-1

### Section 2 (id a418dd2c)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Img: "" alt=""
      - Column
        - Img: "" alt=""

### Section 3 (id ec1f9cc0)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Img: "" alt=""
      - Column
        - Img: "" alt=""

### Section 4 (id b463244f)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Img: "" alt=""
      - Column
        - Img: "" alt=""

### Section 5 (id 4ec82fcd)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Img: "" alt=""
      - Column
        - Img: "" alt=""

### Section 6 (id 6ea2f99d)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 7 (id 32766ef1)
- desktop: paddingTop:40px !important; paddingBottom:40px !important; paddingLeft:0; paddingRight:0; backgroundColor:#122637; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; marginTop:; marginBottom:; display:block; background:Color
- tablet: paddingTop:50px !important
- mobile: (inherits desktop)
  - Container: backgroundColor:#a15959; paddingLeft:; paddingRight:; paddingTop:; paddingBottom:; background:none
    - Row (4 col) align=start/start
      - desktop: marginTop:; backgroundColor:#c39292; background:none
      - Column
          - Heading: "Psycare"
            - desktop: fontSize=24px fontWeight=500 lineHeight=1.2 color=#ffffff
            - mobile: fontSize=21px fontWeight=500 lineHeight=1.2 color=#ffffff textAlign=left
          - Text: ""
            - desktop: color=#000
        - Box: display:flex; alignItems:center; gap:16px; justifyContent:flex-start; paddingTop:24px
          - Img: "" alt=""
            - desktop: width:30px
          - Img: "" alt=""
            - desktop: width:60px
          - Img: "" alt=""
            - desktop: width:40px
      - Column
          - Heading: "Explore Link"
            - desktop: fontSize=19px fontWeight=500 lineHeight=1.2 color=#ffffff
            - mobile: fontSize=15px fontWeight=500 lineHeight=1.2 color=#ffffff textAlign=left
      - Column
        - Box: display:flex; flexDirection:column; alignItems:flex-start; justifyContent:flex-start; flexWrap:null
          - Heading: "Book Appoinment"
            - desktop: fontSize=19px fontWeight=500 lineHeight=1.2 color=#ffffff
            - mobile: fontSize=15px fontWeight=500 lineHeight=1.2 color=#ffffff textAlign=left
          - Box: display:flex; flexDirection:row; alignItems:flex-start
          - Box: display:flex; flexDirection:row; alignItems:flex-start
      - Column
        - Box: display:flex; flexDirection:column; alignItems:center; justifyContent:center; flexWrap:null; borderTopStyle:solid; borderTopWidth:1px; borderTopColor:#a3a3a3; m
          - Heading: "Copyright © 2022 all rights reserved."
            - desktop: fontSize=16px fontWeight=400 lineHeight=1.4 color=#ffffff textAlign=center
    - Row (0 col) align=start/start
  - Box: backgroundColor:#586ed1; background:none; position:absolute !important; before:; top:-268px; zIndex:-1; left:-190px
  - Box: position:absolute !important; top:-205px; right:-120px; transform:rotateZ(52deg)
