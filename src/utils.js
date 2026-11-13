export const TODO_FILTERS = Object.freeze(["all", "active", "completed"]);

export function normalizeTodoText(text) {
    return typeof text === "string" ? text.trim() : "";
}

export function isValidTodo(todo) {
    return (
        todo !== null &&
        typeof todo === "object" &&
        typeof todo.id === "string" &&
        todo.id.length > 0 &&
        typeof todo.text === "string" &&
        todo.text.length > 0 &&
        typeof todo.completed === "boolean" &&
        typeof todo.createdAt === "string" &&
        !Number.isNaN(Date.parse(todo.createdAt))
    );
}

export function isValidAppState(state) {
    return (
        state !== null &&
        typeof state === "object" &&
        Array.isArray(state.todos) &&
        state.todos.every(isValidTodo) &&
        TODO_FILTERS.includes(state.filter)
    );
}

export function getVisibleTodos(todos, filter) {
    if (!Array.isArray(todos) || !TODO_FILTERS.includes(filter)) {
        throw new TypeError("A todo list and a supported filter are required.");
    }

    if (filter === "active") {
        return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
        return todos.filter((todo) => todo.completed);
    }

    return [...todos];
}

export function createTodoId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
