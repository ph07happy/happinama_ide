require.config({
    paths:{
        vs:"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

let editor;
let currentLanguage = "c";

const savedTheme =
    localStorage.getItem("theme") || "dark";

document.body.classList.add(savedTheme);

require(["vs/editor/editor.main"],function(){

    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value:
`#include <stdio.h>

int main()
{
    printf("Happy Coding");
    return 0;
}`,
            language:"c",

            theme:
                savedTheme === "light"
                ? "vs"
                : "vs-dark",

            automaticLayout:true,

            fontSize:16,

            minimap:{
                enabled:true
            },

            scrollBeyondLastLine:false,

            roundedSelection:true,

            wordWrap:"on",

            fontFamily:"Consolas"
        }
    );
});

const runBtn =
    document.getElementById("runBtn");

const output =
    document.getElementById("output");

const status =
    document.getElementById("status");

const themeBtn =
    document.getElementById("themeBtn");

const themePath =
    document.getElementById("themePath");

const undoBtn =
    document.getElementById("undoBtn");

const redoBtn =
    document.getElementById("redoBtn");

const fullscreenBtn =
    document.getElementById("fullscreenBtn");

const clearOutputBtn =
    document.getElementById("clearOutputBtn");

const clearScreenBtn =
    document.getElementById("clearScreenBtn");

const cBtn =
    document.getElementById("cBtn");

const cppBtn =
    document.getElementById("cppBtn");

const pythonBtn =
    document.getElementById("pythonBtn");

const fileName =
    document.getElementById("fileName");

const divider =
    document.getElementById("divider");

const sidebarDivider =
    document.getElementById("sidebarDivider");

const outputContainer =
    document.querySelector(".output-container");

const sidebar =
    document.querySelector(".sidebar");

/* EXECUTE */

function executeProgram(){

    status.innerHTML =
        "<b>Compiling...</b>";

    output.textContent =
`Backend not connected.

Current Language:
${currentLanguage.toUpperCase()}

Next Step:
• FastAPI
• GCC
• G++
• Python Runner`;

    setTimeout(() => {

        status.innerHTML =
            "<b>© 2026 happinama. All rights reserved.</b>";

    },1000);
}

runBtn.addEventListener(
    "click",
    executeProgram
);

document.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.ctrlKey &&
            e.key === "Enter"
        ){
            e.preventDefault();
            executeProgram();
        }
    }
);

/* THEME */

function updateThemeIcon(){

    if(
        document.body.classList.contains("light")
    ){

        themeBtn.textContent = "☼";
    }
    else{

        themeBtn.textContent = "☾";
    }
}

updateThemeIcon();

themeBtn.addEventListener(
    "click",
    ()=>{

        const body = document.body;

        if(
            body.classList.contains("dark")
        ){

            body.classList.remove("dark");
            body.classList.add("light");

            localStorage.setItem(
                "theme",
                "light"
            );

            monaco.editor.setTheme("vs");
        }
        else{

            body.classList.remove("light");
            body.classList.add("dark");

            localStorage.setItem(
                "theme",
                "dark"
            );

            monaco.editor.setTheme("vs-dark");
        }

        updateThemeIcon();
    }
);

/* UNDO */

undoBtn.addEventListener(
    "click",
    ()=>{

        if(editor){

            editor.trigger(
                "",
                "undo"
            );
        }
    }
);

/* REDO */

redoBtn.addEventListener(
    "click",
    ()=>{

        if(editor){

            editor.trigger(
                "",
                "redo"
            );
        }
    }
);

/* LANGUAGE */

function removeLanguageSelection(){

    cBtn.classList.remove("active-lang");
    cppBtn.classList.remove("active-lang");
    pythonBtn.classList.remove("active-lang");
}

cBtn.addEventListener(
    "click",
    ()=>{

        currentLanguage = "c";

        fileName.textContent =
            "main.c";

        removeLanguageSelection();

        cBtn.classList.add("active-lang");

        monaco.editor.setModelLanguage(
            editor.getModel(),
            "c"
        );
    }
);

cppBtn.addEventListener(
    "click",
    ()=>{

        currentLanguage = "cpp";

        fileName.textContent =
            "main.cpp";

        removeLanguageSelection();

        cppBtn.classList.add("active-lang");

        monaco.editor.setModelLanguage(
            editor.getModel(),
            "cpp"
        );
    }
);

pythonBtn.addEventListener(
    "click",
    ()=>{

        currentLanguage = "python";

        fileName.textContent =
            "main.py";

        removeLanguageSelection();

        pythonBtn.classList.add("active-lang");

        monaco.editor.setModelLanguage(
            editor.getModel(),
            "python"
        );
    }
);

/* CLEAR OUTPUT */

clearOutputBtn.addEventListener(
    "click",
    ()=>{

        output.textContent = "";
    }
);

/* CLEAR SCREEN */

clearScreenBtn.addEventListener(
    "click",
    ()=>{

        output.textContent = "";

        if(editor){

            editor.setValue("");
        }
    }
);

/* FULLSCREEN */

fullscreenBtn.addEventListener(
    "click",
    ()=>{

        if(
            !document.fullscreenElement
        ){

            document.documentElement
                .requestFullscreen();
        }
        else{

            document.exitFullscreen();
        }
    }
);

document.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.key === "Escape" &&
            document.fullscreenElement
        ){

            document.exitFullscreen();
        }
    }
);

/* OUTPUT PANEL RESIZE */

let resizingOutput = false;

divider.addEventListener(
    "mousedown",
    ()=>{

        resizingOutput = true;
    }
);

document.addEventListener(
    "mousemove",
    (e)=>{

        if(!resizingOutput) return;

        const width =
            window.innerWidth -
            e.clientX;

        if(
            width > 250 &&
            width < 1000
        ){

            outputContainer.style.width =
                width + "px";
        }
    }
);

document.addEventListener(
    "mouseup",
    ()=>{

        resizingOutput = false;
    }
);

/* SIDEBAR RESIZE */

let resizingSidebar = false;

sidebarDivider.addEventListener(
    "mousedown",
    ()=>{

        resizingSidebar = true;
    }
);

document.addEventListener(
    "mousemove",
    (e)=>{

        if(!resizingSidebar) return;

        const width =
            e.clientX;

        if(
            width > 60 &&
            width < 250
        ){

            sidebar.style.width =
                width + "px";
        }
    }
);

document.addEventListener(
    "mouseup",
    ()=>{

        resizingSidebar = false;
    }
);