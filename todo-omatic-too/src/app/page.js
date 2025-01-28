"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const handleClick = (title) => {
    router.push(`/checklist/${title.toLowerCase()}`);
  };

  const [todoLists, setTodoLists] = useState([
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
      title: "VacationPrep",
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

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-600 to-red-500">
      {/* Main Content */}
      <div className="grid grid-rows-[1fr] items-center justify-items-center h-full p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 items-center sm:items-start">
          <h1 className="text-4xl font-bold text-white">Your To-Do Lists</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
            {todoLists.map((list) => (
              <div
                key={list.id}
                className="p-4 border border-gray-300 bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-white">
                  {list.title}
                </h2>
                <p className="text-gray-400">
                  {list.completed} of {list.tasks} tasks completed
                </p>
                <ul className="text-gray-200">
                  {list.tasksList.slice(0, 3).map((task, index) => (
                    <li key={index}>- {task}</li>
                  ))}
                  <li>...</li>
                </ul>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleClick(list.title)}
                >
                  View {list.title}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
