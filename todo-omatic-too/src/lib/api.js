const API_BASE_URL = "http://localhost:3001";

// Utility functions for localStorage
const fetchFromLocalStorage = (key, expirationTime = 3600000) => {
  const storedData = localStorage.getItem(key);
  const storedTime = localStorage.getItem(`${key}Timestamp`);

  const currentTime = new Date().getTime();

  if (storedData && storedTime && currentTime - storedTime < expirationTime) {
    console.log(
      `Fetching ${key} from localStorage. Expiration in ${Math.max(
        0,
        Math.round((expirationTime - (currentTime - storedTime)) / 60000)
      )} minutes.`
    );
    return JSON.parse(storedData);
  }

  return null;
};

const storeInLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`${key}Timestamp`, new Date().getTime().toString());
  console.log(`Stored ${key} in localStorage.`);
};

// Modified request function
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
  // Fetch all lists (with tasks) from localStorage or API
  getLists: async (token) => {
    const storedData = fetchFromLocalStorage("listData");
    if (storedData && storedData.lists) {
      console.log("Fetched lists from localStorage:", storedData);
      // Ensure each list has a tasksList property
      storedData.lists.forEach((list) => {
        if (!list.tasksList) {
          list.tasksList = []; // Default to an empty array if not present
        }
      });
      return storedData.lists;
    }

    console.log("Fetching lists from API...");
    const lists = await request("/lists", "GET", null, token);
    if (lists) {
      const data = { lists: lists };
      // Ensure each list has a tasksList property
      data.lists.forEach((list) => {
        if (!list.tasksList) {
          list.tasksList = []; // Default to an empty array if not present
        }
      });
      storeInLocalStorage("listData", data);
    }
    return lists;
  },

  // Fetch a specific checklist (tasks) for a list
  getChecklist: async (listId, token) => {
    const storedLists = fetchFromLocalStorage("listData")?.lists || [];
    console.log("Fetched lists from localStorage:", storedLists);
    if (storedLists) {
      const list = storedLists.find((l) => l.id === listId);
      if (list) {
        console.log(`Fetched checklist for list ${listId} from localStorage.`);
        return list.tasksList || []; // Ensure tasksList exists
      }
    }

    console.log(`Fetching checklist for list ${listId} from API...`);
    const tasks = await request(`/todos/${listId}`, "GET", null, token);
    if (tasks) {
      // Update the localStorage with tasks for the specific list
      const lists = fetchFromLocalStorage("listData").lists || [];
      const listIndex = lists.findIndex((l) => l.id === listId);
      if (listIndex !== -1) {
        lists[listIndex].tasksList = tasks || []; // Ensure tasksList is properly set
        storeInLocalStorage("listData", { lists }); // Update the whole list data object
      }
    }
    return tasks;
  },

  // Add a new list and store in centralized storage
  createList: async (name, token) => {
    const newList = await request("/lists", "POST", { name }, token);
    if (newList) {
      const storedData = fetchFromLocalStorage("listData") || { lists: [] }; // Default to an array
      newList.tasksList = newList.tasksList || [];
      storedData.lists.push(newList); // Push new list to array
      storeInLocalStorage("listData", storedData);
    }
    return newList;
  },

  // Add a new task to a specific list
  addTask: async (listId, taskName, token) => {
    console.log(`Adding task to checklist ${listId} via API...`);
    const newTask = await request(
      `/todos/${listId}`,
      "POST",
      { name: taskName },
      token
    );
    if (newTask) {
      const lists = fetchFromLocalStorage("listData").lists || [];
      const listIndex = lists.findIndex((l) => l.id === listId);
      if (listIndex !== -1) {
        lists[listIndex].tasksList = lists[listIndex].tasksList || [];
        lists[listIndex].tasksList.push(newTask); // Add new task to the list
        storeInLocalStorage("listData", { lists }); // Store the updated list data
      }
    }
    return newTask;
  },

  // Update the status of a task
  updateTaskStatus: async (listId, taskId, completed, token) => {
    console.log(
      `Updating task status for task ${taskId} in checklist ${listId} via API...`
    );
    const updatedTask = await request(
      `/todos/${listId}/${taskId}`,
      "PUT",
      { completed },
      token
    );
    if (updatedTask) {
      const lists = fetchFromLocalStorage("listData").lists || [];
      const listIndex = lists.findIndex((l) => l.id === listId);
      if (listIndex !== -1) {
        const taskIndex = lists[listIndex].tasksList.findIndex(
          (t) => t.id === taskId
        );
        if (taskIndex !== -1) {
          lists[listIndex].tasksList[taskIndex] = updatedTask; // Update the task
          storeInLocalStorage("listData", { lists });
        }
      }
    }
    return updatedTask;
  },

  // Clear all data from localStorage
  kill: () => {
    console.log("Removing all lists");
    localStorage.removeItem("listData");
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (key.startsWith("checklist_")) {
        localStorage.removeItem(key);
      }
    });
    console.log("User data cleared from localStorage.");
  },
};

export default Api;
