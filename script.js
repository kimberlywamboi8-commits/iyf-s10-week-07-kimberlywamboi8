// Select elements from the page
const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const clearCompletedButton = document.getElementById("clear-completed");
const clearAllButton = document.getElementById("clear-all");

// Load tasks from localStorage, or start with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load the current input value from sessionStorage
taskInput.value = sessionStorage.getItem("currentInput") || "";

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show tasks on the page
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.classList.add("task-text");

    // Add completed style if task is finished
    if (task.completed) {
      span.classList.add("completed");
    }

    // Click task text to mark complete/incomplete
    span.addEventListener("click", function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

// Add new task
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  tasks.push({
    text: taskText,
    completed: false
  });

  saveTasks();
  renderTasks();

  // Clear input after adding task
  taskInput.value = "";
  sessionStorage.removeItem("currentInput");
});

// Save current input in sessionStorage while typing
taskInput.addEventListener("input", function () {
  sessionStorage.setItem("currentInput", taskInput.value);
});

// Remove all completed tasks
clearCompletedButton.addEventListener("click", function () {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveTasks();
  renderTasks();
});

// Remove all tasks
clearAllButton.addEventListener("click", function () {
  tasks = [];
  saveTasks();
  renderTasks();
});

// Display tasks when page loads
renderTasks();
