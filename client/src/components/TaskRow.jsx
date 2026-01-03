const statusColors = {
  Pending: "bg-blue-50 text-blue-700",
  "In Progress": "bg-yellow-50 text-yellow-700",
  Completed: "bg-green-50 text-green-700",
};

const priorityColors = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700",
};

const TaskRow = ({ task, onEdit, onDelete, onView }) => {
  return (
    <tr className="border-b last:border-none hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-800">{task.title}</div>
        {task.category && (
          <div
            className="text-xs text-gray-500 mt-1 max-w-[240px] truncate"
            title={task.category}
          >
            {task.category}
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </td>

      <td className="px-6 py-4 text-gray-600">
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onView(task)}
            className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            View
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="px-3 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskRow;
