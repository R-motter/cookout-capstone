import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';


export default function MainNav() {
  const { user } = useContext(UserContext);

  return (
    <nav id="main-nav" className="nav-list">
      <div className="nav-link">
        {/* <NavLink to="/">Home</NavLink> */}
      </div>
      {user ? (
        <>
          {/*<div className="nav-link">
            <NavLink to="/userProfile">
              Profile
            </NavLink>
      </div>*/}
          {/* <div className="nav-link">
            <Link to="/logout">
              Logout
            </Link>
          </div> */}
        </>
      ) : (
        <div className="nav-link">
          {/* <NavLink to="/login">
            Login
          </NavLink> */}
        </div>
      )}
      {/*
        <div className="nav-link">
            <NavLink to="/cookouts">
              Cookouts
            </NavLink>
          </div>
          
          
          <div className="nav-link">
            <NavLink to ="/invite">
              Invites
            </NavLink>
          </div>

          <div className="nav-link">
            <NavLink to ="/menu">
              Menus
            </NavLink>
          </div>

          <div className="nav-link">
            <NavLink to ="/order">
              Orders
            </NavLink>
      </div>*/}

    </nav>
  );
}
