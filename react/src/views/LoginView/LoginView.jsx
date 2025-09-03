import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Notification from '../../components/Notification/Notification';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import './LoginView.css';

export default function LoginView() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  function handleSubmit(event) {
    event.preventDefault();
    AuthService.login({ username, password })
      .then((response) => {
        const user = response.data.user;
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
       
        setUser(user);
       
        navigate('/');
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Login failed.';
        setNotification({ type: 'error', message: message });
      });
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
        <div id="login-panel">
          <h2>Welcome back!</h2>
          <p>Please enter your details to login.</p>
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
                onChange={event => setUsername(event.target.value)} 
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
                onChange={event => setPassword(event.target.value)} 
              />
            </div>
            <input type="submit" value="Sign in" />
          </form>
          <p style={{ textAlign: "center" }}>OR</p>
          <Link id="sign-up-style" to="/register">
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}