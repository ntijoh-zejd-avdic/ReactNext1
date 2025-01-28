'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();

  // State for form control and error/success messages
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State to toggle between styled and unstyled versions
  const [isStyled, setIsStyled] = useState(true); // True for "beautiful" styles, false for default

  const toggleStyles = () => {
    setIsStyled(!isStyled); // Toggle styles on button click
    alert("Fart Man is here!");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? '/login' : '/signup';
    const data = { username, password };

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(isLogin ? 'Login successful!' : 'Signup successful!');
        setErrorMessage('');

        // Store the JWT token in localStorage
        localStorage.setItem('authToken', result.token); // Assuming the JWT is in the "token" field

        // Redirect user on successful login/signup
        router.push('/');
      } else {
        setErrorMessage(result.message || 'Something went wrong.');
        setSuccessMessage('');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setSuccessMessage('');
    }
  };

  // Return HTML for login/signup form
  return (
    <div className={`h-screen overflow-hidden ${isStyled ? 'bg-gradient-to-br from-gray-600 to-red-500' : 'bg-white'}`}>
      {/* Main Content */}
      <div className={`grid grid-rows-[1fr] items-center justify-items-center h-full p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]`}>
        <main className="flex flex-col gap-8 items-center sm:items-start">
          {isStyled ? (
            // Beautiful styled version
            <>
              <h1 className="text-4xl font-bold text-white">{isLogin ? 'Login' : 'Sign Up'}</h1>

              <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-md w-full sm:w-96">
                <div className="mb-4">
                  <label htmlFor="username" className="text-white">Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-3 mt-2 rounded bg-gray-800 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="text-white">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 mt-2 rounded bg-gray-800 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-3 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>

                {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-center mt-2">{successMessage}</p>}

                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="text-blue-400"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  >
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Simple unstyled version when Fart Man is pressed
            <div className="login-container">
              <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
              </form>

              <div className="toggle-btn">
                <button onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}>
                  {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                </button>
              </div>

              {errorMessage && <p className="error">{errorMessage}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
            </div>
          )}

          {/* Fart Man Button */}
          <button
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={toggleStyles}
          >
            Fart Man
          </button>
        </main>
      </div>
    </div>
  );
};

export default Login;
