import assert from "node:assert/strict";
import test from "node:test";
import {
    getVisibleTodos,
    isValidAppState,
    normalizeTodoText,
} from "../src/utils.js";

const todos = [
    {
        id: "one",
        text: "Write tests",
        completed: false,
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
        id: "two",
        text: "Review tests",
        completed: true,
        createdAt: "2026-01-02T00:00:00.000Z",
    },
];

test("normalizeTodoText trims surrounding whitespace", () => {
    assert.equal(normalizeTodoText("  Buy groceries  "), "Buy groceries");
});

test("normalizeTodoText returns an empty string for invalid input", () => {
    assert.equal(normalizeTodoText(null), "");
    assert.equal(normalizeTodoText("   "), "");
});

test("getVisibleTodos returns only incomplete todos for the active filter", () => {
    assert.deepEqual(getVisibleTodos(todos, "active"), [todos[0]]);
});

test("getVisibleTodos returns an empty list when there are no todos", () => {
    assert.deepEqual(getVisibleTodos([], "all"), []);
});

test("isValidAppState rejects malformed saved state", () => {
    assert.equal(isValidAppState({ todos, filter: "all" }), true);
    assert.equal(
        isValidAppState(
            { todos: [{ text: "missing fields" }], filter: "all" },
        ),
        false,
    );
});

test("getVisibleTodos rejects an unsupported filter", () => {
    assert.throws(() => getVisibleTodos(todos, "recent"), TypeError);
});
