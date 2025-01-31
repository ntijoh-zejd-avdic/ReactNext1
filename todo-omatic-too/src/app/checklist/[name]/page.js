"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Api from "@/lib/api";
import ChecklistItem from "@/components/ChecklistItem";
import Header from "@/components/Header";

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

    Api.getChecklist(name, token).then((data) => {
      if (data) setSelectedList(data);
      else setError("Checklist not found!");
    });
  }, [name, token]);

  const handleToggle = async (taskId) => {
    if (!selectedList) return;

    const task = selectedList.tasksList.find((t) => t.id === taskId);
    if (!task) return;

    const updatedCompleted = !task.completed;

    setSelectedList((prev) => ({
      ...prev,
      tasksList: prev.tasksList.map((t) =>
        t.id === taskId ? { ...t, completed: updatedCompleted } : t
      ),
    }));

    await Api.updateTaskStatus(
      selectedList.id,
      task.id,
      updatedCompleted,
      token
    );
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return setError("Task name cannot be empty.");

    // Optimistically update the local state before the API call
    const newTask = { name: newTaskName, completed: false }; // Local task model

    setSelectedList((prev) => ({
      ...prev,
      tasksList: [...prev.tasksList, newTask],
    }));

    try {
      // Make the API call to add the task to the backend
      const createdTask = await Api.addTask(
        selectedList.id,
        newTaskName,
        token
      );

      // If the task is successfully created on the backend, update the local state with the backend response
      if (createdTask) {
        setSelectedList((prev) => ({
          ...prev,
          tasksList: prev.tasksList.map((task) =>
            task.name === newTaskName ? { ...task, id: createdTask.id } : task
          ),
        }));
      }

      // Clear the input field after adding the task
      setNewTaskName("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task.");
    }
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
          {selectedList.tasksList.map((task) => (
            <ChecklistItem
              key={task.id}
              task={task}
              onToggle={() => handleToggle(task.id)}
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
