const fullscreenBtn = document.getElementById("fullscreenBtn");
const divider = document.getElementById("divider");
const outputContainer = document.querySelector(".output-container");

let previousOutputWidth = "420px";
let resizingOutput = false;
let rafPending = false;

const isMobile = () => window.innerWidth <= 768;
const isLandscapeMobile = () => isMobile() && window.innerHeight <= 500 && window.screen.orientation?.type?.startsWith("landscape");

function updateFullscreenIcon() {
    const isFS = !!document.fullscreenElement;
    fullscreenBtn.textContent = isFS ? "▣" : "□";
    fullscreenBtn.setAttribute("aria-label", isFS ? "Exit fullscreen" : "Enter fullscreen");
}

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        previousOutputWidth = outputContainer.style.width || "420px";
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
});

document.addEventListener("fullscreenchange", () => {
    updateFullscreenIcon();
    if (!document.fullscreenElement && !isMobile()) {
        outputContainer.style.width = previousOutputWidth;
    }
    if (window.editor) setTimeout(() => window.editor.layout(), 100);
});

function applyResize(clientX, clientY) {
    if (isMobile() && !isLandscapeMobile()) {
        const mainRect = document.querySelector("main").getBoundingClientRect();
        const height = mainRect.bottom - clientY;
        if (height > 120 && height < window.innerHeight * 0.7) {
            outputContainer.style.height = `${height}px`;
        }
    } else {
        const width = window.innerWidth - clientX;
        if (width > 250 && width < 1000) {
            outputContainer.style.width = `${width}px`;
        }
    }
    window.editor?.layout();
}

function startResize() {
    resizingOutput = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = isMobile() && !isLandscapeMobile() ? "row-resize" : "col-resize";
}

function stopResize() {
    resizingOutput = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
}

divider.addEventListener("mousedown", e => { e.preventDefault(); startResize(); });
divider.addEventListener("touchstart", e => { e.preventDefault(); startResize(); }, { passive: false });

const handleMove = e => {
    if (!resizingOutput || rafPending) return;
    rafPending = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    requestAnimationFrame(() => {
        applyResize(clientX, clientY);
        rafPending = false;
    });
};

document.addEventListener("mousemove", handleMove);
document.addEventListener("touchmove", handleMove, { passive: true });
document.addEventListener("mouseup", stopResize);
document.addEventListener("touchend", stopResize);
document.addEventListener("touchcancel", stopResize);

divider.addEventListener("keydown", e => {
    const step = 20;
    const mobile = isMobile() && !isLandscapeMobile();
    if (mobile) {
        const current = outputContainer.offsetHeight;
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const h = current + (e.key === "ArrowUp" ? step : -step);
            if (h > 120 && h < window.innerHeight * 0.7) {
                outputContainer.style.height = `${h}px`;
            }
        }
    } else {
        const current = outputContainer.offsetWidth;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            const w = current + (e.key === "ArrowLeft" ? step : -step);
            if (w > 250 && w < 1000) {
                outputContainer.style.width = `${w}px`;
            }
        }
    }
    window.editor?.layout();
});
