import { useNotes } from '../../context/NotesContext';
import NoteForm from '../../components/notes/NoteForm';

const CreateNote = () => {
  const { createNote } = useNotes();
  
  const handleSubmit = async (values: any) => {
    await createNote(values);
  };
  
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Create New Note
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <NoteForm
          onSubmit={handleSubmit}
          submitButtonText="Create Note"
        />
      </div>
    </div>
  );
};

export default CreateNote;