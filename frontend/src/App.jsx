import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import School from './school/School'
import Attendance from './school/components/attendance/Attendance'
import Class from './school/components/class/Class'
import Dashboard from './school/components/dashboard/Dashboard'
import Examinations from './school/components/examinations/Examinations'
import Notice from './school/components/notice/Notice'
import Schedule from './school/components/schedule/Schedule'
import Students from './school/components/students/Students'
import Subjects from './school/components/subjects/Subjects'
import Teachers from './school/components/teachers/Teachers'
import Client from './client/Client'
import Home from './client/components/home/Home'
import Login from './client/components/Login/Login'
import Register from './client/components/register/Register'
import Teacher from './teacher/Teacher'
import NoticeTeacher from './teacher/components/notice/NoticeTeacher'
import TeacherDetails from './teacher/components/teacherDetails/TeacherDetails'
import ScheduleTeacher from './teacher/components/schedule/ScheduleTeacher'
import AttendanceTeacher from './teacher/components/attendance/AttendanceTeacher'
import ExaminationsTeacher from './teacher/components/examinations/ExaminationsTeacher'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
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
        <Route path='teacher' element={<Teacher />}>
          <Route index element={<TeacherDetails />} />
          <Route path='schedule' element={<ScheduleTeacher />} />
          <Route path='attendance' element={<AttendanceTeacher />} />
          <Route path='examinations' element={<ExaminationsTeacher />} />
          <Route path='notice' element={<NoticeTeacher />} />
        </Route>

        {/* CLIENT ROUTE */}
        <Route path='/' element={<Client />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>

      </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
