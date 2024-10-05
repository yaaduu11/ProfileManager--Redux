import { Route, Routes  } from "react-router-dom";
import Home from '../src/pages/user/Home';
import SignIn from "../src/pages/user/Sign_in";
import AdminSignIn from "../src/pages/admin/Sign_in"
import SignUp from "../src/pages/user/Sign_up"
import Dashboard from "../src/pages/admin/Dashboard"
import Edit from "./pages/admin/Edit";

const App = () => {
  return (
   <div>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn />}/>
      <Route path="/admin" element={<AdminSignIn/>} />
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/edit/:userId" element={<Edit />} />
    </Routes>
   </div>
  )
};

export default App