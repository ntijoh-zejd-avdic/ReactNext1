"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ChecklistPage = () => {
  const { name } = useParams();
  const router = useRouter();

  const [selectedList, setSelectedList] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken"); // Retrieve JWT from localStorage

  // Fetch the selected checklist from the backend
  useEffect(() => {
    async function fetchChecklist() {
      try {
        const response = await fetch(`http://localhost:3001/todos/${name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Backend response:", data);
          setSelectedList(data); // Set the fetched checklist data
        } else {
          setError("Checklist not found!");
        }
      } catch (err) {
        console.error("Error fetching checklist:", err);
        setError("Failed to load the checklist. Please try again.");
      }
    }

    if (token) {
      fetchChecklist();
    } else {
      setError("You must be logged in to view this checklist.");
    }
  }, [name, token]);

  // Handle checkbox toggle
  const handleToggle = async (taskIndex) => {
    if (!selectedList) return;

    console.log(`Currently working with list ${selectedList.name} containing ${selectedList.tasksList}`)

    const updatedTasksList = selectedList.tasksList.map((task, index) =>
      index === taskIndex
        ? { ...task, completed: !task.completed }
        : task
    );

    const updatedList = { ...selectedList, tasksList: updatedTasksList };

    try {
      const response = await fetch(`http://localhost:3001/lists/${selectedList.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT in the Authorization header
        },
        body: JSON.stringify(updatedList),
      });

      if (response.ok) {
        setSelectedList(updatedList); // Update the state with the toggled task
      } else {
        console.error("Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!selectedList) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  console.log(`Currently working with list ${selectedList.name} containing ${selectedList.tasksList}`)
  // Calculate completed tasks
  const completedCount = selectedList.tasksList.filter((task) => task.completed)
    .length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-red-500 p-4">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{selectedList.name}</h1>
          <button
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mt-20">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {selectedList.name}
        </h1>

        {/* Tasks */}
        <ul className="space-y-4">
          {selectedList.tasksList.map((task, index) => (
            <li
              key={index}
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3 shadow-sm"
            >
              <input
                type="checkbox"
                id={`task-${index}`}
                className="w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-400"
                checked={task.completed}
                onChange={() => handleToggle(index)}
              />
              <label
                htmlFor={`task-${index}`}
                className="text-lg font-medium text-gray-700"
              >
                {task.name}
              </label>
            </li>
          ))}
        </ul>

        {/* Footer */}
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
