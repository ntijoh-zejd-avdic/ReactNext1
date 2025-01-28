"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const [todoLists, setTodoLists] = useState([]);
  const token = localStorage.getItem("authToken"); // Get JWT from localStorage

  // Fetch todo lists from the backend
  useEffect(() => {
    async function fetchTodoLists() {
      try {
        const response = await fetch("http://localhost:3001/lists", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT in the Authorization header
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Backend response:", data);
          setTodoLists(data); // Use backend data if available
        } else {
          console.log("Found no Lists");
        }
      } catch (error) {
        console.error("Error fetching todo lists:", error);
      }
    }

    if (token) {
      fetchTodoLists();
    }
  }, [token]);

  const handleClick = (id) => {
    router.push(`/checklist/${id}`);
  };

  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");

  // Handle list creation
  const handleCreateList = async (e) => {
    e.preventDefault();
    console.log(`Creating list with name ${newListName}`);

    if (!newListName.trim()) {
      setError("Checklist name cannot be empty.");
      return;
    }

    // Retrieve the JWT from localStorage for authentication
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You must be logged in to create a checklist.");
      return;
    }

    // Create a new list object
    const newList = {
      name: newListName,
      tasksList: [],
    };

    try {
      // Send the new list to the backend
      const response = await fetch("http://localhost:3001/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add JWT to Authorization header
        },
        body: JSON.stringify(newList),
      });

      const result = await response.json();

      if (response.ok) {
        // Add new list to the state
        setTodoLists((prevLists) => [...prevLists, result.newList]);
        setNewListName(""); // Clear the input
        setError(""); // Clear any previous error
      } else {
        setError(result.message || "Failed to create checklist.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-600 to-red-500">
      {/* Main Content */}
      <div className="grid grid-rows-[1fr] items-center justify-items-center h-full p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="flex justify-between items-center w-full mb-8">
          <h1 className="text-4xl font-bold text-white">Your To-Do Lists</h1>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleLoginClick}
          >
            Go to Login
          </button>
        </header>

        <main className="flex flex-col gap-8 items-center sm:items-start">
          {/* Form to create new checklist */}
          <form onSubmit={handleCreateList} className="flex gap-4 mt-6 mb-8">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter new checklist name"
              className="p-2 border rounded-md text-black"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Checklist
            </button>
          </form>

          {/* Display error message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Display existing checklists */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
            {todoLists.map((list) => {
              const tasks = list.tasksList || []; // Default to an empty array
              const completedCount = tasks.filter(
                (task) => task.completed
              ).length;
              const totalTasks = tasks.length;

              return (
                <div
                  key={list.id}
                  className="p-4 border border-gray-300 bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-white">
                    {list.name}
                  </h2>
                  <p className="text-gray-400">
                    {completedCount} of {totalTasks} tasks completed
                  </p>
                  <ul className="text-gray-200">
                    {tasks.slice(0, 3).map((task, index) => (
                      <li key={index}>- {task.name}</li>
                    ))}
                    {tasks.length > 3 && <li>...</li>}
                  </ul>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleClick(list.id)}
                  >
                    View {list.name}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
