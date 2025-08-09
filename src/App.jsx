import { useContext } from "react"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import BuyCredit from "./pages/BuyCredit"
import Home from "./pages/Home"
import Result from "./pages/Result"
import {Routes , Route } from 'react-router-dom'
import { AppContext } from "./context/AppContext"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
 
  // if the showlogin is true then only display login page 
  const {showLogin} = useContext(AppContext);


  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      {/* add navigation to all the pages  that's why we added it outside the routes */}
      <ToastContainer position = 'bottom-right' />
      <Navbar/>
      {/* add the conditon as we don't want to display login everytime on the page  */}
      {/* so we used to import the showLogin from appContext */}
      {showLogin && <Login/>}
      <Routes>
        {/* when  we are at the "/" display the home page  */}
        <Route path="/" element={<Home/>}/>

        {/* when  we are at the "/result" display the result page  */}
        <Route path="/result" element={<Result/>}/>
        
        <Route path="/buy" element={<BuyCredit/>}/>
      </Routes>
      {/* add footer to all the pages that's why we added it outside the routes */}
      <Footer/>
    </div>
  )
}

export default App
