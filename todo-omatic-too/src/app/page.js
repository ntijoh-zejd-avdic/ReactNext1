"use client";

import FartButton from "./components/FartButton";
import ToDoList from "./components/ToDoList";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <FartButton />
        <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-gray-700">To-Do List</h1>

          <ToDoList />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
