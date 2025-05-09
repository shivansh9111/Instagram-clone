import React from 'react'
import { Outlet } from 'react-router-dom'
import Leftsidebar from './Leftsidebar'
function Mainlayout() {
  return (
    <div> <Leftsidebar/>
    <div><Outlet/></div>
    </div>
  )
}

export default Mainlayout