require.config({
    paths:{
        vs:"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

let editor;
let currentLanguage="c";

const templates={
    c:`#include <stdio.h>

int main()
{
    printf("Happy Coding");
    return 0;
}`,
    cpp:`#include <iostream>
using namespace std;

int main()
{
    cout<<"Happy Coding";
    return 0;
}`,
    java:`public class Main
{
    public static void main(String[] args)
    {
        System.out.println("Happy Coding");
    }
}`,
    python:`print("Happy Coding")`
};

const languageBuffers={
    c:templates.c,
    cpp:templates.cpp,
    java:templates.java,
    python:templates.python
};

const savedTheme=
    localStorage.getItem("theme")||"dark";

document.body.classList.add(savedTheme);

const runBtn=document.getElementById("runBtn");
const output=document.getElementById("output");
const status=document.getElementById("status");
const themeBtn=document.getElementById("themeBtn");
const undoBtn=document.getElementById("undoBtn");
const redoBtn=document.getElementById("redoBtn");
const clearOutputBtn=document.getElementById("clearOutputBtn");
const clearScreenBtn=document.getElementById("clearScreenBtn");

const cBtn=document.getElementById("cBtn");
const cppBtn=document.getElementById("cppBtn");
const javaBtn=document.getElementById("javaBtn");
const pythonBtn=document.getElementById("pythonBtn");

const fileName=document.getElementById("fileName");

require(["vs/editor/editor.main"],()=>{

    editor=monaco.editor.create(
        document.getElementById("editor"),
        {
            value:templates.c,
            language:"c",
            theme:savedTheme==="light"
                ?"vs"
                :"vs-dark",
            automaticLayout:true,
            fontSize:18,
            minimap:{enabled:true},
            scrollBeyondLastLine:false,
            roundedSelection:true,
            wordWrap:"on",
            fontFamily:"Consolas"
        }
    );

    window.editor=editor;

    editor.addCommand(
        monaco.KeyMod.CtrlCmd|
        monaco.KeyCode.Enter,
        ()=>{
            executeProgram();
        }
    );
});

function executeProgram(){

    status.innerHTML=
        "<b>Compiling...</b>";

    output.textContent=
`Backend not connected.

Language: ${currentLanguage.toUpperCase()}

Next Step:
• FastAPI
• GCC
• G++
• Java
• Python`;

    setTimeout(()=>{

        status.innerHTML=
        "<b>© 2026 happinama. All rights reserved.</b>";

    },1000);
}

runBtn.addEventListener(
    "click",
    executeProgram
);

function updateThemeIcon(){

    themeBtn.textContent=
        document.body.classList.contains("light")
        ?"☼"
        :"☾";
}

updateThemeIcon();

themeBtn.addEventListener("click",()=>{

    if(document.body.classList.contains("dark")){

        document.body.classList.replace(
            "dark",
            "light"
        );

        localStorage.setItem(
            "theme",
            "light"
        );

        monaco.editor.setTheme("vs");

    }else{

        document.body.classList.replace(
            "light",
            "dark"
        );

        localStorage.setItem(
            "theme",
            "dark"
        );

        monaco.editor.setTheme("vs-dark");
    }

    updateThemeIcon();
});

undoBtn.addEventListener("click",()=>{

    if(editor){

        editor.trigger("","undo");
        editor.focus();
    }
});

redoBtn.addEventListener("click",()=>{

    if(editor){

        editor.trigger("","redo");
        editor.focus();
    }
});

function clearLanguageSelection(){

    cBtn.classList.remove("active-lang");
    cppBtn.classList.remove("active-lang");
    javaBtn.classList.remove("active-lang");
    pythonBtn.classList.remove("active-lang");
}

function setLanguage(language,file,button){

    if(!editor) return;

    languageBuffers[currentLanguage]=
        editor.getValue();

    currentLanguage=language;

    fileName.textContent=file;

    clearLanguageSelection();

    button.classList.add("active-lang");

    monaco.editor.setModelLanguage(
        editor.getModel(),
        language==="cpp"
        ?"cpp"
        :language==="java"
        ?"java"
        :language==="python"
        ?"python"
        :"c"
    );

    editor.setValue(
        languageBuffers[language]
    );

    editor.focus();
}

cBtn.addEventListener(
    "click",
    ()=>setLanguage("c","main.c",cBtn)
);

cppBtn.addEventListener(
    "click",
    ()=>setLanguage("cpp","main.cpp",cppBtn)
);

javaBtn.addEventListener(
    "click",
    ()=>setLanguage("java","Main.java",javaBtn)
);

pythonBtn.addEventListener(
    "click",
    ()=>setLanguage("python","main.py",pythonBtn)
);

clearOutputBtn.addEventListener(
    "click",
    ()=>{
        output.textContent="";
    }
);

clearScreenBtn.addEventListener(
    "click",
    ()=>{

        if(!editor) return;

        editor.focus();

        editor.executeEdits(
            "clear-screen",
            [{
                range:
                    editor.getModel()
                    .getFullModelRange(),
                text:""
            }]
        );

        editor.pushUndoStop();

        output.textContent="";
    }
);
