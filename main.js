const draggables = document.querySelectorAll(".draggable");
// console.log(draggables);

const containers = document.querySelectorAll(".container");
// console.log(containers);

draggables.forEach((ele) => {
    ele.addEventListener("dragstart", () => {
        ele.classList.add('dragging');
    })

    ele.addEventListener("dragend", ()=>{
        ele.classList.remove("dragging")
    })
})


containers.forEach((ele) => {
    ele.addEventListener("dragover", (e) => {
        // console.log('dragging')
        e.preventDefault();
        const afterElement = getTheAfterElement(ele, e.clientY);
        console.log(afterElement);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
            ele.appendChild(draggable);
        }
        else {
            ele.insertBefore(draggable, afterElement)
        }
    })
})


function getTheAfterElement (container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        // console.log(offset);

        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        }
        else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}