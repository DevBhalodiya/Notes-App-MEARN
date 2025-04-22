import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, X, Plus } from 'lucide-react';
import { TAG_COLORS } from '../../utils/constants';

interface NoteFormProps {
  initialValues?: {
    title: string;
    content: string;
    tags: { id: string; name: string; color: string }[];
    isPinned: boolean;
    isArchived: boolean;
  };
  onSubmit: (values: {
    title: string;
    content: string;
    tags: { id: string; name: string; color: string }[];
    isPinned: boolean;
    isArchived: boolean;
  }) => Promise<void>;
  submitButtonText: string;
}

const NoteForm = ({ initialValues, onSubmit, submitButtonText }: NoteFormProps) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [tags, setTags] = useState(initialValues?.tags || []);
  const [isPinned, setIsPinned] = useState(initialValues?.isPinned || false);
  const [isArchived, setIsArchived] = useState(initialValues?.isArchived || false);
  const [tagInput, setTagInput] = useState('');
  const [tagColor, setTagColor] = useState(TAG_COLORS[0].value);
  const [showTagForm, setShowTagForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setContent(initialValues.content);
      setTags(initialValues.tags);
      setIsPinned(initialValues.isPinned);
      setIsArchived(initialValues.isArchived);
    }
  }, [initialValues]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit({
        title,
        content,
        tags,
        isPinned,
        isArchived
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = {
      id: Date.now().toString(),
      name: tagInput.trim(),
      color: tagColor
    };
    
    setTags([...tags, newTag]);
    setTagInput('');
    setShowTagForm(false);
  };
  
  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="input"
          required
        />
      </div>
      
      <div>
        <label htmlFor="content" className="label">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="input min-h-[200px] resize-y"
          rows={8}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="label mb-0">Tags</label>
          <button
            type="button"
            onClick={() => setShowTagForm(!showTagForm)}
            className="text-primary-500 text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Tag
          </button>
        </div>
        
        {showTagForm && (
          <div className="flex items-start space-x-2 mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag name"
                className="input"
              />
            </div>
            
            <div>
              <select
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="input"
              >
                {TAG_COLORS.map((color) => (
                  <option key={color.name} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag.id}
                className={`${tag.color} px-3 py-1 rounded-full text-sm flex items-center`}
              >
                <Tag size={14} className="mr-1" />
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tags added yet. Add a tag to help organize your notes.
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-10 h-5 rounded-full transition-colors ${
            isPinned ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
          } flex items-center ${isPinned ? 'justify-end' : 'justify-start'}`}>
            <div className="w-4 h-4 bg-white dark:bg-gray-100 rounded-full transform transition-transform mx-0.5"></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Pin Note
          </span>
        </label>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isArchived}
            onChange={(e) => setIsArchived(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-10 h-5 rounded-full transition-colors ${
            isArchived ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
          } flex items-center ${isArchived ? 'justify-end' : 'justify-start'}`}>
            <div className="w-4 h-4 bg-white dark:bg-gray-100 rounded-full transform transition-transform mx-0.5"></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Archive Note
          </span>
        </label>
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : submitButtonText}
        </button>
        
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;