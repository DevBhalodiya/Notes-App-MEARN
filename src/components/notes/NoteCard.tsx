import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Archive, Pin, Trash, Edit, MoreVertical, Tag } from 'lucide-react';
import { Note, useNotes } from '../../context/NotesContext';

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const { togglePinNote, toggleArchiveNote, deleteNote } = useNotes();
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/notes/${note._id}`);
  };
  
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinNote(note._id);
  };
  
  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleArchiveNote(note._id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/notes/${note._id}/edit`);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note._id);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    navigate(`/tags/${tagId}`);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Truncate content
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  return (
    <motion.div 
      className={`note-card ${note.isPinned ? 'border-l-4 border-primary-500' : ''}`}
      whileHover={{ y: -5 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          {truncateContent(note.title, 30)}
        </h3>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical size={16} />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handlePin}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Pin size={16} className="mr-2" />
                {note.isPinned ? 'Unpin Note' : 'Pin Note'}
              </button>
              
              <button
                onClick={handleArchive}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Archive size={16} className="mr-2" />
                {note.isArchived ? 'Unarchive Note' : 'Archive Note'}
              </button>
              
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit Note
              </button>
              
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Delete Note
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-3">
        {truncateContent(note.content, 120)}
      </p>
      
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <button
              key={tag.id}
              onClick={(e) => handleTagClick(e, tag.id)}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tag.color} hover:opacity-80 transition-opacity`}
            >
              <Tag size={12} className="mr-1" />
              {tag.name}
            </button>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formatDate(note.updatedAt)}
      </div>
    </motion.div>
  );
};

export default NoteCard;