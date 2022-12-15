import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { SnackbarProvider, withSnackbar } from 'notistack';
import './index.css'
import Reactor from './components/Reactor'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:id",
    element: <Reactor />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </React.StrictMode>
)
