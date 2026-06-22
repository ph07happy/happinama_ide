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
    printf("just happy");
    return 0;
}`,
    cpp:`#include <iostream>
using namespace std;

int main()
{
    cout<<"just happy";
    return 0;
}`,
    java:`public class Main
{
    public static void main(String[] args)
    {
        System.out.println("just happy");
    }
}`,
    python:`print("just happy")`,
    sql:`SELECT 'just happy' AS message;`
};

const languageBuffers={
    c:templates.c,
    cpp:templates.cpp,
    java:templates.java,
    python:templates.python,
    sql:templates.sql
};

const monacoLanguageMap={
    c:"c",
    cpp:"cpp",
    java:"java",
    python:"python",
    sql:"sql"
};

let savedTheme="dark";
try{
    savedTheme=localStorage.getItem("theme")||"dark";
}catch(e){}

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
const sqlBtn=document.getElementById("sqlBtn");

const fileName=document.getElementById("fileName");

const langButtons=[cBtn,cppBtn,javaBtn,pythonBtn,sqlBtn];

require(["vs/editor/editor.main"],()=>{

    editor=monaco.editor.create(
        document.getElementById("editor"),
        {
            value:templates.c,
            language:"c",
            theme:savedTheme==="light"?"vs":"vs-dark",
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
        monaco.KeyMod.CtrlCmd|monaco.KeyCode.Enter,
        ()=>executeProgram()
    );
});

function executeProgram(){

    status.innerHTML="<b>Compiling...</b>";

    output.textContent=
`Backend not connected.

Language: ${currentLanguage.toUpperCase()}

Next Step:
• FastAPI
• GCC / G++
• Java
• Python
• sql.js (SQL)`;

    setTimeout(()=>{
        status.innerHTML="<b>© 2026 happinama. All rights reserved.</b>";
    },1000);
}

runBtn.addEventListener("click",executeProgram);

function updateThemeIcon(){
    themeBtn.textContent=
        document.body.classList.contains("light")?"☼":"☾";
}

updateThemeIcon();

themeBtn.addEventListener("click",()=>{

    if(!editor) return;

    const goingLight=document.body.classList.contains("dark");

    document.body.classList.replace(
        goingLight?"dark":"light",
        goingLight?"light":"dark"
    );

    try{
        localStorage.setItem("theme",goingLight?"light":"dark");
    }catch(e){}

    monaco.editor.setTheme(goingLight?"vs":"vs-dark");

    updateThemeIcon();
});

undoBtn.addEventListener("click",()=>{
    if(!editor) return;
    editor.trigger("","undo");
    editor.focus();
});

redoBtn.addEventListener("click",()=>{
    if(!editor) return;
    editor.trigger("","redo");
    editor.focus();
});

function clearLanguageSelection(){
    langButtons.forEach(btn=>{
        btn.classList.remove("active-lang");
        btn.setAttribute("aria-pressed","false");
    });
}

function setLanguage(language,file,button){

    if(!editor) return;
    if(language===currentLanguage) return;

    languageBuffers[currentLanguage]=editor.getValue();

    currentLanguage=language;

    fileName.textContent=file;

    clearLanguageSelection();

    button.classList.add("active-lang");
    button.setAttribute("aria-pressed","true");

    monaco.editor.setModelLanguage(
        editor.getModel(),
        monacoLanguageMap[language]
    );

    editor.setValue(languageBuffers[language]);

    editor.focus();
}

cBtn.addEventListener("click",
    ()=>setLanguage("c","main.c",cBtn));

cppBtn.addEventListener("click",
    ()=>setLanguage("cpp","main.cpp",cppBtn));

javaBtn.addEventListener("click",
    ()=>setLanguage("java","Main.java",javaBtn));

pythonBtn.addEventListener("click",
    ()=>setLanguage("python","main.py",pythonBtn));

sqlBtn.addEventListener("click",
    ()=>setLanguage("sql","query.sql",sqlBtn));

clearOutputBtn.addEventListener("click",()=>{
    output.textContent="";
});

clearScreenBtn.addEventListener("click",()=>{

    if(!editor) return;

    editor.executeEdits("clear-screen",[{
        range:editor.getModel().getFullModelRange(),
        text:""
    }]);

    editor.pushUndoStop();
    editor.focus();

    output.textContent="";
});
