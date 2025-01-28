"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const ChecklistPage = () => {
  const { title } = useParams();

  const [todoLists, setTodoLists] = useState([
    {
      id: 1,
      title: "Groceries",
      tasksList: [
        { name: "Buy milk", completed: false },
        { name: "Buy eggs", completed: false },
        { name: "Buy bread", completed: false },
        { name: "Buy butter", completed: false },
        { name: "Buy cheese", completed: false },
      ],
    },
    {
      id: 2,
      title: "Work",
      tasksList: [
        { name: "Finish report", completed: false },
        { name: "Send emails", completed: true },
        { name: "Attend meeting", completed: false },
        { name: "Review documents", completed: true },
        { name: "Prepare presentation", completed: true },
        { name: "Complete project", completed: true },
      ],
    },
    {
      id: 3,
      title: "VacationPrep",
      tasksList: [
        { name: "Book flights", completed: true },
        { name: "Reserve hotel", completed: false },
        { name: "Buy sunscreen", completed: false },
        { name: "Get travel insurance", completed: false },
        { name: "Pack bags", completed: false },
        { name: "Check itinerary", completed: true },
      ],
    },
  ]);

  // Find the selected list based on the URL parameter
  const selectedList = todoLists.find(
    (list) => list.title.toLowerCase() === title.toLowerCase()
  );

  if (!selectedList) {
    return <div className="text-center text-red-500">Checklist not found!</div>;
  }

  // Handle checkbox toggle
  const handleToggle = (taskIndex) => {
    setTodoLists((prevLists) =>
      prevLists.map((list) =>
        list.title.toLowerCase() === title.toLowerCase()
          ? {
              ...list,
              tasksList: list.tasksList.map((task, index) =>
                index === taskIndex
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : list
      )
    );
  };

  // Calculate completed tasks
  const completedCount = selectedList.tasksList.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-red-500 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {selectedList.title}
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
