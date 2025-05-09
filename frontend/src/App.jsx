import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './App.css'
import Mainlayout from './components/Mainlayout'
import Home from './components/Home'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Login from './components/Login'
function App() {
  const browserRouter = createBrowserRouter([
    {path:'/',
      element:<Mainlayout/>,
     children:[
      {
        path:'/',
        element:<Home/>
      },
      {
       path:'/profile',
       element:<Profile/>
      }
     ]
    },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  }
  ])

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
