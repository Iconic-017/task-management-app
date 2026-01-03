import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getActivityLogs,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/logs/activity', getActivityLogs);

export default router;

