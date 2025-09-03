import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Notification from '../../components/Notification/Notification';
import InviteService from "../../services/InviteService";
import './RegisterView.css';

export default function RegisterView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cookoutIdFromLink = params.get('cookoutId');
    if (cookoutIdFromLink) {
      localStorage.setItem('pendingCookoutId', cookoutIdFromLink);
    }
  }, [location.search]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match.' });
      return;
    } 
    try {
      const response = await AuthService.register({
        username,
        password,
        confirmPassword,
        role: 'user',
      });
       
      setNotification({ type: 'success', message: 'Registration successful' });

      const pendingCookoutId = localStorage.getItem('pendingCookoutId');
      if (pendingCookoutId) {
        await InviteService.createInvite({
          cookoutId: pendingCookoutId,
          attendeeUsername: username,
        });
        setNotification({ type: 'success', message: 'Registration successful! You have been added to the cookout.' });
        localStorage.removeItem('pendingCookoutId');
      }

      navigate('/login');
    } catch(error) {
      const message = error.response?.data?.message || 'Registration failed.';
      setNotification({ type: 'error', message });
    }
  }

  return (
    <main>
      <section id="hero-section">
        <div id="hero-section-div">
          <div id="logo">
            <h1 className="logo-font">The</h1>
            <h1 className="logo-font">Cookout</h1>
          </div>
          <div id="burger-flame-container">
            <img 
              src="src\mediaAssets\logo.png" 
              alt="Flaming Burger" 
              id="burger-flame-image"
            />
          </div>
        </div>

        <div id="signup-panel">
          <h2>Create your account!</h2>
          <p>Please enter your details to register.</p>

          <Notification notification={notification} clearNotification={() => setNotification(null)} />

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
            </div>
            <div>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                required
                autoFocus
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                required
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <input type="submit" value="Register" />
          </form>

          <p style={{ textAlign: "center" }}>OR</p>

          <Link id="sign-in-style" to="/login">
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}