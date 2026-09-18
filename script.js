const task = document.getElementById("task");
const addButton = document.getElementById("addButton");
const displayTasks = document.getElementById("taskList");
const clearAllButton = document.getElementById("clearAllButton");

const editModal = document.getElementById("editModal");
const editTaskInput = document.getElementById("editTaskInput");
const cancelEditButton = document.getElementById("cancelEditButton");
const saveEditButton = document.getElementById("saveEditButton");

const totalTasks = document.getElementById("totalTasks");
const completeTasks = document.getElementById("complete");
const incompleteTasks = document.getElementById("incomplete");
const searchInput = document.getElementById("searchInput");

const inputError = document.getElementById("inputError");
const editError = document.getElementById("editError");

const clearConfirmModal = document.getElementById("clearConfirmModal");
const cancelClearAll = document.getElementById("cancelClearAll");
const confirmClearAll = document.getElementById("confirmClearAll");

const tasks = [];

let currentlyEditingTask;
let currentlyEditingTaskElement;
let currentFilter = "all";

// Helper Functions for Modals
function openModal(modal) {
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function closeModal(modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
}

function calculateCounter(){
    let total = 0;
    let complete = 0;
    tasks.forEach((data)=>{
        if(data.status === true){
            complete++;
        }
    });

    total = tasks.length;
    let incomplete = total - complete;
    return {
        total: total,
        complete: complete,
        incomplete: incomplete
    };
}

function getFilteredTasks(){
    if(currentFilter === "comp"){
        return tasks.filter(data => data.status === true);
    }
    if(currentFilter === "incomp"){
        return tasks.filter(data => data.status === false);
    }
    return tasks;
}

function renderTasks() {
    displayTasks.innerHTML = "";
    if(tasks.length === 0){
        const message = document.createElement("li");
        message.textContent = "You have no tasks.";
        displayTasks.appendChild(message);
    }
    const filteredTasks = getFilteredTasks();
    const tasksToDisplay = getSearchedTasks(filteredTasks);
    if(tasksToDisplay.length === 0 && tasks.length > 0){
        const message = document.createElement("li");
        message.textContent = "No tasks match your current filter/search.";
        displayTasks.appendChild(message);
    }
    tasksToDisplay.forEach(data => createTaskElement(data));
}

function getSearchedTasks(tasksToSearch){
    const searchTerm = searchInput.value.trim().toLowerCase();
    return tasksToSearch.filter(data => data.title.toLowerCase().includes(searchTerm));
}

function updateCounter(){
    const counterResult = calculateCounter();
    totalTasks.textContent = `Total: ${counterResult.total}`;
    completeTasks.textContent = `Complete: ${counterResult.complete}`;
    incompleteTasks.textContent = `Incomplete: ${counterResult.incomplete}`;
}

function setActiveFilterButton(clickedButton) {
    totalTasks.classList.remove("active-filter");
    completeTasks.classList.remove("active-filter");
    incompleteTasks.classList.remove("active-filter");

    clickedButton.classList.add("active-filter");
}

function saveTasks(){
    localStorage.setItem("savedTasks", JSON.stringify(tasks));
}

function getTasks(){
    const fetchedTasks = localStorage.getItem("savedTasks");
    return fetchedTasks ? JSON.parse(fetchedTasks) : [];
}

tasks.push(...getTasks());

function createTaskElement(data){
    const li = document.createElement("li");

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = data.status;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    const taskText = document.createElement("span");
    taskText.textContent = data.title;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit Task";

    li.append(checkBox, "  ", taskText, "  ", editButton, " ", deleteButton);
    displayTasks.append(li);

    checkBox.addEventListener("change", function(){
        data.status = !data.status;
        saveTasks();
        updateCounter();
    });

    deleteButton.addEventListener("click", function(){
        const index = tasks.indexOf(data);
        tasks.splice(index, 1);
        li.remove();
        saveTasks();
        updateCounter();
        renderTasks();
    });

    editButton.addEventListener("click", function(){
        openModal(editModal);
        editTaskInput.value = data.title;
        currentlyEditingTask = data;
        currentlyEditingTaskElement = taskText;
    });
}

totalTasks.addEventListener("click", function(){
    currentFilter = "all";
    setActiveFilterButton(totalTasks);
    renderTasks();
});

completeTasks.addEventListener("click", function(){
    currentFilter = "comp";
    setActiveFilterButton(completeTasks);
    renderTasks();
});

incompleteTasks.addEventListener("click", function(){
    currentFilter = "incomp";
    setActiveFilterButton(incompleteTasks);
    renderTasks();
});

cancelEditButton.addEventListener("click", function(){
    closeModal(editModal);
});

saveEditButton.addEventListener("click", function(){
    const newTitle = editTaskInput.value.trim();
    if(newTitle === ""){
        editError.textContent = "Task title cannot be empty.";
        return;
    }
    closeModal(editModal);
    currentlyEditingTask.title = newTitle;
    currentlyEditingTaskElement.textContent = currentlyEditingTask.title;
    saveTasks();
    updateCounter();
    renderTasks();
});

editTaskInput.addEventListener("input", function(){
    editError.textContent = "";
});

searchInput.addEventListener("input", function(){
    renderTasks();
});

task.addEventListener("input", function(){
    inputError.textContent = "";
});

addButton.addEventListener("click", function(){
    const data = {   
        title: task.value.trim(),
        status: false
    };
    if (data.title === ""){
        inputError.textContent = "Please enter a task.";
        return;
    }

    tasks.push(data);
    createTaskElement(data);
    saveTasks();
    updateCounter();
    renderTasks();
    task.value = "";
});

task.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        addButton.click();
        return;
    }
    if(e.key === "Shift"){
        clearAllButton.click();
        return;
    }
});

clearAllButton.addEventListener("click", function(){
    openModal(clearConfirmModal);
});

cancelClearAll.addEventListener("click", function(){
    closeModal(clearConfirmModal);
});

confirmClearAll.addEventListener("click", function(){
    tasks.length = 0;
    displayTasks.innerHTML = "";
    saveTasks();
    updateCounter();
    renderTasks();
    closeModal(clearConfirmModal);
});

document.addEventListener("DOMContentLoaded", function(){
    // Initial Modals Close Check
    closeModal(editModal);
    closeModal(clearConfirmModal);
    
    updateCounter();
    setActiveFilterButton(totalTasks);
});

renderTasks();