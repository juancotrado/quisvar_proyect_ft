import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard, Home, Login } from './pages/index'
function App() {
  
  const [user, setUser] = useState<boolean>(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/home' element={<Home />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

// function Navigation(){

// }

export default App
