import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import Rightsidebar from './Rightsidebar'
import Usegetallpost from './hooks/Usegetallpost'
function Home() {
  Usegetallpost()
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <Rightsidebar/>
    </div>
  )
}

export default Home