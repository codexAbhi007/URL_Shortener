import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./layouts/AppLayout.jsx"
import ErrorPage from "./pages/ErrorPage.jsx"
import Home from "./pages/Home.jsx"
import ShortLinks from "./pages/ShortLinks.jsx";


const router = createBrowserRouter([
  {
    path:"/",
    element:<AppLayout/>,
    errorElement:<ErrorPage/>,
    children:[
      {path: "/",element:<Home/>},
      {path: "/shorten",element:<ShortLinks/>},
    ],
  },
]);



const App = () => {
  return <RouterProvider router={router}/>
}
export default App