/** @jsx createElement */
import { v4 as uuidv4 } from "uuid";
import {
  todoItemTemplate,
  todoListTemplate,
} from "../../components/todoTemplates";
import { genPulse } from "Core/pulse";
import { Todo } from "interfaces";

const Page = () => {
  const activeTodos = genPulse<Todo[]>([], "active-todo-list");
  const completedTodos = genPulse<Todo[]>([], "completed-todo-list");
  const mainTodos = genPulse<Todo[]>([], "main-todo-list", todoItemTemplate);
  const activeTodosCount = genPulse(
    {
      count: 0,
    },
    "active-count",
    (c) => <div className="todo-current-count">Active Todos: {c.count}</div>
  );

  // Subscribe to changes in active and completed todos to update the main rendered todos
  const updateMainTodos = (todos: Todo[]) => {
    mainTodos.set(todos);
  };

  // Initialize with active todos
  activeTodos.subscribe(updateMainTodos);
  activeTodos.subscribe((todos) => {
    activeTodosCount.set({
      count: todos.length,
    });
  });

  completedTodos.subscribe((val) => {
    if (val.length === 0) {
      mainTodos.set([]);
    }
  });

  const addTodo = (title: string) => {
    const id = uuidv4();
    const newTodo: Todo = {
      id,
      title,
      completed: false,
      toggleComplete: function () {
        this.completed = !this.completed;
        updateTodoInPulse(this);
      },
    };

    activeTodos.addItem(newTodo);
  };

  const updateTodoInPulse = (todo: Todo) => {
    if (todo.completed) {
      const activeIndex = activeTodos.get().findIndex((t) => t.id === todo.id);
      activeTodos.removeItem(activeIndex);
      completedTodos.addItem(todo);
    } else {
      const completedIndex = completedTodos
        .get()
        .findIndex((t) => t.id === todo.id);
      completedTodos.removeItem(completedIndex);
      activeTodos.addItem(todo);
    }
    // updateMainTodos(todo.completed ? completedTodos.get() : activeTodos.get());
  };

  const showActiveTodos = () => {
    updateMainTodos(activeTodos.get());
  };

  const showCompletedTodos = () => {
    updateMainTodos(completedTodos.get());
  };

  const showAllTodos = () => {
    const allTodos = [...activeTodos.get(), ...completedTodos.get()];
    updateMainTodos(allTodos);
  };

  const clearCompleted = () => {
    completedTodos.set([]);
  };

  document.listen("DOMContentLoaded", () => {
    mainTodos.attachTo(document.getElementById("todo-list"));
    activeTodosCount.attachTo(document.getElementById("todo-current-count"));
    document.listen("keydown", (ev) => {
      if (ev.key === "Enter") {
        document.getElementById("add-todo-btn").click();
      }
    });
  });

  return todoListTemplate(
    addTodo,
    clearCompleted,
    showActiveTodos,
    showCompletedTodos,
    showAllTodos
  );
};

export default Page;
