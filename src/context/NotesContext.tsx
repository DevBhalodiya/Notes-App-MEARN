import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/constants';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
  searchNotes: (query: string) => Note[];
  filterByTag: (tagId: string | null) => Note[];
  togglePinNote: (id: string) => Promise<void>;
  toggleArchiveNote: (id: string) => Promise<void>;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const savedMode = localStorage.getItem('viewMode');
    return (savedMode as 'grid' | 'list') || 'grid';
  });

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const fetchNotes = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(`${API_URL}/api/notes`, note, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotes(prev => [...prev, response.data]);
      toast.success('Note created successfully!');
      return response.data;
    } catch (err) {
      toast.error('Failed to create note');
      throw err;
    }
  };

  const updateNote = async (id: string, note: Partial<Note>) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.put(`${API_URL}/api/notes/${id}`, note, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotes(prev => prev.map(n => n._id === id ? response.data : n));
      toast.success('Note updated successfully!');
      return response.data;
    } catch (err) {
      toast.error('Failed to update note');
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotes(prev => prev.filter(n => n._id !== id));
      toast.success('Note deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete note');
      throw err;
    }
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note._id === id);
  };

  const searchNotes = (query: string) => {
    if (!query) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) || 
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
    );
  };

  const filterByTag = (tagId: string | null) => {
    if (!tagId) return notes;
    
    return notes.filter(note => 
      note.tags.some(tag => tag.id === tagId)
    );
  };

  const togglePinNote = async (id: string) => {
    const note = notes.find(n => n._id === id);
    if (!note) return;
    
    await updateNote(id, { isPinned: !note.isPinned });
  };

  const toggleArchiveNote = async (id: string) => {
    const note = notes.find(n => n._id === id);
    if (!note) return;
    
    await updateNote(id, { isArchived: !note.isArchived });
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        getNoteById,
        searchNotes,
        filterByTag,
        togglePinNote,
        toggleArchiveNote,
        viewMode,
        setViewMode
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};