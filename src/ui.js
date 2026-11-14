import { getVisibleTodos } from "./utils.js";

export function getElements(document = globalThis.document) {
    const elements = {
        form: document.querySelector("#todo-form"),
        input: document.querySelector("#todo-input"),
        filter: document.querySelector("#todo-filter"),
        list: document.querySelector("#todo-list"),
        emptyState: document.querySelector("#empty-state"),
        count: document.querySelector("#todo-count"),
        clearCompleted: document.querySelector("#clear-completed"),
        status: document.querySelector("#status"),
    };

    for (const [name, element] of Object.entries(elements)) {
        if (element === null) {
            throw new Error(`Required page element is missing: ${name}`);
        }
    }

    return elements;
}

function createTodoElement(todo, document) {
    const item = document.createElement("li");
    item.className = todo.completed
        ? "todo-item todo-item--completed"
        : "todo-item";
    item.dataset.todoId = todo.id;

    const toggle = document.createElement("input");
    toggle.className = "todo-item__toggle";
    toggle.type = "checkbox";
    toggle.checked = todo.completed;
    toggle.dataset.action = "toggle";
    toggle.setAttribute("aria-label", `Mark "${todo.text}" as complete`);

    const text = document.createElement("span");
    text.className = "todo-item__text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-item__delete";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete "${todo.text}"`);

    item.append(toggle, text, deleteButton);
    return item;
}

export function renderTodos(state, elements, document = globalThis.document) {
    const visibleTodos = getVisibleTodos(state.todos, state.filter);
    const remainingCount = state.todos.filter(
        (todo) => !todo.completed,
    ).length;

    elements.filter.value = state.filter;
    elements.list.replaceChildren(
        ...visibleTodos.map((todo) => createTodoElement(todo, document)),
    );
    elements.emptyState.hidden = visibleTodos.length > 0;
    elements.count.textContent =
        remainingCount === 1 ? "1 task left" : `${remainingCount} tasks left`;
    elements.clearCompleted.disabled = !state.todos.some(
        (todo) => todo.completed,
    );
}

export function showStatus(message, elements) {
    elements.status.textContent = message;
}
