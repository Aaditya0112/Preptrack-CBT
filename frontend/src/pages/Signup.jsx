import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  // const classes = ['9th','10th','11th','12th','12th Pass'];
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('9th');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [exam, setExam] = useState('JEE Advanced');
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { signupUser } = useAuth();

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signupUser({
        mobile: phone,
        full_name: name,
        password,
        grade: selectedClass,
        role: 'STUDENT',
      });
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.detail || 'Unable to sign up';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Signup</h2>
          <p className="mt-2 text-sm text-gray-600">Already have an account? <Link to="/" className="text-blue-600 font-medium">Login</Link></p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSignup}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1 relative rounded-full shadow-sm">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-12 py-3 border border-gray-200 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
              />
              <div className="absolute left-4 top-3 text-gray-400 pr-2">👤</div>
            </div>
          </div>

          
          

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <div className="mt-1 flex rounded-full shadow-sm overflow-hidden border border-gray-200">
              <div className="px-4 flex items-center bg-white gap-2">
                <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-5 h-4object-cover" />
                <span className="text-gray-700">+91</span>
                <span className="text-gray-200">|</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 py-3 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-full shadow-sm">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-12 py-3 border border-gray-200 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                required
              />
              <div className="absolute left-4 top-3 text-gray-400 pr-2">🔒</div>
            </div>
          </div>

          <div>
            <label htmlFor="exam" className="block text-sm font-medium text-gray-700">Which exam are you preparing for?</label>
            <select
              id="exam"
              name="exam"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="mt-1 block w-full px-6 py-3 border border-gray-200 rounded-full placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            >
              <option>JEE Advanced</option>
              <option>JEE Main</option>
              <option>NEET</option>
              <option>CBSE Board</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex items-start gap-3">
            <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="agree" className="text-sm text-gray-600">By signing up you agree to our <a href="#" className="text-blue-600 underline">Terms of use</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a></label>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={!agree || submitting}
              className={`w-full py-3 rounded-full text-white font-semibold ${agree ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {submitting ? 'Signing up...' : 'Signup'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
