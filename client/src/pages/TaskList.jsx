import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import DeleteModal from "../components/DeleteModal";
import AISuggestionPanel from "../components/AISuggestionPanel";
import { taskService } from "../services/taskService";
import TaskRow from "../components/TaskRow";
import ViewTaskModal from "../components/ViewTaskModal";
import "./TaskList.css";

const TaskList = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });
  const [viewingTask, setViewingTask] = useState(null);
  const [draftTask, setDraftTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks(filters);
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      setShowForm(false);
      setDraftTask(null);
      loadTasks();
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(editingTask._id, taskData);
      setEditingTask(null);
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task");
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTaskToDelete(null);
      loadTasks();
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleAITitleSelected = (title) => {
    setDraftTask({
      title,
      description: "",
      category: "",
      priority: "Medium",
      dueDate: "",
      status: "Pending",
    });
    setEditingTask(null);
    setShowForm(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "All" ? "" : value,
    }));
  };

  return (
    <div className="task-list-container">
      <header className="app-header">
        <h1>Task Management</h1>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <AISuggestionPanel onTitleSelected={handleAITitleSelected} />

          <div className="filters-section">
            <h2>Filters</h2>
            <div className="filter-group">
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={filters.status || "All"}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="priority-filter">Priority</label>
              <select
                id="priority-filter"
                value={filters.priority || "All"}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="tasks-header">
            <h2>Tasks ({tasks.length})</h2>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingTask(null);
                setDraftTask(null);
                setShowForm(true);
              }}
            >
              + New Task
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showForm && !editingTask && (
            <div className="form-section">
              <TaskForm
                task={draftTask}
                onSubmit={handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  setDraftTask(null);
                }}
              />
            </div>
          )}

          {showForm && editingTask && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            >
              <div
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Update Task
                    </h2>
                    <p className="text-sm text-gray-500">
                      Modify task details and status
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                    className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-6 py-5">
                  <TaskForm
                    task={editingTask}
                    onSubmit={handleUpdateTask}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              No tasks found. Create your first task!
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Due
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onView={setViewingTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {taskToDelete && (
        <DeleteModal
          task={taskToDelete}
          onConfirm={handleDeleteTask}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {viewingTask && (
        <ViewTaskModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
