import { useState } from 'react';
import { authService } from '../services/authService';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isUsernameValid = username.trim().length >= 3;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isUsernameValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Username must be at least 3 characters and password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authService.login(username, password);
      onLogin(res.token);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-sm px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Task Manager
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                placeholder="Enter username"
                className="w-full h-11 px-4 rounded-lg border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                           focus:border-indigo-500"
              />
              {username && username.length < 3 && (
                <p className="text-xs text-red-500 mt-1">
                  Username must be at least 3 characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter password"
                className="w-full h-11 px-4 rounded-lg border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                           focus:border-indigo-500"
              />
              {password && password.length < 6 && (
                <p className="text-xs text-red-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full h-11 rounded-lg font-semibold text-white
                transition-all
                ${
                  loading || !isFormValid
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Demo authentication via AWS Lambda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
