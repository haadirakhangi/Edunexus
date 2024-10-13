import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Landing";
import CoursePage from "./pages/teacher/course/course";
import CreatePage from "./pages/teacher/create";
function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<CreatePage />} path="/teacher/create" />
      <Route element={<CoursePage />} path="/teacher/course" />
    </Routes>
  );
}

export default App;
