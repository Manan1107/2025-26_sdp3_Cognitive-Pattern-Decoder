import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Layout from "./components/layout/Layout";
import SessionAnalysis from "./pages/SessionAnalysis";
import CompareUser from "./pages/CompareUser";
import Notifications from "./pages/Notifications";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {user && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analysis" element={<SessionAnalysis />} />
            <Route path="compare" element={<CompareUser />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={user ? <Dashboard /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/login"
//           element={!user ? <Login /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/register"
//           element={!user ? <Register /> : <Navigate to="/" />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;