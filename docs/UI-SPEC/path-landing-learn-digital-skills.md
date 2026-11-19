# UI-SPEC/path-landing-learn-digital-skills.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/learn-digital-skills.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (9 top-level sections)

### Section 1 (id 1deeae69)
- desktop: display:block; paddingTop:100px; paddingBottom:100px; backgroundImage:; backgroundColor:#090e21; backgroundSize:cover; backgroundPosition:center; background:Image
- tablet: paddingTop:80px; paddingBottom:80px
- mobile: display:block; paddingTop:60px; paddingBottom:60px; backgroundImage:; backgroundColor:#090e21; backgroundSize:auto; backgroundPosition:center; background:Image; overflowX:hidden; overflowY:hidden; visibility:visible
    - Row (1 col) align=none/center
      - Column
          - Heading: ""
          - Heading: ""
            - desktop: fontSize=50px fontFamily=Verdana
            - mobile: fontSize=28px fontFamily=Verdana
          - Text: ""
            - desktop: fontSize=25px lineHeight=48px fontFamily=Verdana color=#d1d5db
            - mobile: fontSize=16px lineHeight=29px fontFamily=Inter color=#d1d5db
          - Row (2 col) align=none/none
            - Column
              - Button: "" link={}
                - desktop: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color
                - mobile: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color; marginTop:20px; marginBottom:20px; borderRadius:5px 5px 5p
            - Column
              - Button: "" link={}
                - desktop: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color
                - mobile: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color; borderRadius:5px 5px 5px 5px

### Section 2 (id 0ac6696a)
- desktop: display:block; background:Color; backgroundColor:#d9d9d9; paddingBottom:50px; minHeight:
- tablet: (inherits desktop)
- mobile: (inherits desktop)
  - Container: background:Color; backgroundColor:#d9d9d9
    - Row (4 col) align=none/none
      - Row (0 col) align=none/none
        - desktop: minHeight:
      - Column — background:Color; backgroundColor:#d9d9d9; &:hover:[object Object]
        - Container: background:Color; backgroundColor:#ffffff; borderRadius:10px 10px 10px 10px; minWidth:; marginBottom:0px; paddingBottom:0px
          - Row (1 col) align=none/none
            - Column — paddingTop:30px
              - Heading: ""
                - desktop: fontSize=16px
          - Img: "" alt=""
          - Heading: ""
          - RichText: ""
          - IconButton: "" link={}
            - desktop: display:flex; gap:5px; alignItems:center; width:fit-content; marginLeft:5; marginRight:auto; flexDirection:row-reverse; fontSize:16px; background:Color; backgroundColor:#00a3ff; borderRadius:5px 5px 5px 5px; marginTop:5p
          - IconButton: "" link={}
            - desktop: display:flex; gap:5px; alignItems:center; width:fit-content; marginLeft:5; marginRight:auto; flexDirection:row-reverse; fontSize:16px; borderRadius:5px 5px 5px 5px; marginTop:5px; marginBottom:5px; paddingTop:10px; paddi
      - Column — background:Color; backgroundColor:#d9d9d9; &:hover:[object Object]
        - Container: background:Color; backgroundColor:#ffffff; borderRadius:10px 10px 10px 10px; minHeight:430px
          - Row (1 col) align=none/none
            - Column — paddingTop:30px
              - Heading: ""
                - desktop: fontSize=16px
          - Img: "" alt=""
          - Heading: ""
          - RichText: ""
          - IconButton: "" link={}
            - desktop: display:flex; gap:3px; alignItems:center; flexDirection:row-reverse; marginTop:5px; marginBottom:5px; marginLeft:5px; marginRight:5px; borderRadius:5px 5px 5px 5px; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; 
          - IconButton: "" link={}
            - desktop: display:flex; gap:3px; alignItems:center; flexDirection:row-reverse; marginTop:5px; marginBottom:5px; marginLeft:5px; marginRight:5px; borderRadius:5px 5px 5px 5px; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; 
      - Column
        - Container: background:Color; backgroundColor:#ffffff; borderRadius:10px 10px 10px 10px
          - Row (1 col) align=none/none
            - Column — background:Color; backgroundColor:#ffffff
              - Heading: ""
                - desktop: fontSize=16px
          - Img: "" alt=""
          - Heading: ""
          - RichText: ""
          - IconButton: "" link={}
            - desktop: display:flex; gap:3px; alignItems:center; flexDirection:row-reverse; marginTop:5px; marginBottom:5px; marginLeft:5px; marginRight:5px; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadiu
          - IconButton: "" link={}
            - desktop: display:flex; gap:3px; alignItems:center; flexDirection:row-reverse; marginTop:5px; marginBottom:5px; marginLeft:5px; marginRight:5px; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px

