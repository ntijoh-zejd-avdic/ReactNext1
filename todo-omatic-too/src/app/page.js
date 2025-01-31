"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchTodoLists, createTodoList } from "@/lib/api";
import TodoListCard from "@/components/TodoListCard";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  const [todoLists, setTodoLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      fetchTodoLists(token)
        .then((data) => {
          if (data) setTodoLists(data);
          else console.log("Found no Lists");
        })
        .catch((err) => console.error("Error fetching todo lists:", err));
    }
  }, [token]);

  const handleClick = (id) => router.push(`/checklist/${id}`);
  const handleLoginClick = () => router.push("/login");

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return setError("Checklist name cannot be empty.");
    if (!token) return setError("You must be logged in to create a checklist.");

    setError("");
    setNewListName("");

    const result = await createTodoList(newListName, token);
    if (!result.success)
      setError(result.message || "Failed to create checklist.");
    if (token) {
      fetchTodoLists(token)
        .then((data) => {
          if (data) setTodoLists(data);
          else console.log("Found no Lists");
        })
        .catch((err) => console.error("Error fetching todo lists:", err));
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-600 to-red-500">
      <div className="grid grid-rows-[1fr] items-center justify-items-center h-full p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Header
          title="Home"
          buttonLabel="Go to Login"
          buttonAction={handleLoginClick}
          buttonColor="bg-green-500"
        />

        <main className="flex flex-col items-center gap-8 w-full">
          <h1 className="text-3xl font-bold font-serif text-gray-100 mt-10 sm:mt-20">
            Your To-Do Lists
          </h1>

          <div
            className="absolute top-16 left-4 w-20 h-20 opacity-0 cursor-pointer"
            onClick={() =>
              (window.location.href = "https://www.nexon.com/maplestory/")
            }
          ></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {todoLists.map((list) => (
              <TodoListCard key={list.id} list={list} onClick={handleClick} />
            ))}
          </div>

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

          {error && <p className="text-red-500">{error}</p>}
        </main>
      </div>
    </div>
  );
}
