import { isValidAppState } from "./utils.js";

export const STORAGE_KEY = "week-07-todo-state";

export function loadState(storage = globalThis.localStorage) {
    const serializedState = storage.getItem(STORAGE_KEY);

    if (serializedState === null) {
        return { todos: [], filter: "all" };
    }

    let parsedState;

    try {
        parsedState = JSON.parse(serializedState);
    } catch (error) {
        throw new Error("Saved to-do data is not valid JSON.", { cause: error });
    }

    if (!isValidAppState(parsedState)) {
        throw new Error("Saved to-do data has an invalid structure.");
    }

    return parsedState;
}

export function saveState(state, storage = globalThis.localStorage) {
    if (!isValidAppState(state)) {
        throw new TypeError("Cannot save an invalid to-do application state.");
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
