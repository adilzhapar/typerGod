import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Link,
  useRoutes
  
} from "react-router-dom";

import About from './components/about';
import Home from './components/home';
import Users from './components/users';

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "about", element: <About /> },
    { path: "users", element: <Users /> },
  ]);
  return routes;
};


const AppWrapper = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
      </div>
      <App />
    </Router>
  );
};

export default AppWrapper;