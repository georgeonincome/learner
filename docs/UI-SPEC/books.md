# UI-SPEC/books.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/books.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (14 top-level sections)

### Section 1 (id decc9399)
- desktop: display:block; paddingTop:80px; paddingBottom:80px; background:linear-gradient(222deg,#bdbbff1f 34.32%,rgb(233 215 251 / 14%) 64.64%)
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Heading: ""
        - desktop: fontSize=43px textAlign=center

### Section 2 (id cb2af976)
- desktop: display:block; background:Color; backgroundColor:#d9d9d9; paddingBottom:50px; minHeight:
- tablet: (inherits desktop)
- mobile: (inherits desktop)
  - Container: background:Color; backgroundColor:#d9d9d9
    - Row (4 col) align=none/none
      - Row (0 col) align=none/none
        - desktop: minHeight:
      - Column — background:Color; backgroundColor:#d9d9d9; &:hover:[object Object]
        - Container: background:Color; backgroundColor:#ffffff; borderRadius:10px 10px 10px 10px; minWidth:; marginBottom:0px; paddingBottom:0px; borderStyle:solid; borderWidth:1px;
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
        - Container: background:Color; backgroundColor:#ffffff; borderRadius:10px 10px 10px 10px; minHeight:430px; borderStyle:solid; borderWidth:1px; marginTop:10px
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
        - Container: background:Color; backgroundColor:#ffffff; borderRadius:10px 10px 10px 10px; borderStyle:solid; borderWidth:1px; marginTop:10px
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

### Section 3 (id 8bc485ff)
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

### Section 4 (id dc6dfc45)
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

### Section 5 (id 805b3419)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 6 (id 4d1a0057)
- desktop: display:block; background:Color; backgroundColor:#355aa5; marginTop:10px; marginBottom:10px; marginLeft:10px; marginRight:10px; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Heading: ""
          - desktop: color=#f2f1f4 textAlign=center

### Section 7 (id 1f28609f)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 8 (id 121bcef3)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Img: "" alt=""
          - desktop: paddingTop:100px; paddingBottom:100px; paddingLeft:100px; paddingRight:100px

### Section 9 (id b525e6b1)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]

### Section 10 (id d7d637a4)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Button: "" link={}
        - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]

### Section 11 (id 7d772e35)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column

### Section 12 (id 37261d9b)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 13 (id c87a6005)
- desktop: display:block; background:Color; backgroundColor:#355aa5; marginTop:10px; marginBottom:10px; marginLeft:10px; marginRight:10px; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Heading: ""
          - desktop: color=#f2f1f4 textAlign=center

### Section 14 (id 25738cbe)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Button: "" link={}
          - desktop: color:#fff; backgroundColor:#20681e; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; background:Color
