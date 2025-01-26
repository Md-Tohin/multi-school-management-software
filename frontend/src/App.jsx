import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import School from './school/School'
import Testing from './Testing'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Testing />}></Route>
        {/* SCHOOL ROUTE */}
        <Route path="school" element={<School />}>

        </Route>
        {/* STUDENT ROUTE */}
        <Route>

        </Route>
        {/* TEACHER ROUTE */}
        <Route>

        </Route>
        {/* CLIENT ROUTE */}
        <Route>

        </Route>
      </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
