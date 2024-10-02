/** @jsx createElement */
import { VNode } from "Core/DOM/types";
import { pulseRegistry } from "Core/pulse";
import { Todo } from "interfaces";

export const todoItemTemplate = async (todo: Todo): Promise<VNode> => {
  return (
    <div className={`todo-item${todo.completed ? " completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => todo.toggleComplete()}
        className="todo-checkbox"
      />
      <span
        className="todo-title"
        onClick={() => {
          const ntitle = prompt("Enter new todo title");
          if (ntitle) {
            const todos = pulseRegistry.get("todo-list");
            const todoList = todos.get();
            const todoIndex = todoList.findIndex((t: Todo) => t.id === todo.id);
            todoList[todoIndex].title = ntitle;
          }
        }}
      >
        {todo.title}
      </span>
      <button
        className="delete-btn"
        onClick={() => {
          const todos = pulseRegistry.get("todo-list");
          const todoIndex = todos
            .get()
            .findIndex((t: Todo) => t.id === todo.id);
          todos.removeItem(todoIndex);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export const todoListTemplate = async (
  addTodo: (title: string) => void,
  clearCompleted: () => void
): Promise<VNode> => {
  return (
    <div className="todo-container">
      <h1 className="todo-header">Todo List</h1>
      <div className="todo-input-container">
        <input
          type="text"
          id="new-todo"
          className="todo-input"
          placeholder="What needs to be done?"
        />
        <button
          id="add-todo-btn"
          className="add-btn"
          onClick={() => {
            const input = document.getElementById(
              "new-todo"
            ) as HTMLInputElement;
            if (input.value.trim() && input.value.trim().length >= 3) {
              addTodo(input.value);
              input.value = "";
            }
          }}
        >
          Add
        </button>
      </div>
      <div id="todo-list" className="todo-list"></div>
      <button className="clear-btn" onClick={clearCompleted}>
        Clear Completed
      </button>
    </div>
  );
};
