/** @jsx createElement */
import { VNode } from "Core/DOM/types";
import { pulseRegistry } from "Core/pulse";
import { Todo } from "interfaces";

export const todoItemTemplate = (todo: Todo): VNode => {
  const activeTodos = pulseRegistry.get("active-todo-list");
  const completedTodos = pulseRegistry.get("completed-todo-list");
  const mainTodos = pulseRegistry.get("main-todo-list");

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
            const todoList = activeTodos.get().concat(completedTodos.get());
            const todoIndex = todoList.findIndex((t: Todo) => t.id === todo.id);
            todoList[todoIndex].title = ntitle;
            if (todo.completed) {
              completedTodos.set(todoList.filter((t) => t.completed));
            } else {
              activeTodos.set(todoList.filter((t) => !t.completed));
            }
          }
        }}
      >
        {todo.title}
      </span>
      <button
        className="delete-btn"
        onClick={() => {
          if (todo.completed) {
            // If the todo is in the completed list
            const todoIndex = completedTodos
              .get()
              .findIndex((t: Todo) => t.id === todo.id);
            console.log("removing completed");

            completedTodos.removeItem(todoIndex);
            // Update mainTodos to show only completed after removal
            mainTodos.set(completedTodos.get());
          } else {
            // If the todo is in the active list
            const todoIndex = activeTodos
              .get()
              .findIndex((t: Todo) => t.id === todo.id);
            activeTodos.removeItem(todoIndex);
            // Update mainTodos to show only completed after removal
            mainTodos.set(activeTodos.get());
          }
          // mainTodos.set(activeTodos.get().concat(completedTodos.get()));
        }}
      >
        Delete
      </button>
    </div>
  );
};

export const todoListTemplate = (
  addTodo: (title: string) => void,
  clearCompleted: () => void,
  showActiveTodos: () => void,
  // completeAll: () => void,
  showCompletedTodos: () => void,
  showAllTodos: () => void
): VNode => {
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
            if (
              input.value.trim() &&
              input.value.trim().length >= 3 &&
              input.value.trim().length <= 20
            ) {
              addTodo(input.value);
              input.value = "";
            }
          }}
        >
          Add
        </button>
      </div>
      <div id="todo-list" className="todo-list"></div>
      <div id="mass-operations">
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
        <button className="complete-all-btn" onClick={completeAllTodos}>
          Complete All
        </button>
      </div>
      <div className="filter-buttons">
        <button onClick={showActiveTodos}>Active</button>
        <button onClick={showCompletedTodos}>Completed</button>
        <button onClick={showAllTodos}>All</button>
      </div>
      <h6 id="todo-current-count"></h6>
    </div>
  );
};


const completeAllTodos = () => {
  const activeTodos = pulseRegistry.get("active-todo-list");
  const completedTodos = pulseRegistry.get("completed-todo-list");

  // Get the current active todos
  const activeList = activeTodos.get();

  // Mark all active todos as completed
  const updatedTodos = activeList.map((todo: Todo) => {
    todo.completed = true;
    return todo;
  });

  // Move all active todos to completed
  completedTodos.set([...completedTodos.get(), ...updatedTodos]);
  activeTodos.set([]);

  // Update mainTodos to show the newly completed todos
  const mainTodos = pulseRegistry.get("main-todo-list");
  mainTodos.set(completedTodos.get());
};