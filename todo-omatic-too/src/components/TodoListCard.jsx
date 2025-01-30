const TodoListCard = ({ list, onClick }) => {
  const completedTasks = list.tasksList.filter((task) => task.completed).length;

  return (
    <div className="p-4 border border-gray-300 bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-white">{list.name}</h2>
      <p className="text-gray-400">
        {completedTasks} of {list.tasksList.length} tasks completed
      </p>
      <ul className="text-gray-200">
        {list.tasksList.slice(0, 3).map((task, index) => (
          <li key={index}>- {task.name}</li>
        ))}
        {list.tasksList.length > 3 && <li>...</li>}
      </ul>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onClick(list.id)}
      >
        View {list.name}
      </button>
    </div>
  );
};

export default TodoListCard;
