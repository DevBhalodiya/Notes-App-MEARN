import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, BookOpen, Clock, Home, Tag, X } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const { notes } = useNotes();
  const [allTags, setAllTags] = useState<{ id: string; name: string; count: number }[]>([]);
  
  useEffect(() => {
    // Extract and count unique tags from all notes
    const tagMap = new Map<string, { id: string; name: string; count: number }>();
    
    notes.forEach(note => {
      note.tags.forEach(tag => {
        if (tagMap.has(tag.id)) {
          const existingTag = tagMap.get(tag.id)!;
          tagMap.set(tag.id, { ...existingTag, count: existingTag.count + 1 });
        } else {
          tagMap.set(tag.id, { id: tag.id, name: tag.name, count: 1 });
        }
      });
    });
    
    setAllTags(Array.from(tagMap.values()));
  }, [notes]);
  
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };
  
  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 }
  };
  
  // Count stats
  const totalNotes = notes.length;
  const pinnedNotes = notes.filter(note => note.isPinned).length;
  const archivedNotes = notes.filter(note => note.isArchived).length;
  
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-10 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md z-20 overflow-y-auto`}
        initial={isOpen ? "open" : "closed"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">NoteWise</h2>
            <button 
              onClick={closeSidebar}
              className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              <Home className="mr-3" size={18} />
              <span>All Notes</span>
              <span className="ml-auto bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                {totalNotes}
              </span>
            </NavLink>
            
            <NavLink
              to="/pinned"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              <BookOpen className="mr-3" size={18} />
              <span>Pinned</span>
              {pinnedNotes > 0 && (
                <span className="ml-auto bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {pinnedNotes}
                </span>
              )}
            </NavLink>
            
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              <Archive className="mr-3" size={18} />
              <span>Archive</span>
              {archivedNotes > 0 && (
                <span className="ml-auto bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {archivedNotes}
                </span>
              )}
            </NavLink>
            
            <NavLink
              to="/recent"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              <Clock className="mr-3" size={18} />
              <span>Recent</span>
            </NavLink>
          </nav>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Tags
            </h3>
            
            <div className="space-y-1">
              {allTags.length > 0 ? (
                allTags.map(tag => (
                  <NavLink
                    key={tag.id}
                    to={`/tags/${tag.id}`}
                    className={({ isActive }) =>
                      `flex items-center px-2 py-2 rounded-md ${
                        isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <Tag className="mr-3" size={18} />
                    <span>{tag.name}</span>
                    <span className="ml-auto bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                      {tag.count}
                    </span>
                  </NavLink>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">No tags yet</p>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;