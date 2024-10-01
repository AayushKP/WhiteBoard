let selectedText = null;
let undoStack = [];
let redoStack = [];

const whiteboard = document.getElementById("whiteboard");
const addTextBtn = document.getElementById("addText");
const fontColorInput = document.getElementById("fontColor");
const fontSizeInput = document.getElementById("fontSize");
const fontStyleInput = document.getElementById("fontStyle");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");

let isDragging = false;
let offsetX, offsetY;

addTextBtn.addEventListener("click", () => {
  const newText = document.createElement("div");
  newText.className = "text-box";
  newText.contentEditable = true;
  newText.innerText = "Edit me";
  newText.style.top = "100px";
  newText.style.left = "100px";
  whiteboard.appendChild(newText);

 selectedText = newText;

  saveState();
  makeDraggable(newText);
});

function makeDraggable(element) {
  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    selectedText = element; 
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging && selectedText) {
      selectedText.style.left = `${e.pageX - offsetX}px`;
      selectedText.style.top = `${e.pageY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      saveState(); // Save state after move
    }
  });
}

fontColorInput.addEventListener("input", () => {
  if (selectedText) {
    selectedText.style.color = fontColorInput.value;
    saveState();
  }
});

fontSizeInput.addEventListener("input", () => {
  if (selectedText) {
    selectedText.style.fontSize = `${fontSizeInput.value}px`;
    saveState();
  }
});

fontStyleInput.addEventListener("change", () => {
  if (selectedText) {
    selectedText.style.fontWeight =
      fontStyleInput.value === "bold" ? "bold" : "normal";
    selectedText.style.fontStyle =
      fontStyleInput.value === "italic" ? "italic" : "normal";
    saveState();
  }
});

function saveState() {
  undoStack.push(whiteboard.innerHTML);
  redoStack = []; 
}

// Undo functionality
undoBtn.addEventListener("click", () => {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    whiteboard.innerHTML = undoStack[undoStack.length - 1];
    reloadTextBoxes();
  }
});

// Redo functionality
redoBtn.addEventListener("click", () => {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    whiteboard.innerHTML = undoStack[undoStack.length - 1];
    reloadTextBoxes();
  }
});

function reloadTextBoxes() {
  const textBoxes = Array.from(whiteboard.querySelectorAll(".text-box"));
  textBoxes.forEach(makeDraggable);

  textBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      selectedText = box;
    });
  });
}
