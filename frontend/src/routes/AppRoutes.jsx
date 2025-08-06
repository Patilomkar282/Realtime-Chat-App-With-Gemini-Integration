import React from 'react'
import{ Routes , Route, BrowserRouter } from 'react-router-dom'
import Login from '../screens/Logins'
import Home from '../screens/Home'
import Project from '../screens/Project'
import Register from '../screens/Resgister'
import UserAuth from '../auth/userAuth'
const AppRoutes = () => {
  return (
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<UserAuth><Home/></UserAuth>} />
        <Route path="/login" element={<Login/>} />
         <Route path="/register" element={<Register/>} />
         <Route path="/project" element={<UserAuth><Project/></UserAuth>} />
      
     </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes
