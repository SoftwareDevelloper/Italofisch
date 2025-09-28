import Sidebar, { SidebarItem } from "./Component/sidebar";
import "./App.css"
import{Receipt,Fish,Users,LayoutDashboard} from "lucide-react"
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products/Products";
import UsersList from "./Pages/Users/UsersList";
import Orders from "./Pages/Orders";
import UpdateProduct from "./Pages/Products/UpdateProduct";
const App = () => {
    const location = useLocation();
  return (
      <div className="App flex min-h-screen bg-gray-50">
        <Sidebar>
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to="/" active={location.pathname === "/"}  alert />
          <SidebarItem icon={<Fish size={20}/>} text="Products" to="/FishLists" active={location.pathname === "/FishLists"} alert />
          <SidebarItem icon={<Users size={20}/>} text="Customers" to="/Customers" active={location.pathname === "/Customers"} />
          <SidebarItem icon={<Receipt size={20}/>} text="Orders" alert to="/Orders" active={location.pathname === "/Orders"} />
        </Sidebar>
        <main className="bg-white p-4 rounded-xl shadow m-6 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/FishLists" element={<Products/>}/>
            <Route path="/Customers" element={<UsersList/>}/>
            <Route path="/Orders" element={<Orders/>} />
            <Route path="/UpdateProduct/:id" element={<UpdateProduct/>} />
          </Routes>
        </main>
      </div>
  )
}
export default App
