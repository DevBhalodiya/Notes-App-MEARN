import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import NoteCard from '../../components/notes/NoteCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const ArchivedNotes = () => {
  const { notes, loading, fetchNotes } = useNotes();
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  const archivedNotes = notes.filter(note => note.isArchived);
  
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (archivedNotes.length === 0) {
    return (
      <EmptyState
        title="No archived notes"
        description="Archive notes you want to keep but don't need right now."
      />
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Archived Notes
        </h1>
        
        <Link to="/notes/create" className="btn btn-primary flex items-center">
          <Plus size={20} className="mr-1" />
          <span className="hidden md:inline">New Note</span>
        </Link>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
        {archivedNotes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </motion.div>
    </div>
  );
};

export default ArchivedNotes;