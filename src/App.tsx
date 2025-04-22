import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Spinner from './components/ui/Spinner';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Notes = lazy(() => import('./pages/notes/Notes'));
const NoteDetail = lazy(() => import('./pages/notes/NoteDetail'));
const CreateNote = lazy(() => import('./pages/notes/CreateNote'));
const EditNote = lazy(() => import('./pages/notes/EditNote'));
const PinnedNotes = lazy(() => import('./pages/notes/PinnedNotes'));
const ArchivedNotes = lazy(() => import('./pages/notes/ArchivedNotes'));
const TagNotes = lazy(() => import('./pages/notes/TagNotes'));
const RecentNotes = lazy(() => import('./pages/notes/RecentNotes'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Spinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Notes />} />
          <Route path="pinned" element={<PinnedNotes />} />
          <Route path="archive" element={<ArchivedNotes />} />
          <Route path="recent" element={<RecentNotes />} />
          <Route path="tags/:tagId" element={<TagNotes />} />
          <Route path="notes/create" element={<CreateNote />} />
          <Route path="notes/:id" element={<NoteDetail />} />
          <Route path="notes/:id/edit" element={<EditNote />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;