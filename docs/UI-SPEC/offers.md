# UI-SPEC/offers.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/offers.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (3 top-level sections)

### Section 1 (id 7e773aad)
- desktop: display:block; paddingTop:50px; paddingBottom:50px; paddingLeft:0; paddingRight:0; background:Color; backgroundColor:#fdfdfd
- tablet: (inherits desktop)
- mobile: display:block; paddingTop:50px; paddingBottom:50px; backgroundColor:#fdfdfd
    - Row (1 col) align=none/none
      - Column
        - Box: marginBottom:30px
          - Heading: ""
            - desktop: fontSize=52px fontWeight=700 fontFamily=Inter color=#555555 textAlign=center
            - mobile: fontSize=28px fontWeight=700 fontFamily=Inter color=#555555 textAlign=center
          - Text: ""
            - desktop: fontWeight=400 lineHeight=1.6 fontFamily=Inter color=#777777 textAlign=center
        - Row (1 col) align=none/none
          - Column
            - Box: display:flex; alignItems:center; justifyContent:center; columnGap:40px; flexWrap:wrap; background:Color; backgroundColor:#163042; paddingTop:23px; paddingBottom
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px ; width:145px;
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:contain
                - Button: "" link={}
                  - desktop: color:#010101; backgroundColor:#ffffff; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:12px; fontFamily:Georgia; textAlign:center; backgroundImage:; ba
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:contain
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:12px; backgroundImage:; background:none; fontFamily:Georgia; lineHeight
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:cover; width:124px; paddingTop:0px; paddingBottom:0px; background:none; backgroundColor:; backgroundImage:; display:block; flexDirection:
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:12px; lineHeight:11px; fontFamily:Georgia; textAlign:center; background
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:contain
                - Button: "" link={}
                  - desktop: color:#0d0d0d; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:12px; textAlign:center; backgroundImage:; background:none; paddingTop:0
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:cover; width:114px
                - Button: "" link={}
                  - desktop: color:#0d0d0d; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:12px; textAlign:center; backgroundImage:; background:none; paddingTop:0
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:contain
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:13px; fontFamily:Georgia; textAlign:center; backgroundImage:; backgroun
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:cover; width:89px; transform:translateY(0%) skewY(0deg)
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:12px; fontFamily:Georgia; backgroundImage:; background:none; paddingTop
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:contain
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:13px; fontFamily:Georgia; backgroundImage:; background:none; paddingTop
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:contain
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:14px; fontFamily:Georgia; backgroundImage:; background:none; paddingTop
              - Box: background:Color; backgroundColor:#ffffff; paddingTop:10px; paddingBottom:10px; paddingLeft:10px; paddingRight:10px; borderRadius:4px 4px 4px 4px; width:145px; 
                - Img: "" alt=""
                  - desktop: height:30px; objectFit:cover
                - Button: "" link={}
                  - desktop: color:#000000; backgroundColor:; padding:10px 20px; display:inline-flex; alignItems:center; justifyContent:center; &:hover:[object Object]; fontSize:14px; fontFamily:Georgia; backgroundImage:; background:none; paddingTop

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
