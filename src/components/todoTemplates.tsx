/** @jsx createElement */
import { createElement } from "Core/DOM/createElement";
import { VNode } from "Core/DOM/types";
import { pulseRegistry } from "Core/pulse";
import { Todo } from "interfaces";

export const todoItemTemplate = async (todo: Todo, index: number, signalId?: string): Promise<VNode> => {
    return (
        <div class={`todo-item${todo.completed ? " completed" : ""}`}>
            <input type="checkbox" checked={todo.completed} onChange={() => todo.toggleComplete()} />
            <span>{todo.title}</span>
            <button onClick={() => {
                // pulseRegistry.get(signalId!)?.removeItem(index)
                
            }}>Delete</button>
        </div>
    );
};


export const todoListTemplate = async (addTodo: (title: string) => void, clearCompleted: () => void): Promise<VNode> => {
    return (
        <div>
            <input type="text" id="new-todo" placeholder="What needs to be done?" />
            <button id="add-todo-btn" onClick={() => {
                const input = document.getElementById('new-todo') as HTMLInputElement;
                if (input.value.trim() && input.value.trim().length >= 3) {
                    addTodo(input.value);
                    input.value = '';
                }
            }}>Add</button>
            <div id="todo-list"></div>
            <button onClick={clearCompleted}>Clear Completed</button>
        </div>
    );
};
