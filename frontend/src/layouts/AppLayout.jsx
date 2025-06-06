import { Outlet } from "react-router-dom"
import Header from "../UI/Header.jsx"
import Footer from "../UI/Footer.jsx"

const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col ">
       <Header/>
       <Outlet/>
       <Footer/> 
    </div>
  )
}
export default AppLayout