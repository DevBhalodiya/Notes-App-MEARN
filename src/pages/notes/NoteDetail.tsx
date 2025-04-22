import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Archive, Edit, Trash, ArrowLeft, Pin } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import Spinner from '../../components/ui/Spinner';

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, deleteNote, togglePinNote, toggleArchiveNote, fetchNotes } = useNotes();
  const [note, setNote] = useState(id ? getNoteById(id) : undefined);
  const [loading, setLoading] = useState(!note);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!note && id) {
      setLoading(true);
      fetchNotes().then(() => {
        const foundNote = getNoteById(id);
        if (foundNote) {
          setNote(foundNote);
        } else {
          navigate('/not-found');
        }
        setLoading(false);
      });
    }
  }, [id, note, getNoteById, fetchNotes, navigate]);
  
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (!note) {
    return null;
  }
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note._id);
      navigate('/');
    }
  };
  
  const handleTogglePin = async () => {
    await togglePinNote(note._id);
    setNote(getNoteById(note._id));
  };
  
  const handleToggleArchive = async () => {
    await toggleArchiveNote(note._id);
    setNote(getNoteById(note._id));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
          <ArrowLeft size={20} className="mr-1" />
          <span>Back to notes</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded-full ${
              note.isPinned
                ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={20} />
          </button>
          
          <button
            onClick={handleToggleArchive}
            className={`p-2 rounded-full ${
              note.isArchived
                ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={note.isArchived ? 'Unarchive note' : 'Archive note'}
          >
            <Archive size={20} />
          </button>
          
          <Link
            to={`/notes/${note._id}/edit`}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit note"
          >
            <Edit size={20} />
          </Link>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
            title="Delete note"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
      
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {note.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <span key={tag.id} className={`tag ${tag.color}`}>
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {formatDate(note.updatedAt)}
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {note.content}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NoteDetail;