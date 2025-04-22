import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../../context/NotesContext';
import NoteForm from '../../components/notes/NoteForm';
import Spinner from '../../components/ui/Spinner';

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, updateNote, fetchNotes } = useNotes();
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
  
  const handleSubmit = async (values: any) => {
    if (id) {
      await updateNote(id, values);
    }
  };
  
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
  
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Note
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <NoteForm
          initialValues={{
            title: note.title,
            content: note.content,
            tags: note.tags,
            isPinned: note.isPinned,
            isArchived: note.isArchived,
          }}
          onSubmit={handleSubmit}
          submitButtonText="Update Note"
        />
      </div>
    </div>
  );
};

export default EditNote;