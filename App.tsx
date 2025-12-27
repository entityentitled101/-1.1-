import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CharacterList from './pages/CharacterList';
import CharacterEditor from './pages/CharacterEditor';
import LocationEditor from './pages/LocationEditor';

// In this React 18 era, we use functional components and hooks exclusively.
// The Router is strictly HashRouter to avoid server-side routing issues in MVP.
const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/create" element={<CharacterEditor />} />
          <Route path="/character/:id" element={<CharacterEditor />} />
          <Route path="/location/:id" element={<LocationEditor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;