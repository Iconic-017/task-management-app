import { formatDate, isPastDue } from "../utils/dateUtils";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const pastDue = isPastDue(task.dueDate);
  const priorityColors = {
    Low: "#4CAF50",
    Medium: "#FF9800",
    High: "#F44336",
  };

  const statusColors = {
    Pending: "#9E9E9E",
    "In Progress": "#2196F3",
    Completed: "#4CAF50",
  };

  const getNextStatus = () => {
    if (task.status === "Pending") return "In Progress";
    if (task.status === "In Progress") return "Completed";
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div
      className={`task-card ${
        pastDue && task.status !== "Completed" ? "past-due" : ""
      }`}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span
            className="badge priority"
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {task.priority}
          </span>
          <span
            className="badge status"
            style={{ backgroundColor: statusColors[task.status] }}
          >
            {task.status}
          </span>
        </div>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="meta-item">
          <strong>Category:</strong> {task.category}
        </div>
        <div className={`meta-item ${pastDue ? "past-due-text" : ""}`}>
          <strong>Due:</strong> {formatDate(task.dueDate)}
          {pastDue && task.status !== "Completed" && (
            <span className="past-due-indicator"> (Past Due)</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        {nextStatus && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onStatusChange(task._id, nextStatus)}
          >
            Mark as {nextStatus}
          </button>
        )}
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
