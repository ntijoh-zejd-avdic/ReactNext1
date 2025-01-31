const API_BASE_URL = "http://localhost:3001";

async function request(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

const Api = {
  getLists: (token) => request("/lists", "GET", null, token),
  createList: (name, token) => request("/lists", "POST", { name }, token),
  getChecklist: (listId, token) => request(`/todos/${listId}`, "GET", null, token),
  addTask: (listId, taskName, token) =>
    request(`/todos/${listId}`, "POST", { name: taskName }, token),
  updateTaskStatus: (listId, taskId, completed, token) =>
    request(`/todos/${listId}/${taskId}`, "PUT", { completed }, token),
};

export default Api;
