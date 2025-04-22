import Note from '../models/Note.js';

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single note
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { title, content, tags = [], isPinned = false, isArchived = false } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Validate tags structure
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }

    // Ensure each tag has required properties
    const validTags = tags.every(tag => 
      tag && typeof tag.name === 'string' && typeof tag.color === 'string'
    );

    if (!validTags) {
      return res.status(400).json({ 
        message: 'Each tag must have a name and color property' 
      });
    }
    
    const note = await Note.create({
      title,
      content,
      tags,
      isPinned,
      isArchived,
      user: req.user.id
    });
    
    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }
    
    const { title, content, tags, isPinned, isArchived } = req.body;

    // Validate title if provided
    if (title !== undefined && !title) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    // Validate tags if provided
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: 'Tags must be an array' });
      }

      const validTags = tags.every(tag => 
        tag && typeof tag.name === 'string' && typeof tag.color === 'string'
      );

      if (!validTags) {
        return res.status(400).json({ 
          message: 'Each tag must have a name and color property' 
        });
      }
    }
    
    // Update fields if provided
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;
    
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }
    
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search notes
// @route   GET /api/notes/search
// @access  Private
const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const notes = await Note.find({
      $and: [
        { user: req.user.id },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { 'tags.name': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getNotes, getNoteById, createNote, updateNote, deleteNote, searchNotes };