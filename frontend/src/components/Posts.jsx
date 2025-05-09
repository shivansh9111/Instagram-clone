import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'


function Posts() {
  const {posts} = useSelector(store=>store.post);
  return (
    <div className='flex-2 flex flex-col my-8 items-center pl-[20%]'>

    {posts.map((post)=><Post key={post._id} post={post}/> )}
    </div>
  )
}

export default Posts