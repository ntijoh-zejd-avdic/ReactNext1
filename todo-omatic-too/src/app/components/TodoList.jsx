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
          onClick={handleAddTask}
        >
          Add Task  
        </button>
      </div>
      <ul className="mt-4 list-disc pl-6">
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}
