import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Landing";
import CoursePage from "./pages/teacher/course/course";
import CreatePage from "./pages/teacher/Coursecreate";
import Testing from "./pages/testing";
import Login from "./pages/Login"
import Register from "./pages/register/Register"
import Pico from "./pages/Pico"
import Home from "./pages/student/Home";
import Explore from "./pages/student/Explore"
import CourseOverview from "./pages/student/CourseOverview"
import Content from "./pages/student/content/Content";
import LabManual from "./pages/teacher/course/Lab Manual/LabManual";
import LabManualCreate from "./pages/teacher/course/Lab Manual/LabManualCreate";
import "./pages/student/content/i18n"
function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route element={<HomePage />} path="/" />
      <Route element={<CreatePage />} path="/teacher/create" />
      <Route element={<CoursePage />} path="/teacher/course" />
      <Route element={<LabManual />} path="/teacher/lab-manual" />
      <Route element={<LabManualCreate />} path="/teacher/lab-manual-create" />

      <Route element={<Testing />} path="/testing" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Pico />} path="/pico" />
      <Route element={<Home />} path="/student/home" />
      <Route element={<Explore />} path="/student/explore" />
      <Route element={<CourseOverview />} path="/student/course-overview" />
      <Route element={<Content />} path="/student/content" />
    </Routes>
  );
}

export default App;
