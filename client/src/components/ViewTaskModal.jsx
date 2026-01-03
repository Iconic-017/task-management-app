import { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import { formatDateTime } from "../utils/dateUtils";

export default function ViewTaskModal({ task, onClose }) {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (task?._id) {
      loadActivityLogs();
    }
  }, [task?._id]);

  const loadActivityLogs = async () => {
    try {
      setLoadingLogs(true);
      const logs = await taskService.getActivityLogs(task._id);
      setActivityLogs(logs || []);
    } catch (error) {
      console.error("Failed to load activity logs:", error);
      setActivityLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatActivityText = (log) => {
    if (log.actionType === "Status Changed" && log.oldStatus && log.newStatus) {
      return `${log.oldStatus} → ${log.newStatus}`;
    }
    return log.details || log.actionType;
  };

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Task details</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Description
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              Status: {task.status}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              Priority: {task.priority}
            </span>
            {task.dueDate && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Activity
            </h3>

            {loadingLogs ? (
              <div className="text-sm text-gray-500 py-4 text-center">
                Loading activity...
              </div>
            ) : activityLogs.length === 0 ? (
              <div className="text-sm text-gray-500 py-4 text-center italic">
                No activity recorded yet
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div
                    key={log._id || log.createdAt}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm text-gray-800 font-medium">
                          {formatActivityText(log)}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                      {log.actionType && (
                        <span className="inline-block text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                          {log.actionType}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
