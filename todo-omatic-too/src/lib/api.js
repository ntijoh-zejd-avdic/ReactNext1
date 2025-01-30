const API_BASE = "http://localhost:3001/todos";

export async function fetchChecklist(name, token) {
  try {
    const response = await fetch(`${API_BASE}/${name}`, {
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
    const response = await fetch(`${API_BASE}/${listId}/${taskId}`, {
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
    const response = await fetch(`${API_BASE}/${listId}`, {
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
