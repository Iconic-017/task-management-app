import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    actionType: {
      type: String,
      enum: ['Created', 'Updated', 'Deleted', 'Status Changed'],
      required: true,
    },
    oldStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
    },
    newStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ActivityLog', activityLogSchema);

