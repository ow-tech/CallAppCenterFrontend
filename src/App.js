import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
//screens
import LoginScreen from "./components/screens/LoginScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";
import ErrorPage from "./components/screens/ErrorPage";
import DashboardPage from "./components/pages/DashboardPage";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#212751",
    },
  },
});

const App = () => {
  //logout user on close and on reload page
  /* useEffect(() => {
    const logoutHandler = async (e) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        await axios.post("/api/auth/logout", {}, config);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    window.addEventListener("beforeunload", (ev) => {
      logoutHandler();
      ev.preventDefault();
      localStorage.removeItem("authToken");
      return (ev.returnValue = "Are you sure you want to close?");
    });
  });*/

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
            <Route
              path="/resetpassword/:resetToken"
              element={<ResetPasswordScreen />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
