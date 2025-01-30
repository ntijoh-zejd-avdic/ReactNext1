const API_BASE_URL = "http://localhost:3001";
const API_TODO_URL = "http://localhost:3001/todos";

export async function fetchChecklist(name, token) {
  try {
    const response = await fetch(`${API_TODO_URL}/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Checklist not found");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function updateTaskStatus(listId, taskId, completed, token) {
  try {
    const response = await fetch(`${API_TODO_URL}/${listId}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) throw new Error("Failed to update task");
  } catch (error) {
    console.error("API Error:", error);
  }
}

export async function addTask(listId, taskName, token) {
  try {
    const response = await fetch(`${API_TODO_URL}/${listId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: taskName }),
    });

    if (!response.ok) throw new Error("Failed to add task");
  } catch (error) {
    console.error("API Error:", error);
  }
}

export async function fetchTodoLists(token) {
  const response = await fetch(`${API_BASE_URL}/lists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch todo lists.");
  return response.json();
}

export async function createTodoList(name, token) {
  const response = await fetch(`${API_BASE_URL}/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, tasksList: [] }),
  });

  if (!response.ok) throw new Error("Failed to create checklist.");
  return response.json();
}
