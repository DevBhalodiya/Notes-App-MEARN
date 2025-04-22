import { motion } from 'framer-motion';
import { File, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

const EmptyState = ({ 
  title, 
  description, 
  ctaText = 'Create Note', 
  ctaLink = '/notes/create' 
}: EmptyStateProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
        <File className="w-10 h-10 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      <Link to={ctaLink} className="btn btn-primary flex items-center">
        <Plus className="w-4 h-4 mr-1" />
        {ctaText}
      </Link>
    </motion.div>
  );
};

export default EmptyState;