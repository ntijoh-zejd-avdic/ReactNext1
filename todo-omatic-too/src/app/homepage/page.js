"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function LandingPage() {
  const router = useRouter();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Delay text appearance for effect
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-700 to-red-500 text-white">
      {/* Header Component */}
      <Header title="Home" buttonLabel="Go to Login" buttonAction={() => router.push("/login")} buttonColor="bg-green-500" />
      
      {/* Animated Title */}
      <h1 className={`text-5xl font-bold transition-opacity duration-700 ${showText ? "opacity-100" : "opacity-0"}`}>
        Welcome to Your Task Hub
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-lg text-gray-300">Organize your tasks with style.</p>

      {/* Enter Button */}
      <button
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        onClick={() => router.push("/login")}
      >
        Login to Start
      </button>

      {/* Invisible Easter Egg (Takes to MapleStory) */}
      <div
        className="absolute top-10 left-4 w-16 h-16 opacity-0 cursor-pointer"
        onClick={() => window.location.href = "https://www.nexon.com/maplestory/"}
      ></div>
    </div>
  );
}
