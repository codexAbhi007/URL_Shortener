// src/AppWrapper.jsx
import { useState } from "react";
import App from "./App.jsx";
import Context from "./Context.jsx";

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();

  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      <App />
    </Context.Provider>
  );
};

export default AppWrapper;
