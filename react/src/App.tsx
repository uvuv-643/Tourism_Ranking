import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from "react";
import './scss/main.scss'
import Home from "./pages/Home/Home";
import axios from "axios";

axios.defaults.baseURL = 'https://api.uvuv643.ru/'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Home />
      )
    },
  ]);


  return (
    <RouterProvider router={router} />
  );

}

export default App;
