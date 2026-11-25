// --- 1. VARIABLE DOM INITIALIZATIONS ---
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const aquarium = document.getElementById('aquarium');
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');
const stickerBtns = document.querySelectorAll('.sticker-btn');

const inputModeSelect = document.getElementById('inputMode');
const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const sizeValue = document.getElementById('sizeValue');

let isDrawing = false;
let activePointerId = null;
let currentSticker = null;
let drawInputMode = inputModeSelect ? inputModeSelect.value : 'both';

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = sizePicker ? Number(sizePicker.value) : 6;
ctx.strokeStyle = colorPicker ? colorPicker.value : '#ff758c';

if (inputModeSelect) {
    inputModeSelect.addEventListener('change', (e) => {
        drawInputMode = e.target.value;
        isDrawing = false;
        activePointerId = null;
    });
}

if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
        ctx.strokeStyle = e.target.value;
    });
}

if (sizePicker) {
    sizePicker.addEventListener('input', (e) => {
        const size = Number(e.target.value);
        ctx.lineWidth = size;
        if (sizeValue) {
            sizeValue.textContent = `${size}px`;
        }
    });
}

function isAllowedPointer(e) {
    const isHand = e.pointerType === 'touch' || e.pointerType === 'pen';
    const isCursor = e.pointerType === 'mouse';

    if (drawInputMode === 'hand') return isHand;
    if (drawInputMode === 'cursor') return isCursor;
    return isHand || isCursor;
}

// --- 3. FREEHAND CANVAS DRAWING INTERACTION (CURSOR & HAND) ---
canvas.addEventListener('pointerdown', (e) => {
    if (!isAllowedPointer(e)) return;

    if (currentSticker) {
        stampSticker(e.offsetX, e.offsetY);
    } else {
        isDrawing = true;
        activePointerId = e.pointerId;
        canvas.setPointerCapture(e.pointerId);
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || currentSticker || e.pointerId !== activePointerId) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

function stopDrawing(e) {
    if (e && e.pointerId !== activePointerId) return;
    if (activePointerId !== null && canvas.hasPointerCapture(activePointerId)) {
        canvas.releasePointerCapture(activePointerId);
    }
    isDrawing = false;
    activePointerId = null;
}

canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointercancel', stopDrawing);
