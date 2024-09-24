export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    toggleComplete: () => void;
}
