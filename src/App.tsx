import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import ProjectDetails from './pages/ProjectDetails';
import ProjectForm from './pages/components/ProjectForm';
import { ProtectedRoute } from './helper';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (just reuse ProtectedRoute everywhere) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/project" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>}/>
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails/></ProtectedRoute>} />


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;