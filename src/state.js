import {
    createTodoId,
    normalizeTodoText,
    TODO_FILTERS,
} from "./utils.js";

function copyState(state) {
    return {
        todos: state.todos.map((todo) => ({ ...todo })),
        filter: state.filter,
    };
}

export function createTodoStore(initialState, onChange = () => {}) {
    let state = copyState(initialState);

    function update(nextState) {
        onChange(copyState(nextState));
        state = nextState;
    }

    return {
        getState() {
            return copyState(state);
        },

        addTodo(text) {
            const normalizedText = normalizeTodoText(text);

            if (normalizedText.length === 0) {
                throw new Error("Enter a task before adding it.");
            }

            const todo = {
                id: createTodoId(),
                text: normalizedText,
                completed: false,
                createdAt: new Date().toISOString(),
            };

            update({ ...state, todos: [...state.todos, todo] });
            return todo.id;
        },

        toggleTodo(id) {
            const todoExists = state.todos.some((todo) => todo.id === id);

            if (!todoExists) {
                return false;
            }

            update({
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === id
                        ? { ...todo, completed: !todo.completed }
                        : todo,
                ),
            });
            return true;
        },

        deleteTodo(id) {
            const todos = state.todos.filter((todo) => todo.id !== id);

            if (todos.length === state.todos.length) {
                return false;
            }

            update({ ...state, todos });
            return true;
        },

        setFilter(filter) {
            if (!TODO_FILTERS.includes(filter)) {
                throw new Error(`Unsupported to-do filter: ${filter}`);
            }

            if (state.filter !== filter) {
                update({ ...state, filter });
            }
        },

        clearCompleted() {
            const todos = state.todos.filter((todo) => !todo.completed);

            if (todos.length !== state.todos.length) {
                update({ ...state, todos });
            }
        },
    };
}
