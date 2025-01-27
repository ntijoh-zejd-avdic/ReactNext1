"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const ChecklistPage = () => {
  const { title } = useParams();

  const [todoLists] = useState([
    {
      id: 1,
      title: "Groceries",
      tasks: 5,
      completed: 2,
      tasksList: [
        "Buy milk",
        "Buy eggs",
        "Buy bread",
        "Buy butter",
        "Buy cheese",
      ],
    },
    {
      id: 2,
      title: "Work",
      tasks: 10,
      completed: 6,
      tasksList: [
        "Finish report",
        "Send emails",
        "Attend meeting",
        "Review documents",
        "Prepare presentation",
        "Complete project",
      ],
    },
    {
      id: 3,
      title: "Vacation Prep",
      tasks: 8,
      completed: 3,
      tasksList: [
        "Book flights",
        "Reserve hotel",
        "Buy sunscreen",
        "Get travel insurance",
        "Pack bags",
        "Check itinerary",
      ],
    },
  ]);

  const selectedList = todoLists.find(
    (list) => list.title.toLowerCase() === title.toLowerCase()
  );

  if (!selectedList) {
    return <div className="text-center text-red-500">Checklist not found!</div>;
  }

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
              />
              <label
                htmlFor={`task-${index}`}
                className="text-lg font-medium text-gray-700"
              >
                {task}
              </label>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {selectedList.completed} of {selectedList.tasks} tasks completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
