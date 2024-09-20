export interface Todo {
    title: string;
    completed: boolean;
    toggleComplete: () => void;
}
