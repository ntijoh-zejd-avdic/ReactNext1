import { create } from "zustand";
import Api from "@/lib/api";

const useTodoStore = create((set) => ({
  lists: [],
  loadingLists: false,
  loadingChecklist: false,
  tasks: [],
  error: "",

  // Fetch all lists
  fetchLists: async (token) => {
    set({ loadingLists: true, error: "" });
    try {
      const lists = await Api.getLists(token);
      set({ lists: lists || [], loadingLists: false });
    } catch (err) {
      set({ error: "Failed to fetch lists.", loadingLists: false });
    }
  },

  // Create a new list
  addList: async (name, token) => {
    try {
      const newList = await Api.createList(name, token);
      if (newList) {
        set((state) => ({ lists: [...state.lists, newList] }));
      }
    } catch (err) {
      set({ error: "Failed to create list." });
    }
  },

  // Fetch tasks for a specific list
  fetchChecklist: async (listId, token) => {
    set({ loadingChecklist: true, error: "" });
    try {
      const tasks = await Api.getChecklist(listId, token);
      set({ tasks: tasks || [], loadingChecklist: false });
    } catch (err) {
      set({ error: "Failed to fetch checklist.", loadingChecklist: false });
    }
  },

  // Add a task to a list
  addTask: async (listId, taskName, token) => {
    try {
      const newTask = await Api.addTask(listId, taskName, token);
      set((state) => ({
        tasks: [...state.tasks, newTask], // Adding task to the specific list's tasks
      }));
    } catch (err) {
      set({ error: "Failed to add task." });
    }
  },

  // Update task status
  updateTaskStatus: async (listId, taskId, completed, token) => {
    try {
      await Api.updateTaskStatus(listId, taskId, completed, token);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed } : task
        ),
      }));
    } catch (err) {
      set({ error: "Failed to update task status." });
    }
  },

  // Clear error messages
  clearError: () => set({ error: "" }),
}));

export default useTodoStore;
