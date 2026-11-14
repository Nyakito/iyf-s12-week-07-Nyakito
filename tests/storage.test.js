import assert from "node:assert/strict";
import test from "node:test";
import { loadState, saveState, STORAGE_KEY } from "../src/storage.js";

function createMemoryStorage(initialEntries = []) {
    const values = new Map(initialEntries);

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
    };
}

test("loadState returns initial state when storage is empty", () => {
    assert.deepEqual(loadState(createMemoryStorage()), {
        todos: [],
        filter: "all",
    });
});

test("saveState and loadState preserve a valid state", () => {
    const storage = createMemoryStorage();
    const state = {
        todos: [
            {
                id: "todo-1",
                text: "Finish the project",
                completed: false,
                createdAt: "2026-01-01T00:00:00.000Z",
            },
        ],
        filter: "active",
    };

    saveState(state, storage);

    assert.deepEqual(loadState(storage), state);
    assert.equal(typeof storage.getItem(STORAGE_KEY), "string");
});

test("loadState reports malformed JSON instead of hiding the error", () => {
    const storage = createMemoryStorage([[STORAGE_KEY, "{invalid"]]);

    assert.throws(() => loadState(storage), /not valid JSON/);
});

test("saveState rejects invalid application state", () => {
    assert.throws(
        () => saveState({ todos: [], filter: "recent" }, createMemoryStorage()),
        /invalid to-do application state/,
    );
});
