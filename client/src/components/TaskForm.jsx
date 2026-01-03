import { useState, useEffect } from "react";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    category: task?.category || "",
    priority: task?.priority || "Medium",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
    status: task?.status || "Pending",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "",
        priority: task.priority || "Medium",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        status: task.status || "Pending",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
        dueDate: "",
        status: "Pending",
      });
    }
    setTouched({});
    setErrors({});
  }, [task]);

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return value.trim() === "" ? "Title is required" : "";
      case "description":
        return value.trim() === "" ? "Description is required" : "";
      case "category":
        return value.trim() === "" ? "Category is required" : "";
      case "dueDate":
        return value === "" ? "Due date is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name] && touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const newErrors = {};
    const requiredFields = ["title", "description", "category", "dueDate"];
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        requiredFields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {})
      );
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.title && errors.title ? "error" : ""}
          required
        />
        {touched.title && errors.title && (
          <span className="error-text">{errors.title}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          className={touched.description && errors.description ? "error" : ""}
          required
        />
        {touched.description && errors.description && (
          <span className="error-text">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.category && errors.category ? "error" : ""}
          required
        />
        {touched.category && errors.category && (
          <span className="error-text">{errors.category}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority *</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.dueDate && errors.dueDate ? "error" : ""}
            required
          />
          {touched.dueDate && errors.dueDate && (
            <span className="error-text">{errors.dueDate}</span>
          )}
        </div>
      </div>

      {task && (
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
