const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoTemplate = document.getElementById("todoTemplate");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".chip");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");
const progressText = document.getElementById("progressText");
const ring = document.querySelector(".ring");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let theme = localStorage.getItem("theme") || "dark";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function saveTheme() {
  localStorage.setItem("theme", theme);
}

function applyTheme() {
  document.body.classList.toggle("light", theme === "light");
  themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
}

function updateStats() {
  const total = todos.length;
  const active = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  totalCount.textContent = total;
  activeCount.textContent = active;
  completedCount.textContent = completed;
  progressText.textContent = `${percent}%`;
  ring.style.background = `conic-gradient(var(--primary) ${percent * 3.6}deg, rgba(255,255,255,0.12) 0deg)`;
}

function renderTodos() {
  todoList.innerHTML = "";

  const filtered = todos.filter(todo => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  if (!filtered.length) {
    todoList.innerHTML = `<li class="empty-state">No tasks here right now. Add a beautiful one.</li>`;
    updateStats();
    return;
  }

  filtered.forEach(todo => {
    const node = todoTemplate.content.cloneNode(true);
    const item = node.querySelector(".todo-item");
    const checkbox = node.querySelector(".complete-toggle");
    const text = node.querySelector(".todo-text");
    const editBtn = node.querySelector(".edit-btn");
    const deleteBtn = node.querySelector(".delete-btn");

    text.textContent = todo.text;
    checkbox.checked = todo.completed;
    item.classList.toggle("completed", todo.completed);

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    editBtn.addEventListener("click", () => {
      const updated = prompt("Edit task:", todo.text);
      if (updated === null) return;
      const trimmed = updated.trim();
      if (!trimmed) return;
      todo.text = trimmed;
      saveTodos();
      renderTodos();
    });

    deleteBtn.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    todoList.appendChild(node);
  });

  updateStats();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;

  todos.unshift({
    id: Date.now(),
    text: value,
    completed: false
  });

  todoInput.value = "";
  saveTodos();
  renderTodos();
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

themeToggle.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  saveTheme();
  applyTheme();
});

applyTheme();
renderTodos();