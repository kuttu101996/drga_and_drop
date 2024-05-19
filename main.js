const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");

let undoHistory = [];
let redoHistory = [];

// Helper function to save the state
function saveState() {
  const state = [];
  containers.forEach((container, index) => {
    const containerState = {
      containerIndex: index,
      children: Array.from(container.children),
    };
    state.push(containerState);
  });
  undoHistory.push(state);
  // Clear redo history whenever a new action is performed
  redoHistory = [];
}

// Helper function to restore the state
function restoreState(state) {
  state.forEach((containerState) => {
    const container = containers[containerState.containerIndex];
    container.innerHTML = ""; // Clear container
    containerState.children.forEach((child) => {
      if (child) {
        // Check if child exists
        container.appendChild(child);
      }
    });
  });
}

// Add keydown listener for Ctrl+Z and Ctrl+Y
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
    if (undoHistory.length > 0) {
      const currentState = undoHistory.pop();
      redoHistory.push(currentState);
      if (undoHistory.length > 0) {
        const previousState = undoHistory[undoHistory.length - 1];
        restoreState(previousState);
      }
    }
  } else if (e.ctrlKey && e.key === "y") {
    e.preventDefault();
    if (redoHistory.length > 0) {
      const nextState = redoHistory.pop();
      undoHistory.push(nextState);
      restoreState(nextState);
    }
  }
});

draggables.forEach((ele) => {
  ele.addEventListener("dragstart", () => {
    ele.classList.add("dragging");
    saveState(); // Save state on drag start
  });

  ele.addEventListener("dragend", () => {
    ele.classList.remove("dragging");
  });
});

containers.forEach((ele) => {
  ele.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getTheAfterElement(ele, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      ele.appendChild(draggable);
    } else {
      ele.insertBefore(draggable, afterElement);
    }
  });
});

function getTheAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
