import React, { useState } from 'react';
import Api from '../Api';
import '../index.css';
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
 console.log(  name,
        email,
        password);
    try {
     
      const response = await Api.post('/register', {
        name,
        email,
        password
      });
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      setStatus(msg);
      console.log(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form  className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          type="submit" onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        {status && <p className="mt-4 text-center text-sm text-red-600">{status}</p>}
        <Link to="/register" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </form>
    </div>
  );
};

export default Register;
