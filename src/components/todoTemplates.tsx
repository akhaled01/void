import { VNode } from "Core/DOM/types";
import { Todo } from "interfaces";

export const todoItemTemplate = async (todo: Todo, index: number, removeItem: (index: number) => void): Promise<VNode> => {
    return (
        <div class={`todo-item${todo.completed ? " completed" : ""}`}>
            <input type="checkbox" checked={todo.completed} onChange={() => todo.toggleComplete()} />
            <span>{todo.title}</span>
            <button onClick={() => removeItem(index)}>Delete</button>
        </div>
    );
};

export const todoListTemplate = async (todos: Todo[], addTodo: (title: string) => void, clearCompleted: () => void): Promise<VNode> => {
    return (
        <div>
            <input type="text" id="new-todo" placeholder="What needs to be done?" />
            <button onClick={() => {
                const input = document.getElementById('new-todo') as HTMLInputElement;
                if (input.value.trim()) {
                    addTodo(input.value);
                    input.value = '';
                }
            }}>Add</button>
            <div id="todo-list"></div>
            <button onClick={clearCompleted}>Clear Completed</button>
        </div>
    );
};
