const fullscreenBtn=
    document.getElementById("fullscreenBtn");

const divider=
    document.getElementById("divider");

const outputContainer=
    document.querySelector(".output-container");

let previousOutputWidth="420px";

fullscreenBtn.addEventListener("click",()=>{

    if(!document.fullscreenElement){

        previousOutputWidth=
            outputContainer.style.width||
            "420px";

        document.documentElement
            .requestFullscreen();

    }else{

        document.exitFullscreen();
    }
});

document.addEventListener(
    "fullscreenchange",
    ()=>{

        if(!document.fullscreenElement){

            outputContainer.style.width=
                previousOutputWidth;
        }

        if(window.editor){

            setTimeout(()=>{

                window.editor.layout();

            },100);
        }
    }
);

document.addEventListener(
    "keydown",
    e=>{

        if(
            e.key==="Escape" &&
            document.fullscreenElement
        ){

            document.exitFullscreen();
        }
    }
);

let resizingOutput=false;

divider.addEventListener(
    "mousedown",
    ()=>{

        resizingOutput=true;
        document.body.style.userSelect="none";
    }
);

document.addEventListener(
    "mousemove",
    e=>{

        if(!resizingOutput) return;

        const width=
            window.innerWidth-
            e.clientX;

        if(
            width>250 &&
            width<1000
        ){

            outputContainer.style.width=
                width+"px";

            if(window.editor){

                window.editor.layout();
            }
        }
    }
);

document.addEventListener(
    "mouseup",
    ()=>{

        resizingOutput=false;
        document.body.style.userSelect="";
    }
);