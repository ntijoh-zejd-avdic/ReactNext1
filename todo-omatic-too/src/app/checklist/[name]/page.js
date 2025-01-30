"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchChecklist, updateTaskStatus, addTask } from "@/lib/api";

const ChecklistPage = () => {
  const { name } = useParams();
  const router = useRouter();

  const [selectedList, setSelectedList] = useState(null);
  const [error, setError] = useState("");
  const [newTaskName, setNewTaskName] = useState("");

  const token = localStorage.getItem("authToken");

  // Fetch checklist on mount
  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view this checklist.");
      return;
    }

    fetchChecklist(name, token).then((data) => {
      if (data) setSelectedList(data);
      else setError("Checklist not found!");
    });
  }, [name, token]);

  const handleToggle = async (taskIndex) => {
    if (!selectedList) return;

    const task = selectedList.tasksList[taskIndex];
    const updatedCompleted = !task.completed;

    setSelectedList((prev) => ({
      ...prev,
      tasksList: prev.tasksList.map((t, i) =>
        i === taskIndex ? { ...t, completed: updatedCompleted } : t
      ),
    }));

    await updateTaskStatus(selectedList.id, task.id, updatedCompleted, token);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return setError("Task name cannot be empty.");

    setSelectedList((prev) => ({
      ...prev,
      tasksList: [...prev.tasksList, { name: newTaskName, completed: false }],
    }));

    await addTask(selectedList.id, newTaskName, token);
    setNewTaskName("");
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!selectedList) return <div className="text-center text-gray-500">Loading...</div>;

  const completedCount = selectedList.tasksList.filter((task) => task.completed).length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-red-500 p-4">
      <header className="absolute top-0 left-0 w-full bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{selectedList.name}</h1>
          <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
      </header>

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mt-20">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{selectedList.name}</h1>

        <form onSubmit={handleAddTask} className="flex mb-4 gap-4">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="New task name"
            className="p-2 border rounded-md text-black"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Task
          </button>
        </form>

        <ul className="space-y-4">
          {selectedList.tasksList.map((task, index) => (
            <li key={index} className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3 shadow-sm">
              <input
                type="checkbox"
                id={`task-${index}`}
                className="w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-400"
                checked={task.completed}
                onChange={() => handleToggle(index)}
              />
              <label htmlFor={`task-${index}`} className="text-lg font-medium text-gray-700">
                {task.name}
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">{completedCount} of {selectedList.tasksList.length} tasks completed</p>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
