# UI-SPEC/path-landing-build-expert.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/build-your-expert-business.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (7 top-level sections)

### Section 1 (id 99936c3e)
- desktop: display:block; paddingTop:100px; paddingBottom:100px; backgroundImage:; backgroundColor:#090e21; backgroundSize:cover; backgroundPosition:center; background:Image
- tablet: paddingTop:80px; paddingBottom:80px
- mobile: display:block; paddingTop:60px; paddingBottom:60px; backgroundImage:; backgroundColor:#090e21; backgroundSize:auto; backgroundPosition:center; background:Image; overflowX:hidden; overflowY:hidden; visibility:visible
    - Row (2 col) align=none/center
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
      - Column

### Section 2 (id de000e7a)
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
            - desktop: display:flex; gap:5px; alignItems:center; width:fit-content; marginLeft:10; marginRight:10auto; flexDirection:row-reverse; fontSize:16px; background:Color; backgroundColor:#00a3ff; borderRadius:5px 5px 5px 5px; marginTop
          - IconButton: "" link={}
            - desktop: display:flex; gap:5px; alignItems:center; width:fit-content; marginLeft:5; marginRight:5auto; flexDirection:row-reverse; fontSize:16px; borderRadius:5px 5px 5px 5px; marginTop:5px; marginBottom:5px; paddingTop:10px; padd
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

### Section 3 (id 85c21b49)
- desktop: display:block; background:Color; backgroundColor:#101b2f; paddingBottom:50px; minHeight:; marginLeft:30px
- tablet: (inherits desktop)
- mobile: (inherits desktop)
  - Container: background:Color; backgroundColor:#101b2f
    - Row (0 col) align=none/none
  - Container: marginTop:100px; marginBottom:200px
    - Row (3 col) align=none/none
      - Column
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

### Section 4 (id 0c3de293)
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

### Section 5 (id 0b5cbfe0)
- desktop: display:block; background:Color; backgroundColor:#101b2f
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Heading: ""
          - desktop: color=#d9d9d9
      - Column
        - Heading: ""

### Section 6 (id 09f2c138)
- desktop: display:block; background:Color; backgroundColor:#101b2f
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - RichText: ""
          - desktop: color=#94a3b8
      - Column
        - RichText: ""

### Section 7 (id b04412ef)
- desktop: display:block; background:Color; backgroundColor:#101b2f
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - RichText: ""
