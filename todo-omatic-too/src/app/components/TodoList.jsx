"use client";

import { useState } from "react";

export default function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const handleAddTask = () => {
    if (newTask.trim() !== "") {
    setTasks([...tasks, newTask.trim()]);
    setNewTask(""); // Clear input field
    }
};

return (
    <div>
    <div className="mt-4 flex gap-2">
        <input
        className="border rounded p-2 w-full text-gray-700"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task..."
        />
    <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleAddTask}>Add Task</button>
    </div>
    <ul className="mt-4 space-y-2">
        {tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-2">
            <input
                type="checkbox"
                id={`task-${index}`}
                className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`task-${index}`} className="text-gray-700">
                {task}
            </label>
            </div>
        ))}
        </ul>

    </div>
);
}
