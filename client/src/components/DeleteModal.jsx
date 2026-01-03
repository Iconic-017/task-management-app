const DeleteModal = ({ task, onConfirm, onCancel }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Delete</h2>
        <p>
          Are you sure you want to delete the task{" "}
          <strong>"{task.title}"</strong>?
        </p>
        <p className="warning-text">This action cannot be undone.</p>
        <div className="modal-actions">
          <button
            className="btn btn-danger"
            onClick={() => onConfirm(task._id)}
          >
            Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
