# UI-SPEC/lead-magnet-freebies.md — reference measurements from block-tree code

Source: `__NEXT_DATA__` builder.present of raw:freebies.html (captured 2026-11-16/19).
Method: settings.style.desktop/tablet/mobile are literal CSS the reference applies per device.
Audit viewport mapping: 375px→mobile styles; 768px→tablet (fallback desktop); 1024/1280/1536px→desktop.
Grid: Bootstrap .container (max-width 540/720/960/1140/1320 at 576/768/992/1200/1400) + .row (12-col, 24px gutter).

## Section order (16 top-level sections)

### Section 1 (id 6fda077c)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 2 (id 083bd382)
- desktop: paddingTop:100px !important; paddingBottom:100px !important; background:Color; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; before:  content: '';
    position: absolute !important;
    bottom: 0px;
    left: -29px;
    top: auto;
    right: 0px;
    background-image: url('https://letcheck.b-cdn.net/1/cld2oakjo006pka1z3x2t0blj.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;; after:    content: '';
    position: absolute !important;
    bottom: auto;
    right: -30px;
    top: 100px;
    left: auto;
    background-image: url('https://letcheck.b-cdn.net/1/cld2oakjo006pka1z3x2t0blj.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=start/start
      - Column
        - Box: marginBottom:60px !important
          - Heading: "Top Courses"
            - desktop: fontSize=44px fontWeight=700 lineHeight=1.2 fontFamily=Montserrat color=#000000 textAlign=center
            - mobile: fontSize=34px fontWeight=700 lineHeight=1.2 fontFamily=Montserrat color=#000000
          - RichText: ""
            - desktop: textAlign=center
          - Row (3 col) align=start/start
            - Column
              - Box: marginBottom:42px !important; paddingTop:15px !important; paddingBottom:15px !important; paddingLeft:15px !important; paddingRight:15px !important; backgroundCo
                - Box: borderRadius:; marginBottom:20px !important; marginTop:-30px !important
                  - Img: "" alt=""
                    - desktop: borderRadius:6px; width:100%; height:220px; objectFit:cover
                  - Box: marginBottom:14px !important
                    - Heading: "Learn ui ux design"
                      - desktop: fontSize=21px fontWeight=500 lineHeight=1.2 color=#000000
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "64 Online class"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 fontFamily= color=#2c2b2a
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "Unlimited access"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "Limited student"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: marginTop:36px !important; display:flex; flexDirection:null; justifyContent:space-between; alignItems:center; flexWrap:null
                      - Button: "Enroll Now" link={}
                        - desktop: color:#ffffff; backgroundColor:#ba3b42; padding:10px 20px; &:hover:[object Object]; paddingTop:12px !important; paddingBottom:12px !important; paddingLeft:19px !important; paddingRight:19px !important; borderRadius:6px 6
            - Column
              - Box: marginBottom:42px !important; paddingTop:15px !important; paddingBottom:15px !important; paddingLeft:15px !important; paddingRight:15px !important; backgroundCo
                - Box: borderRadius:; marginBottom:20px !important; marginTop:-30px !important
                  - Img: "" alt=""
                    - desktop: borderRadius:6px; width:100%; height:220px; objectFit:cover
                  - Box: marginBottom:14px !important
                    - Heading: "Learn flutter development"
                      - desktop: fontSize=21px fontWeight=500 lineHeight=1.2 fontFamily= color=#000000
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "64 Online class"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 fontFamily= color=#2c2b2a
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "Unlimited access"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "Limited student"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: marginTop:36px !important; display:flex; flexDirection:null; justifyContent:space-between; alignItems:center; flexWrap:null
                      - Button: "Enroll Now" link={}
                        - desktop: color:#ffffff; backgroundColor:#ba3b42; padding:10px 20px; &:hover:[object Object]; paddingTop:12px !important; paddingBottom:12px !important; paddingLeft:19px !important; paddingRight:19px !important; borderRadius:6px 6
            - Column
              - Box: marginBottom:42px !important; paddingTop:15px !important; paddingBottom:15px !important; paddingLeft:15px !important; paddingRight:15px !important; backgroundCo
                - Box: borderRadius:; marginBottom:20px !important; marginTop:-30px !important
                  - Img: "" alt=""
                    - desktop: borderRadius:6px; width:100%; height:220px; objectFit:cover
                  - Box: marginBottom:14px !important
                    - Heading: "Learn c/c++ programming"
                      - desktop: fontSize=21px fontWeight=500 lineHeight=1.2 color=#000000
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "64 Online class"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "Unlimited access"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: display:flex; alignItems:center; gap:10px; marginBottom:16px !important
                    - Heading: "Limited student"
                      - desktop: fontSize=17px fontWeight=400 lineHeight=1.2 color=#2c2b2a
                  - Box: marginTop:36px !important; display:flex; flexDirection:null; justifyContent:space-between; alignItems:center; flexWrap:null
                      - Button: "Enroll Now" link={}
                        - desktop: color:#ffffff; backgroundColor:#ba3b42; padding:10px 20px; &:hover:[object Object]; paddingTop:12px !important; paddingBottom:12px !important; paddingLeft:19px !important; paddingRight:19px !important; borderRadius:6px 6

### Section 3 (id ab3b7cd6)
- desktop: paddingTop:100px !important; paddingBottom:100px !important; backgroundColor:#dae7e7; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; before:
    content: '';
    position: absolute !important;
    bottom: 0px;
    left: -29px;
    top: auto;
    right: 0px;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;; after:
    content: '';
    position: absolute !important;
    bottom: auto;
    right: -30px;
    top: 100px;
    left: auto;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;; background:Color
- tablet: (inherits desktop)
- mobile: paddingTop:100px !important; paddingBottom:100px !important; backgroundColor:#fffffa; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; before:
    content: '';
    position: absolute !important;
    bottom: 0px;
    left: -29px;
    top: auto;
    right: 0px;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;; after:
    content: '';
    position: absolute !important;
    bottom: auto;
    right: -30px;
    top: 0px;
    left: auto;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;
    - Row (2 col) align=start/center
      - Column
        - Box: position:relative !important; zIndex:1; before:
    content: '';
    position: absolute !important;
    top: auto;
    right: -20px;
    bottom: -20px;
  
          - Img: "" alt=""
      - Column
            - Heading: "About learning platform"
              - desktop: fontSize=44px fontWeight=700 lineHeight=1.2 fontFamily=Montserrat color=#121111 textAlign=left
              - mobile: fontSize=29px fontWeight=700 lineHeight=1.2 fontFamily=Montserrat color=#121111 textAlign=left
            - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
              - desktop: fontSize=18px fontWeight=400 lineHeight=1.5 color=#000000 textAlign=left
            - Box: marginBottom:32px !important
              - Box: display:flex; alignItems:center; gap:12px; marginBottom:14px !important
                - Heading: "Lorem Ipsum is simply dummy text dummy text"
                  - desktop: fontSize=17px fontWeight=500 lineHeight=1.2 color=#323539
              - Box: display:flex; alignItems:center; gap:12px; marginBottom:14px !important
                - Heading: "Lorem Ipsum is simply dummy text dummy text"
                  - desktop: fontSize=17px fontWeight=500 lineHeight=1.2 fontFamily= color=#323539
              - Box: display:flex; alignItems:center; gap:12px; marginBottom:14px !important
                - Heading: "Lorem Ipsum is simply dummy text dummy text"
                  - desktop: fontSize=17px fontWeight=500 lineHeight=1.2 fontFamily= color=#323539
              - Box: display:flex; alignItems:center; gap:12px; marginBottom:0px !important
                - Heading: "Lorem Ipsum is simply dummy text dummy text"
                  - desktop: fontSize=17px fontWeight=500 lineHeight=1.2 color=#323539
            - Button: "Browse courses" link={}
              - desktop: color:#ffffff; backgroundColor:#ba3b42; padding:10px 20px; &:hover:[object Object]; fontFamily:; fontWeight:400; fontSize:17px; lineHeight:1.2; display:flex; alignItems:center; justifyContent:center; paddingTop:16px !imp
              - mobile: color:#ffffff; backgroundColor:#ba3b42; padding:10px 20px; &:hover:[object Object]; fontFamily:Quicksand; fontWeight:400; fontSize:17px; lineHeight:1.2; display:flex; alignItems:center; justifyContent:center; paddingTop:

### Section 4 (id c1b07ee2)
- desktop: display:block; background:Color; backgroundColor:#134c9d
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Heading: ""
          - desktop: fontSize=40px color=#fdfdfd textAlign=center

### Section 5 (id a0a11942)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - Column
        - Text: ""
          - desktop: fontSize=24px fontFamily= color=#000 textAlign=center

### Section 6 (id 19e73ef2)
- desktop: paddingTop:100px; paddingBottom:100px; paddingLeft:0; paddingRight:0; backgroundColor:#dae7e7; display:block; background:Color
- tablet: paddingTop:50px; paddingBottom:50px; paddingLeft:0; paddingRight:0; backgroundColor:#f9f9f9
- mobile: (inherits desktop)
    - Row (3 col) align=start/start
      - Column
        - Box: maxWidth:370px
            - Img: "" alt=""
              - desktop: height:330px; objectFit:cover
          - Box: backgroundColor:rgb(255, 255, 255); paddingTop:20px !important; paddingBottom:20px !important; paddingLeft:20px !important; paddingRight:20px !important; paddin
            - Text: "How to get your first 1000 subscriber fast"
              - desktop: fontSize=20px fontWeight=400 lineHeight=1.6 fontFamily='Montserrat' color=rgba(51,51,51,1) textAlign=left letterSpacing=0.05em
            - Button: "Read More" link={}
              - desktop: color:#fff; backgroundColor:#3b3b3b; padding:10px 20px; &:hover:[object Object]; fontFamily:'Montserrat'; fontWeight:500; fontSize:17px; paddingLeft:20px; paddingRight:20px; height:40px
      - Column
        - Box: maxWidth:370px
            - Img: "" alt=""
              - desktop: height:330px; objectFit:cover
          - Box: backgroundColor:rgb(255, 255, 255); paddingTop:20px !important; paddingBottom:20px !important; paddingLeft:20px !important; paddingRight:20px !important; paddin
            - Text: "Still my system to create 6 months of content in 7 days"
              - desktop: fontSize=20px fontWeight=400 lineHeight=1.6 fontFamily='Montserrat' color=rgba(51,51,51,1) textAlign=left letterSpacing=0.05em
            - Button: "Read More" link={}
              - desktop: color:#fff; backgroundColor:#3b3b3b; padding:10px 20px; &:hover:[object Object]; fontFamily:'Montserrat'; fontWeight:500; fontSize:17px; paddingLeft:20px; paddingRight:20px; height:40px
      - Column
        - Box: maxWidth:370px
            - Img: "" alt=""
              - desktop: height:330px; objectFit:cover
          - Box: backgroundColor:rgb(255, 255, 255); paddingTop:20px !important; paddingBottom:20px !important; paddingLeft:20px !important; paddingRight:20px !important; paddin
            - Text: "56 of the best tools for running your online business"
              - desktop: fontSize=20px fontWeight=400 lineHeight=1.6 fontFamily='Montserrat' color=rgba(51,51,51,1) textAlign=left letterSpacing=0.05em
            - Button: "Read More" link={}
              - desktop: color:#fff; backgroundColor:#3b3b3b; padding:10px 20px; &:hover:[object Object]; fontFamily:'Montserrat'; fontWeight:500; fontSize:17px; paddingLeft:20px; paddingRight:20px; height:40px

### Section 7 (id 2d4b8697)
- desktop: display:block; background:Color; backgroundColor:#13193e
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (1 col) align=none/none
      - desktop: background:Color; backgroundColor:#0a103e
      - Column
        - Heading: ""
          - desktop: fontSize=77px color=#f5f5f8 textAlign=center

### Section 8 (id 454b4e4f)
- desktop: paddingTop:100px; paddingBottom:100px; paddingLeft:0; paddingRight:0; position:relative !important; zIndex:2; display:block
- tablet: (inherits desktop)
- mobile: clipPath:0
    - Row (1 col) align=start/start
      - Column
        - Row (2 col) align=start/start
          - Column
            - Box: position:relative !important; zIndex:2
                - Img: "" alt=""
                  - desktop: borderRadius:50% 50% 50% 50%; width:; height:450px; objectFit:cover; maxWidth:450px; maxHeight:
              - Box: position:absolute !important; width:80%; height:100%; top:2px; left:-25px; zIndex:-1; maxWidth:
                - Img: "" alt=""
              - Box: width:70px; height:70px; bottom:0px; right:42px; position:absolute !important
                - Img: "" alt=""
          - Column
              - Text: "Glad to meet you!"
                - desktop: fontSize=16px fontWeight=400 lineHeight=1.2 color=#0E485F
              - Heading: "About MORGAN"
                - desktop: fontSize=37px fontWeight=600 fontFamily=CascadiaCode-Regular color=#121212
                - mobile: fontSize=32px fontWeight=600 fontFamily=CascadiaCode-Regular color=#121212
              - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
                - desktop: fontSize=18px fontWeight=400 lineHeight=1.6 color=#000000
                - mobile: fontSize=17px fontWeight=400 lineHeight=1.6 color=#000000
              - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
                - desktop: fontSize=18px fontWeight=500 lineHeight=1.6 color=#000000
                - mobile: fontSize=17px fontWeight=500 lineHeight=1.6 color=#000000
              - Box: display:flex; alignItems:flex-start; justifyContent:flex-start
                - Button: "Read More" link={}
                  - desktop: color:#ffffff; backgroundColor:#0E485F; padding:10px 20px; &:hover:[object Object]; paddingTop:20px; paddingBottom:20px; paddingLeft:40px; paddingRight:40px; borderRadius:35px 35px 35px 35px; fontSize:17px; fontWeight:50
  - Box: backgroundColor:rgb(247,247,247); width:100%; height:100%; position:absolute !important; top:0px; right:0px; zIndex:-1; clipPath:polygon(0px 0px, 100% 10%, 100%

### Section 9 (id 660c4b1b)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 10 (id c9c62000)
- desktop: paddingTop:100px !important; paddingBottom:100px !important; backgroundColor:rgb(255 255 255); borderBottom:; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; before:    content: '';
    position: absolute !important;
    bottom: 0px;
    left: -29px;
    top: auto;
    right: 0px;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;; after:
    content: '';
    position: absolute !important;
    bottom: auto;
    right: -30px;
    top: 100px;
    left: auto;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;
- tablet: (inherits desktop)
- mobile: paddingTop:100px !important; paddingBottom:100px !important; backgroundColor:rgb(255 255 255); borderBottom:; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; before:    content: '';
    position: absolute !important;
    bottom: 0px;
    left: -29px;
    top: auto;
    right: 0px;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;; after:
    content: '';
    position: absolute !important;
    bottom: auto;
    right: -30px;
    top: 0px;
    left: auto;
    background-image: url('https://letcheck.b-cdn.net/1/cld2makdu007ckh1zdeehgunl.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: scroll;
    background-position: center;
    width: 90px;
    height: 90px;
    - Row (1 col) align=start/start
      - Column — marginLeft:auto; marginRight:auto
        - Box: marginBottom:60px !important
          - Heading: "Students review"
            - desktop: fontSize=44px fontWeight=700 lineHeight=1.2 fontFamily=Montserrat color=#000000
            - mobile: fontSize=34px fontWeight=700 lineHeight=1.2 fontFamily=Montserrat color=#000000
          - Box: backgroundColor:#275286; width:370px; height:4px
          - Row (2 col) align=start/start
            - Column
              - Box: paddingTop:26px !important; paddingBottom:26px !important; paddingLeft:26px !important; paddingRight:26px !important; boxShadow:rgba(149, 157, 165, 0.2) 0px 8px
                - Box: display:flex; alignItems:center; justifyContent:space-between; gap:18px; flexDirection:null; flexWrap:null; paddingBottom:22px !important
                  - Box: display:flex; flexDirection:null; justifyContent:flex-start; alignItems:center; flexWrap:null; gap:28px
                    - Box: width:50px; height:50px; backgroundColor:; objectFit:cover; borderRadius:
                      - Img: "" alt=""
                        - desktop: objectFit:cover; borderRadius:10px 10px 10px 10px 
                      - Heading: "Anisul islam"
                        - desktop: fontSize=19px fontWeight=600 lineHeight=1.2 fontFamily=Quicksand color=#2f2d2d
                      - Heading: "Student"
                        - desktop: fontSize=17px fontWeight=500 lineHeight=1.2 fontFamily=Quicksand color=#504949
                  - Box: display:flex; alignItems:center; justifyContent:flex-start; gap:6px
                - Text: ""Morbi sollicitudin tempus nisl quis ultricies. Duis rutrum, tellus vel eleifend rutrum, nibh malesuada tortor, at dictu"
                  - desktop: fontSize=17px fontWeight=400 lineHeight=1.5 fontFamily=Quicksand color=#000000 textAlign=left
                  - mobile: fontSize=17px fontWeight=400 lineHeight=1.5 fontFamily=Quicksand color=#141619 textAlign=left
            - Column
              - Box: paddingTop:26px !important; paddingBottom:26px !important; paddingLeft:26px !important; paddingRight:26px !important; boxShadow:rgba(149, 157, 165, 0.2) 0px 8px
                - Box: display:flex; alignItems:center; justifyContent:space-between; gap:18px; flexDirection:null; flexWrap:null; paddingBottom:22px !important
                  - Box: display:flex; flexDirection:null; justifyContent:flex-start; alignItems:center; flexWrap:null; gap:28px
                    - Box: width:50px; height:50px; backgroundColor:; objectFit:cover; borderRadius:
                      - Img: "" alt=""
                        - desktop: objectFit:cover; borderRadius:10px 10px 10px 10px 
                      - Heading: "Adnan chowdhury"
                        - desktop: fontSize=19px fontWeight=600 lineHeight=1.2 fontFamily=Quicksand color=#2f2d2d
                      - Heading: "Student"
                        - desktop: fontSize=17px fontWeight=500 lineHeight=1.2 fontFamily=Quicksand color=#504949
                  - Box: display:flex; alignItems:center; justifyContent:flex-start; gap:6px
                - Text: ""Morbi sollicitudin tempus nisl quis ultricies. Duis rutrum, tellus vel eleifend rutrum, nibh malesuada tortor, at dictu"
                  - desktop: fontSize=17px fontWeight=400 lineHeight=1.5 fontFamily=Quicksand color=#000000 textAlign=left
                  - mobile: fontSize=17px fontWeight=400 lineHeight=1.5 fontFamily=Quicksand color=#141619 textAlign=left

### Section 11 (id a9f7bb4c)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (2 col) align=none/none
      - Column
        - Img: "" alt=""
      - Column
        - Img: "" alt=""

### Section 12 (id 5171cfa3)
- desktop: paddingTop:100px; paddingBottom:100px; backgroundColor:#ffffff; overflowX:hidden; overflowY:hidden
- tablet: paddingTop:60px; paddingBottom:60px; backgroundColor:#ffffff; overflowX:hidden; overflowY:hidden
- mobile: (inherits desktop)
    - Row (1 col) align=start/start
      - Column

### Section 13 (id a9975d65)
- desktop: background:; backgroundImage:url(https://letcheck.b-cdn.net/1/clczuz3gg006gdh1zbcxl0k6t.jpg); backgroundSize:cover; backgroundPosition:center; backgroundRepeat:no-repeat; backgroundBlendMode:normal; backgroundAttachment:fixed; paddingTop:90px !important; paddingBottom:100px !important; marginTop:; marginBottom:; position:relative !important; zIndex:1; overflowX:hidden; overflowY:hidden; before:z-index: -1;
background-color: rgba(0, 0, 0, 0.8);
position: absolute !important;
content: "";
top: 0px;
left: 0px;
right: 0px;
bottom: 0px;

- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Heading: ""
      - desktop: fontSize=49px color=#ffffff textAlign=center

### Section 14 (id b85451f9)
- desktop: paddingTop:100px; paddingBottom:100px; paddingLeft:0; paddingRight:0; backgroundColor:#f5f8fc; position:relative !important; before:position:absolute;
content:"";
width:34%;
top:0;
right:0;
height:100%;
background-color:#1b3764;; display:block
- tablet: paddingTop:70px; paddingBottom:70px; paddingLeft:0; paddingRight:0; backgroundColor:#f5f8fc; position:relative !important; before:position:absolute;
content:"";
width:34%;
top:0;
right:0;
height:100%;
background-color:#1b3764;
display:none;
- mobile: paddingTop:50px; paddingBottom:50px; paddingLeft:0; paddingRight:0; backgroundColor:#f5f8fc; position:relative !important; before:position:absolute;
content:"";
width:34%;
top:0;
right:0;
height:100%;
background-color:#1b3764;
display:none;
    - Row (2 col) align=start/center
      - Column
          - Heading: "Hi! I am Mushfik Ahmed"
            - desktop: fontSize=20px fontWeight=600 fontFamily='Roboto', sans-serif color=#1b3764
            - mobile: fontSize=18px fontWeight=600 fontFamily='Roboto', sans-serif color=#1b3764
          - Heading: "Want to start and grow your online business? I will help you."
            - desktop: fontSize=40px fontWeight=700 fontFamily='Roboto', sans-serif color=#1b3764
            - mobile: fontSize=32px fontWeight=700 fontFamily='Roboto', sans-serif color=#1b3764
          - Text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis! Iste debitis id nulla, nesciunt minus enim, ea"
            - desktop: lineHeight=1.7 fontFamily='Roboto', sans-serif color=#1b3764
          - Box: textAlign:left; marginTop:30px
            - Button: "More know about me" link={}
              - desktop: color:#1b3764; backgroundColor:#ffca42; padding:10px 20px; &:hover:[object Object]; paddingTop:16px !important; paddingBottom:16px !important; paddingLeft:32px !important; paddingRight:32px !important; textTransform:capi
              - mobile: color:#1b3764; backgroundColor:#ffca42; padding:10px 20px; &:hover:[object Object]; paddingTop:13px !important; paddingBottom:13px !important; paddingLeft:26px !important; paddingRight:26px !important; textTransform:capi
      - Column
        - Box: position:relative !important; zIndex:1
          - Box: backgroundColor:#f9fbff; maxWidth:400px; marginLeft:auto; marginRight:auto; boxShadow:rgba(0, 0, 0, 0.35) 0px 5px 15px
            - Img: "" alt=""
              - desktop: maxWidth:350px; marginLeft:auto; marginRight:auto

### Section 15 (id 6ea2f99d)
- desktop: display:block
- tablet: (inherits desktop)
- mobile: (inherits desktop)
    - Row (0 col) align=none/none

### Section 16 (id 32766ef1)
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
