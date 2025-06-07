// src/Context.jsx
import { createContext } from "react";

const Context = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export default Context;
