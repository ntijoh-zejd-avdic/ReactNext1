const ChecklistItem = ({ task, index, onToggle }) => {
  return (
    <li className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3 shadow-sm">
      <input
        type="checkbox"
        id={`task-${index}`}
        className="w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-400"
        checked={task.completed}
        onChange={() => onToggle(index)}
      />
      <label
        htmlFor={`task-${index}`}
        className="text-lg font-medium text-gray-700"
      >
        {task.name}
      </label>
    </li>
  );
};

export default ChecklistItem;