### Section 3 (id 93103276)
- desktop: display:block; background:Color; backgroundColor:#101b2f; paddingBottom:50px; minHeight:; marginLeft:30px
- tablet: (inherits desktop)
- mobile: (inherits desktop)
  - Container: background:Color; backgroundColor:#101b2f
    - Row (0 col) align=none/none
  - Container: marginTop:100px; marginBottom:200px
    - Row (3 col) align=none/none
      - Column — borderStyle:solid; borderColor:#35a4c0; borderWidth:NaNem
          - Img: "" alt=""
        - RichText: ""
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color; marginBottom:0px; marginLeft:20px; borderRadius:5px 5px 5p
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#101010; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; marginTop:20px; marginBottom:20px; background:Color; marginLeft:20px; border
      - Column
          - Img: "" alt=""
        - RichText: ""
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; marginLeft:20px; background:Color; borderRadius:5px 5px 5px 5px
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; marginLeft:20px; marginTop:20px; marginBottom:20px; borderWidth:1px; borderColo
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; marginLeft:20px; marginTop:20px; marginBottom:20px; borderWidth:1px; borderColo
      - Column
          - Img: "" alt=""
          - RichText: ""
          - Button: "" link={}
            - desktop: color:#fff; backgroundColor:#00a3ff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color; borderRadius:5px 5px 5px 5px
          - Button: "" link={}
            - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; marginTop:20px; marginBottom:20px; marginLeft:0px; borderWidth:1NaNem; borderCo

### Section 4 (id f5a0486b)
- desktop: padding:20px 0 100px; display:block; background:Color; backgroundColor:#d9d9d9; paddingTop:100px; paddingBottom:100px; marginTop:0px; borderWidth:1px; borderColor:#fffafa
- tablet: (inherits desktop)
- mobile: padding:20px 0px 60px
    - Row (0 col) align=start/start
  - Heading: "Get Ready To Join With Us"
    - desktop: fontSize=52px fontWeight=600 textAlign=center
  - Text: "I have an understanding that, even if the work is not perfect, it's a work in progress. And the reason why I'm on Circui"
    - desktop: fontSize=16px fontWeight=400 lineHeight=1.6 color=#070101 textAlign=center
    - mobile: fontSize=15px
  - Button: "Get Started" link={}
    - desktop: color:#000000; backgroundColor:#ff007a; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color; paddingTop:16px; paddingBottom:16px; paddingLeft:40px; 

### Section 5 (id e9608104)
- desktop: display:block; background:Color; backgroundColor:#101b2f
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Heading: ""
          - desktop: color=#d9d9d9
      - Column
        - Heading: ""

### Section 6 (id 1953e989)
- desktop: display:block; background:Color; backgroundColor:#101b2f
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - RichText: ""
          - desktop: color=#94a3b8
      - Column
        - RichText: ""

### Section 7 (id 016be749)
- desktop: display:block; background:Color; backgroundColor:#101b2f
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - RichText: ""

### Section 8 (id 6ea2f99d)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 9 (id 32766ef1)
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
