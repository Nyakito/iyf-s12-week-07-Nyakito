import { createTodoStore } from "./state.js";
import { loadState, saveState } from "./storage.js";
import { getElements, renderTodos, showStatus } from "./ui.js";

function reportError(error, elements) {
    const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
    showStatus(message, elements);
}

function initializeApp() {
    const elements = getElements();
    let initialState;

    try {
        initialState = loadState();
    } catch (error) {
        reportError(error, elements);
        elements.form.querySelector("button").disabled = true;
        elements.filter.disabled = true;
        elements.clearCompleted.disabled = true;
        return;
    }

    const store = createTodoStore(initialState, (state) => {
        saveState(state);
        renderTodos(state, elements);
        showStatus("Changes saved.", elements);
    });

    renderTodos(store.getState(), elements);

    elements.form.addEventListener("submit", (event) => {
        event.preventDefault();

        try {
            store.addTodo(elements.input.value);
            elements.input.value = "";
            elements.input.focus();
        } catch (error) {
            reportError(error, elements);
        }
    });

    elements.list.addEventListener("click", (event) => {
        const actionElement = event.target.closest("[data-action]");
        const todoElement = actionElement?.closest("[data-todo-id]");

        if (!actionElement || !todoElement) {
            return;
        }

        try {
            if (actionElement.dataset.action === "delete") {
                store.deleteTodo(todoElement.dataset.todoId);
            }
        } catch (error) {
            reportError(error, elements);
        }
    });

    elements.list.addEventListener("change", (event) => {
        const actionElement = event.target.closest('[data-action="toggle"]');
        const todoElement = actionElement?.closest("[data-todo-id]");

        if (!actionElement || !todoElement) {
            return;
        }

        try {
            store.toggleTodo(todoElement.dataset.todoId);
        } catch (error) {
            reportError(error, elements);
        }
    });

    elements.filter.addEventListener("change", (event) => {
        try {
            store.setFilter(event.target.value);
        } catch (error) {
            reportError(error, elements);
        }
    });

    elements.clearCompleted.addEventListener("click", () => {
        try {
            store.clearCompleted();
        } catch (error) {
            reportError(error, elements);
        }
    });
}

initializeApp();
