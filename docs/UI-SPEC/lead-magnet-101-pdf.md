# UI-SPEC/lead-magnet-101-pdf.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of _reference/site/www.savvypro.org/101-digital-skills-pdf-download.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (2 top-level sections)

### Section 1 (id cb180ffa)
- desktop: paddingTop:80px; paddingBottom:100px; backgroundColor:#e5f0f0; position:relative !important; zIndex:2; overflowY:visible
- tablet: paddingTop:80px; paddingBottom:50px; backgroundColor:#e5f0f0; position:relative !important; zIndex:2; overflowY:visible
- mobile: paddingTop:50px; paddingBottom:50px; backgroundColor:#e5f0f0; position:relative !important; zIndex:2; overflowY:visible
    - Row (1 col) align=start/start
      - Column — marginLeft:auto; marginRight:auto
          - Row (2 col) align=center/center
            - Column
              - Box: marginLeft:0; marginTop:0; marginBottom:0; marginRight:10px; paddingTop:0; paddingBottom:30px; position:relative !important; zIndex:2
                - Text: "WELCOME TO PARNELL"
                  - desktop: fontSize=17px fontWeight=400 color=#507b86
                  - mobile: fontSize=14px
                - Box: width:150px; height:2px; backgroundColor:#266a8c; marginBottom:20px
                - Heading: "Get Available Services Now!"
                  - desktop: fontSize=46px fontWeight=600 color=#030303
                  - mobile: fontSize=26px fontWeight=600 color=#030303
                - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla."
                  - desktop: fontSize=18px lineHeight=1.4 color=#706b6b
                  - mobile: fontSize=16px
                - Box: paddingLeft:13px; paddingRight:13px; maxWidth:75%
                - Box: display:block; alignItems:null; justifyContent:null; cursor:pointer; flexDirection:null; flexWrap:null
                - Box: maxWidth:100%; position:absolute !important; bottom:0%; left:0%; paddingTop:30px !important; paddingBottom:30px !important; paddingLeft:30px !important; padding
                  - Text: ""Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, e"
                    - desktop: fontSize=16px lineHeight=1.4
                  - Box: display:flex; alignItems:center
                      - Img: "" alt=""
                        - desktop: width:70px; height:70px; borderRadius:50% 50% 50% 50% 
                    - Box: marginLeft:15px
                      - Heading: "John Anderson"
                        - desktop: fontSize=18px fontWeight=600
                      - Text: "Lorem, ipsum dolor."
                        - desktop: fontSize=13px fontWeight=400 color=#838181
            - Column
                - Img: "" alt=""
                  - desktop: height:550px; objectFit:contain; maxWidth:80%; marginLeft:auto; marginRight:auto; maxHeight:
  - Box: backgroundColor:#c2d6db; position:absolute !important; top:0px; right:0px; zIndex:-1; maxWidth:; width:40%; height:100%

### Section 2 (id 90d0c849)
- desktop: paddingTop:70px; paddingBottom:80px; backgroundColor:#ffffff
- tablet: paddingTop:70px; paddingBottom:50px; backgroundColor:#ffffff
- mobile: paddingTop:50px; paddingBottom:50px; backgroundColor:#ffffff
    - Row (1 col) align=start/start
      - Column — marginLeft:auto; marginRight:auto
        - Row (2 col) align=start/start
          - Column
            - Box: paddingTop:87px !important
              - Heading: "What You Get From Us :"
                - desktop: fontSize=21px fontWeight=600 color=#1c7c94
                - mobile: fontSize=20px fontWeight=600 color=#1c7c94
              - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
                - desktop: fontSize=18px lineHeight=1.4
                - mobile: fontSize=16px lineHeight=1.4
          - Column — marginLeft:auto
            - Box: marginLeft:auto; marginRight:
              - Heading: "Want To Know Details?"
                - desktop: fontSize=21px fontWeight=600 color=#1c7c94
                - mobile: fontSize=20px fontWeight=600 color=#1c7c94
              - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
                - desktop: fontSize=18px lineHeight=1.4
                - mobile: fontSize=16px lineHeight=1.4
              - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
                - desktop: fontSize=18px lineHeight=1.4
                - mobile: fontSize=16px lineHeight=1.4
