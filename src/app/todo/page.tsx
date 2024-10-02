/** @jsx createElement */
import { v4 as uuidv4 } from "uuid";
import {
  todoItemTemplate,
  todoListTemplate,
} from "../../components/todoTemplates";
import { genPulse } from "Core/pulse";
import { Todo } from "interfaces";

const Page = () => {
  const todos = genPulse<Todo[]>([], "todo-list", todoItemTemplate);

  const addTodo = (title: string) => {
    const id = uuidv4();
    todos.addItem({
      id,
      title,
      completed: false,
      toggleComplete: function () {
        this.completed = !this.completed;
        const todoIndex = todos.get().findIndex((t: Todo) => t.id === this.id);
        todos.updateItem(todoIndex, this);
      },
    });
  };

  // Fixed clearCompleted function
  const clearCompleted = () => {
    const activeTodos = todos.get().filter((t) => !t.completed);
    todos.set(activeTodos);
  };

  document.listen("DOMContentLoaded", () => {
    todos.attachTo(document.getElementById("todo-list"));
    document.listen("keydown", (ev) => {
      if (ev.key === "Enter") {
        document.getElementById("add-todo-btn").click();
      }
    });
  });

  return  todoListTemplate(addTodo, clearCompleted);
};

export default Page;
