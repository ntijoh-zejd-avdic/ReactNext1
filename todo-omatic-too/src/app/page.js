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
        { name: "Finish report", completed: true },
        { name: "Send emails", completed: true },
        { name: "Attend meeting", completed: true },
        { name: "Review documents", completed: true },
        { name: "Prepare presentation", completed: true },
        { name: "Complete project", completed: true },
      ],
    },
    {
      id: 3,
      title: "VacationPrep",
      tasksList: [
        { name: "Book flights", completed: false },
        { name: "Reserve hotel", completed: false },
        { name: "Buy sunscreen", completed: false },
        { name: "Get travel insurance", completed: false },
        { name: "Pack bags", completed: false },
        { name: "Check itinerary", completed: true },
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
            {todoLists.map((list) => {
              const completedCount = list.tasksList.filter(
                (task) => task.completed
              ).length;
              const totalTasks = list.tasksList.length;

              return (
                <div
                  key={list.id}
                  className="p-4 border border-gray-300 bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-white">
                    {list.title}
                  </h2>
                  <p className="text-gray-400">
                    {completedCount} of {totalTasks} tasks completed
                  </p>
                  <ul className="text-gray-200">
                    {list.tasksList.slice(0, 3).map((task, index) => (
                      <li key={index}>- {task.name}</li>
                    ))}
                    {list.tasksList.length > 3 && <li>...</li>}
                  </ul>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleClick(list.title)}
                  >
                    View {list.title}
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
