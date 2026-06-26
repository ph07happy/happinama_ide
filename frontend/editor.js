require.config({
    paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs" }
});

let editor;
let currentLanguage = "c";
const BACKEND_URL = "https://happinama-backend.onrender.com";

const templates = {
    c: `#include <stdio.h>\n\nint main()\n{\n    printf("just happy things");\n    return 0;\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout<<"just happy things";\n    return 0;\n}`,
    java: `public class Main\n{\n    public static void main(String[] args)\n    {\n        System.out.println("just happy things");\n    }\n}`,
    python: `print("just happy things")`,
    sql: `SELECT 'just happy things' AS message;`
};

const languageBuffers = { ...templates };
const monacoLanguageMap = { c: "c", cpp: "cpp", java: "java", python: "python", sql: "sql" };

let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
document.body.classList.add(savedTheme);

const getEl = id => document.getElementById(id);
const runBtn = getEl("runBtn");
const output = getEl("output");
const status = getEl("status");
const themeBtn = getEl("themeBtn");
const undoBtn = getEl("undoBtn");
const redoBtn = getEl("redoBtn");
const clearOutputBtn = getEl("clearOutputBtn");
const clearScreenBtn = getEl("clearScreenBtn");
const fileName = getEl("fileName");

const langConfig = {
    c: { file: "main.c", btn: getEl("cBtn") },
    cpp: { file: "main.cpp", btn: getEl("cppBtn") },
    java: { file: "Main.java", btn: getEl("javaBtn") },
    python: { file: "main.py", btn: getEl("pythonBtn") },
    sql: { file: "query.sql", btn: getEl("sqlBtn") }
};

require(["vs/editor/editor.main"], () => {
    editor = monaco.editor.create(getEl("editor"), {
        value: templates.c,
        language: "c",
        theme: savedTheme === "light" ? "vs" : "vs-dark",
        automaticLayout: true,
        fontSize: 18,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        roundedSelection: true,
        wordWrap: "on",
        fontFamily: "Consolas"
    });
    window.editor = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, executeProgram);
    initEditorPinchZoom();
});

function initEditorPinchZoom() {
    const wrapper = document.querySelector(".editor-wrapper");
    const editorDom = getEl("editor");
    let scale = 1, initialDist = null, lastScale = 1, translateX = 0, translateY = 0;

    const getDistance = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const getMidpoint = t => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });

    const applyTransform = () => {
        editorDom.style.transformOrigin = "0 0";
        editorDom.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    const resetTransform = () => {
        scale = 1; translateX = 0; translateY = 0;
        editorDom.style.transform = "none";
        window.editor?.layout();
    };

    wrapper.addEventListener("touchstart", e => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialDist = getDistance(e.touches);
            lastScale = scale;
            const mid = getMidpoint(e.touches);
            const rect = wrapper.getBoundingClientRect();
            translateX = mid.x - rect.left;
            translateY = mid.y - rect.top;
        }
    }, { passive: false });

    wrapper.addEventListener("touchmove", e => {
        if (e.touches.length === 2 && initialDist !== null) {
            e.preventDefault();
            const dist = getDistance(e.touches);
            const newScale = Math.min(4, Math.max(0.5, lastScale * (dist / initialDist)));
            const mid = getMidpoint(e.touches);
            const rect = wrapper.getBoundingClientRect();
            const midX = mid.x - rect.left, midY = mid.y - rect.top;

            translateX = midX - (midX - translateX) * (newScale / scale);
            translateY = midY - (midY - translateY) * (newScale / scale);
            scale = newScale;
            applyTransform();
        }
    }, { passive: false });

    wrapper.addEventListener("touchend", e => {
        if (e.touches.length < 2) {
            initialDist = null;
            if (scale <= 1.05) resetTransform();
        }
    });
    wrapper.addEventListener("dblclick", resetTransform);
}

async function executeProgram() {
    if (!editor) return;
    const code = editor.getValue();
    if (!code.trim()) {
        output.textContent = "nothing to execute.";
        return;
    }

    runBtn.disabled = true;
    status.innerHTML = "<b>compiling...</b>";
    output.textContent = "running...";

    try {
        const res = await fetch(`${BACKEND_URL}/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: currentLanguage, source_code: code, stdin: "" })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            output.textContent = `error ${res.status}: ${err.detail || res.statusText}`;
            status.innerHTML = "<b>execution failed.</b>";
            return;
        }

        const data = await res.json();
        output.textContent = data.output;
        status.innerHTML = `<b>${data.status === "Accepted" ? "executed successfully." : data.status}</b>`;
    } catch (e) {
        output.textContent = `could not reach backend.\nmake sure FastAPI is running at ${BACKEND_URL}\n\nerror: ${e.message}`;
        status.innerHTML = "<b>backend unreachable.</b>";
    } finally {
        runBtn.disabled = false;
        setTimeout(() => {
            status.innerHTML = "<b>© 2026 happinama. All rights reserved.</b>";
        }, 4000);
    }
}

runBtn.addEventListener("click", executeProgram);

const updateThemeIcon = () => {
    themeBtn.textContent = document.body.classList.contains("light") ? "☼" : "☾";
};
updateThemeIcon();

themeBtn.addEventListener("click", () => {
    if (!editor) return;
    const goingLight = document.body.classList.contains("dark");
    document.body.classList.replace(goingLight ? "dark" : "light", goingLight ? "light" : "dark");
    try { localStorage.setItem("theme", goingLight ? "light" : "dark"); } catch (e) {}
    monaco.editor.setTheme(goingLight ? "vs" : "vs-dark");
    updateThemeIcon();
});

undoBtn.addEventListener("click", () => {
    editor?.trigger("", "undo");
    editor?.focus();
});

redoBtn.addEventListener("click", () => {
    editor?.trigger("", "redo");
    editor?.focus();
});

function setLanguage(language, file, button) {
    if (!editor || language === currentLanguage) return;

    languageBuffers[currentLanguage] = editor.getValue();
    currentLanguage = language;
    fileName.textContent = file;

    Object.values(langConfig).forEach(({ btn }) => {
        btn.classList.remove("active-lang");
        btn.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active-lang");
    button.setAttribute("aria-pressed", "true");

    monaco.editor.setModelLanguage(editor.getModel(), monacoLanguageMap[language]);
    editor.setValue(languageBuffers[language]);
    editor.focus();
}

Object.entries(langConfig).forEach(([lang, { file, btn }]) => {
    btn.addEventListener("click", () => setLanguage(lang, file, btn));
});

clearOutputBtn.addEventListener("click", () => { output.textContent = ""; });

clearScreenBtn.addEventListener("click", () => {
    if (!editor) return;
    editor.executeEdits("clear-screen", [{ range: editor.getModel().getFullModelRange(), text: "" }]);
    editor.pushUndoStop();
    editor.focus();
    output.textContent = "";
});
