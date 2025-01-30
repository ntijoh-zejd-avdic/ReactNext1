"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchChecklist, updateTaskStatus, addTask } from "@/lib/api";
import ChecklistItem from "@/components/ChecklistItem";

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
  if (!selectedList)
    return <div className="text-center text-gray-500">Loading...</div>;

  const completedCount = selectedList.tasksList.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-red-500 p-4">
      <Header
        title={selectedList.name}
        buttonLabel="Back to Home"
        buttonAction={() => router.push("/")}
      />

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mt-20">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {selectedList.name}
        </h1>

        <form onSubmit={handleAddTask} className="flex mb-4 gap-4">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="New task name"
            className="p-2 border rounded-md text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>

        <ul className="space-y-4">
          {selectedList.tasksList.map((task, index) => (
            <ChecklistItem
              key={index}
              task={task}
              index={index}
              onToggle={handleToggle}
            />
          ))}
        </ul>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {completedCount} of {selectedList.tasksList.length} tasks completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
