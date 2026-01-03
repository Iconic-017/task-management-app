import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";

const VALID_STATUS_TRANSITIONS = {
  Pending: ["In Progress"],
  "In Progress": ["Completed"],
  Completed: [],
};

const isValidStatusTransition = (oldStatus, newStatus) => {
  if (oldStatus === newStatus) return true;
  const allowedTransitions = VALID_STATUS_TRANSITIONS[oldStatus] || [];
  return allowedTransitions.includes(newStatus);
};

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    await ActivityLog.create({
      taskId: task._id,
      actionType: "Created",
      details: `Task "${task.title}" created`,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const oldStatus = task.status;
    const { status, ...otherFields } = req.body;

    if (status && status !== oldStatus) {
      if (!isValidStatusTransition(oldStatus, status)) {
        return res.status(400).json({
          error: `Invalid status transition: ${oldStatus} → ${status}. Allowed: ${
            VALID_STATUS_TRANSITIONS[oldStatus]?.join(", ") || "none"
          }`,
        });
      }

      await ActivityLog.create({
        taskId: task._id,
        actionType: "Status Changed",
        oldStatus,
        newStatus: status,
        details: `Status changed from ${oldStatus} to ${status}`,
      });
    }

    Object.assign(task, otherFields);
    if (status) {
      task.status = status;
    }

    await task.save();

    if (Object.keys(otherFields).length > 0) {
      await ActivityLog.create({
        taskId: task._id,
        actionType: "Updated",
        details: "Task details updated",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await ActivityLog.create({
      taskId: task._id,
      actionType: "Deleted",
      details: `Task "${task.title}" deleted`,
    });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const { taskId } = req.query;
    const filter = taskId ? { taskId } : {};

    const logs = await ActivityLog.find(filter)
      .populate("taskId", "title")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
