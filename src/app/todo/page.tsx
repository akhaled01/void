/** @jsx createElement */
import { createElement } from "Core/DOM/createElement";
import { v4 as uuidv4 } from 'uuid';
import { todoItemTemplate, todoListTemplate } from "../../components/todoTemplates";
import { genPulse } from "Core/pulse";
import { Todo } from "interfaces";
import { Signal } from "Core/signal";

const Page = async () => {
    const todos = genPulse<Todo[]>([], 'todo-list', todoItemTemplate);

    const addTodo = (title: string) => {
        const id = uuidv4()
        todos.addItem({
            id,
            title,
            completed: false,
            toggleComplete: function () {
                this.completed = !this.completed;
                const todoIndex = todos.get().findIndex(t => t.id === this.id);
                todos.updateItem(todoIndex, this);
            }
        });
    };

    // Fixed clearCompleted function
    const clearCompleted = () => {
        const activeTodos = todos.get().filter(t => !t.completed);
        todos.set(activeTodos);
    }

    Signal.listen(document, "DOMContentLoaded", () => {
        todos.attachTo(document.getElementById("todo-list"))
        Signal.listen(document, "keydown", (ev) => {
            if (ev.key === "Enter") {
                document.getElementById("add-todo-btn").click()
            }
        })
    });


    return await todoListTemplate(addTodo, clearCompleted);
}

export default Page;
