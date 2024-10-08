import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainPage from './pages/MainPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Button from './components/Button';
import Belt from './components/Belt';
import LoginPage from './pages/LoginPage';
import WritePage from './pages/WritePage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: '/write',
    element: <WritePage />,
  },
]);

root.render(
  <React.StrictMode>
    
    <div className="top-nav-bar">
      <Button url="/">Home</Button>
      <Belt direction="horizontal">
        <Button url="/write">Write</Button>
        <Button url="/login">Log In</Button>
      </Belt>
    </div>

    <RouterProvider router={router} />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
