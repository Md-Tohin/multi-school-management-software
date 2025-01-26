import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import School from './school/School'
import Testing from './Testing'
import Attendance from './school/attendance/Attendance'
import Class from './school/class/Class'
import Dashboard from './school/dashboard/Dashboard'
import Examinations from './school/examinations/Examinations'
import Notice from './school/notice/Notice'
import Schedule from './school/schedule/Schedule'
import Students from './school/students/Students'
import Subjects from './school/subjects/Subjects'
import Teachers from './school/teachers/Teachers'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Testing />}></Route>
        {/* SCHOOL ROUTE */}
        <Route path="school" element={<School />}>
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='attendance' element={<Attendance />} />
          <Route path='class' element={<Class />} />
          <Route path='examinations' element={<Examinations />} />
          <Route path='notice' element={<Notice />} />
          <Route path='schedule' element={<Schedule />} />
          <Route path='students' element={<Students />} />
          <Route path='subjects' element={<Subjects />} />
          <Route path='teachers' element={<Teachers />} />
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
