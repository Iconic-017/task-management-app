// import { useState, useEffect } from 'react';
// import TaskList from './pages/TaskList';
// import Login from './pages/Login';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('token');
//       setIsAuthenticated(!!token);
//       setLoading(false);
//     };

//     checkAuth();

//     // Check for token changes (e.g., after login)
//     const interval = setInterval(checkAuth, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Login />;
//   }

//   return <TaskList onLogout={handleLogout} />;
// }

// export default App;













import { useState, useEffect } from 'react';
import TaskList from './pages/TaskList';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // ✅ THIS IS THE IMPORTANT PART
    return <Login onLogin={handleLogin} />;
  }

  return <TaskList onLogout={handleLogout} />;
}

export default App;
