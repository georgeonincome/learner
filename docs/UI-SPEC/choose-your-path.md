# UI-SPEC/choose-your-path.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/choose-your-path.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (3 top-level sections)

### Section 1 (id c63177d0)
- desktop: backgroundColor:#f4f0ff; paddingTop:80px !important; paddingBottom:80px !important; display:block
- tablet: (inherits desktop)
- mobile: backgroundColor:#f4f0ff; paddingTop:60px !important; paddingBottom:60px !important
    - Row (1 col) align=start/start
      - Column
          - Heading: "Do not wait for Tomorrow!"
            - desktop: fontSize=32px fontWeight=700 lineHeight=1.2 color=#231f1f textAlign=left
            - mobile: fontSize=24px fontWeight=700 lineHeight=1.2 color=#231f1f textAlign=left
          - Img: "" alt=""
            - desktop: maxWidth:100px; marginBottom:20px !important
    - Row (3 col) align=center/start
      - Column
        - Box: borderRadius:    ; marginBottom:20px !important
          - Img: "" alt=""
            - desktop: objectFit:cover; height:160px; borderRadius:    
          - Box: backgroundColor:#ffffff; position:relative !important; height:150px
            - Box: paddingTop:42px !important; display:flex; alignItems:center; justifyContent:center; flexDirection:column
              - Heading: "Personalized Nutrition Plan"
                - desktop: fontWeight=600 lineHeight=1.2 color=#464444 textAlign=center
              - Button: "More Info" link={}
                - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; &:hover:[object Object]; fontWeight:400; lineHeight:1.2; paddingTop:15px !important; paddingBottom:15px !important; paddingLeft:24px !important; paddingRight:24px !imp
                - mobile: color:#fff; backgroundColor:#000; padding:10px 20px; &:hover:[object Object]; fontWeight:400; lineHeight:1.2; paddingTop:14px !important; paddingBottom:14px !important; paddingLeft:22px !important; paddingRight:22px !imp
      - Column
        - Box: borderRadius:    ; marginBottom:20px !important
          - Img: "" alt=""
            - desktop: objectFit:cover; height:160px; borderRadius:    
          - Box: backgroundColor:#ffffff; position:relative !important; height:150px
            - Box: paddingTop:42px !important; display:flex; alignItems:center; justifyContent:center; flexDirection:column
              - Heading: "Personalized Exercise Program"
                - desktop: fontWeight=600 lineHeight=1.2 color=#464444 textAlign=center
              - Button: "More Info" link={}
                - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; &:hover:[object Object]; fontWeight:400; lineHeight:1.2; paddingTop:15px !important; paddingBottom:15px !important; paddingLeft:24px !important; paddingRight:24px !imp
                - mobile: color:#fff; backgroundColor:#000; padding:10px 20px; &:hover:[object Object]; fontWeight:400; lineHeight:1.2; paddingTop:14px !importan; paddingBottom:14px !importan; paddingLeft:22px !important; paddingRight:22px !impor
      - Column
        - Box: borderRadius:    ; marginBottom:20px !important
          - Img: "" alt=""
            - desktop: objectFit:cover; height:160px; borderRadius:    
          - Box: backgroundColor:#ffffff; position:relative !important; height:150px
            - Box: paddingTop:42px !important; display:flex; alignItems:center; justifyContent:center; flexDirection:column
              - Heading: "Individual Routine Program"
                - desktop: fontWeight=600 lineHeight=1.2 color=#464444 textAlign=center
              - Button: "More Info" link={}
                - desktop: color:#fff; backgroundColor:#000; padding:10px 20px; &:hover:[object Object]; fontWeight:400; lineHeight:1.2; paddingTop:15px !important; paddingBottom:15px !important; paddingLeft:24px !important; paddingRight:24px !imp
                - mobile: color:#fff; backgroundColor:#000; padding:10px 20px; &:hover:[object Object]; fontWeight:400; lineHeight:1.2; paddingTop:14px !important; paddingBottom:14px !important; paddingLeft:22px !important; paddingRight:22px !imp

### Section 2 (id 6ea2f99d)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 3 (id 32766ef1)
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
