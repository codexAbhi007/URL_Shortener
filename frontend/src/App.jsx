import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import ErrorPage from "./pages/error/ErrorPage.jsx";
import Home from "./pages/Home.jsx";
import ShortLinks from "./pages/ShortLinks.jsx";
import ShortLinksDetails from "./pages/ShortLinksDetails.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Profile from "./pages/auth/Profile.jsx";
import { useContext, useEffect } from "react";
import Context from "./Context.jsx";

import { getProfile } from "./api/axios_api.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/shorten", element: <ShortLinks /> },
      { path: "/shorten/view", element: <ShortLinksDetails /> },
      { path: "/app/register", element: <Register /> },
      { path: "/app/login", element: <Login /> },
      { path: "/app/profile", element: <Profile /> },
    ],
  },
]);

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        console.log(err);
      }
    };
    getUser();
  }, [setIsAuthenticated, setUser]); // dependencies included

  return <RouterProvider router={router} />;
};

export default App;
