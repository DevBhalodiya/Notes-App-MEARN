import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid, List, Search, Plus } from 'lucide-react';
import { useNotes, Note } from '../../context/NotesContext';
import NoteCard from '../../components/notes/NoteCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const Notes = () => {
  const { notes, loading, fetchNotes, viewMode, setViewMode } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      setFilteredNotes(
        notes.filter(
          note =>
            note.title.toLowerCase().includes(lowerCaseSearch) ||
            note.content.toLowerCase().includes(lowerCaseSearch) ||
            note.tags.some(tag => tag.name.toLowerCase().includes(lowerCaseSearch))
        )
      );
    }
  }, [notes, searchTerm]);
  
  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter(note => note.isPinned && !note.isArchived);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned && !note.isArchived);
  
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (notes.length === 0) {
    return (
      <EmptyState
        title="No notes yet"
        description="Create your first note to get started with NoteWise."
      />
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">My Notes</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="input pl-10"
            />
          </div>
          
          <div className="flex items-center border dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <List size={20} />
            </button>
          </div>
          
          <Link to="/notes/create" className="btn btn-primary flex items-center">
            <Plus size={20} className="mr-1" />
            <span className="hidden md:inline">New Note</span>
          </Link>
        </div>
      </div>
      
      {filteredNotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No notes found matching your search.</p>
        </div>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                Pinned Notes
              </h2>
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              } gap-4`}>
                {pinnedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            </div>
          )}
          
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Other Notes
                </h2>
              )}
              <motion.div 
                className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                } gap-4`}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {unpinnedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;