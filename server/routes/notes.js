import express from 'express';
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote,
  searchNotes
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all notes & create new note
router.route('/')
  .get(getNotes)
  .post(createNote);

// Search notes
router.get('/search', searchNotes);

// Get, update, and delete note by ID
router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

export default router;