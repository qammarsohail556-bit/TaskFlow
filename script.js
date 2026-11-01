// Selections

const taskInput = document.querySelector(".task-input-field");
const addBtn = document.querySelector(".add-btn");
const taskList = document.querySelector(".task-list");

const editModal = document.querySelector(".edit-modal");
const editInput = document.querySelector(".edit-input");
const updateBtn = document.querySelector(".update-btn");
const cancelBtn = document.querySelector(".cancel-btn");

const totalTasks = document.querySelector(".total-tasks");
const pendingTasks = document.querySelector(".pending-tasks");
const completedTasks = document.querySelector(".completed-tasks");
const successRate = document.querySelector(".success-rate");

const menuLinks = document.querySelectorAll(".menu a");

const searchInput = document.querySelector(".search-input");
const themeBtn = document.querySelector(".btn");

// Global Variables

let currentTask = null;

let currentFilter = "all";

let searchText = "";

// Local Storage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Functions

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const createTask = (task) => {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    taskCard.dataset.id = task.id;
    
    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");
    taskCard.prepend(taskLeft);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    taskLeft.append(checkbox);

    const handleCheckboxChange = () => {

        task.completed = checkbox.checked;

        updateStats();

        saveTasks();

        renderTasks();
    };

    checkbox.addEventListener("change", handleCheckboxChange);

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskLeft.append(taskText);

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions")
    taskCard.append(taskActions)

    // Tasks Editing
    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    editBtn.classList.add("edit-btn");
    taskActions.append(editBtn);

    const openEditModal = () => {

        currentTask = task;

        editInput.value = task.text;

        editModal.style.display = "flex";

    };

    // call
    editBtn.addEventListener("click", openEditModal);

    // Deleting Button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteBtn.classList.add("delete-btn");
    taskActions.append(deleteBtn);

    const deleteTask = () => {

        tasks = tasks.filter(item => item.id !== task.id);

        saveTasks();

        updateStats();

        renderTasks();
    };

    // Call

    deleteBtn.addEventListener("click", deleteTask);

    taskList.prepend(taskCard);
};

const capitalizeText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const closeEditModal = () => {

    editModal.style.display = "none"

};



const updateTask = () => {

    if (editInput.value.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    const card = document.querySelector(
        `[data-id="${currentTask.id}"]`
    );

    const span = card.querySelector("span");

    const updatedText = capitalizeText(editInput.value.trim());

    const taskExists = tasks.some((task) => {
        return(
            task.id !== currentTask.id && task.text.toLowerCase() === updatedText.toLowerCase()
        );
    });

    if (taskExists) {
        alert("Task already exists!");
        return
    }

    currentTask.text = updatedText;

    // span.textContent = currentTask.text;

    saveTasks();

    renderTasks();

    closeEditModal();

    editInput.value = "";
};

const addTask = () => {

    if (taskInput.value.trim() === "") {
        alert("Please add a task!");
        return;
    }

    const inputText = capitalizeText(taskInput.value.trim());

    const taskExists = tasks.some((task) => {
        return task.text.toLowerCase() === inputText.toLowerCase()

    });

    if (taskExists) {
        alert("Task already exist!");
        taskInput.value = "";
        return;
    }

    const newTask = {
        id: Date.now(),
        text: inputText,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();

    renderTasks();

    updateStats();

    taskInput.value = "";
    
};

const renderTasks = () => {

    taskList.innerHTML = "";

    let filteredTasks;

    if (currentFilter === "all") {
        filteredTasks = tasks;
    }

    else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks = filteredTasks.filter((task) => {
        return task.text.toLowerCase().includes(searchText);
    });

    filteredTasks.forEach(createTask);
};

const handleKeyDown = (event) => {
    if (event.key === "Enter") {
        addTask();
    }
};

const updateWithEnter = (event) => {
    if (event.key === "Enter") {
        updateTask();
    }
};

const updateStats = () => {
    const total = tasks.length;
    totalTasks.textContent = `${total}`;

    const completedCount = tasks.filter((task) => task.completed).length;
    completedTasks.textContent = completedCount;

    const pending = total - completedCount;
    pendingTasks.textContent = `${pending}`;

    let success = 0;

    if (total === 0) {
        success = 0;
    }
    else {
        success = ( completedCount / total) * 100;
    }
        successRate.textContent = `${success.toFixed(2)}%`;  
};

const handleMenuClick = (event) => {

    event.preventDefault();
    const activeLink = document.querySelector(".menu .active");
    activeLink.classList.remove("active");

    const clickedLink = event.currentTarget;

    clickedLink.classList.add("active");

    currentFilter = clickedLink.dataset.filter;

    renderTasks();

}

const handleSearch = () => {

    searchText = searchInput.value.trim().toLowerCase();

    renderTasks();
}


// Event Listeners

menuLinks.forEach((link) => {
    link.addEventListener("click", handleMenuClick);
});

searchInput.addEventListener("input", handleSearch);


taskInput.addEventListener("keydown", handleKeyDown);
editInput.addEventListener("keydown", updateWithEnter);

renderTasks();

updateStats();

cancelBtn.addEventListener("click", closeEditModal);

updateBtn.addEventListener("click", updateTask);

addBtn.addEventListener("click", addTask);