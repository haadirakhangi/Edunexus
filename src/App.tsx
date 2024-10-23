import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Landing";
import CoursePage from "./pages/teacher/course/course";
import CreatePage from "./pages/teacher/create";
import Testing from "./pages/testing";
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<CreatePage />} path="/teacher/create" />
      <Route element={<CoursePage />} path="/teacher/course" />
      <Route element={<Testing />} path="/testing" />
      <Route element={<Login />} path="/login" />
      <Route element={<SignUp />} path="/register" />
    </Routes>
  );
}

export default App;
