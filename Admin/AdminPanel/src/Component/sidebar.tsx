import Logo from "../assets/logo.png"
import { ChevronFirst, ChevronLast} from 'lucide-react';
import {createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
interface SidebarContextType {
  expanded: boolean;
}
// eslint-disable-next-line react-refresh/only-export-components
export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
export default function Sidebar({children}: {children: React.ReactNode}) {
  const [expanded,setExpanded] = useState(true);
  return (
  <div className="h-screen">
      <aside className={`${expanded ? "w-72" : "w-16"} h-full transition-all duration-300`}>
          <nav className="h-full flex flex-col bg-white border-r-2 border-gray-300 shadow-sm">
              <div className="p-4 pb-2 flex justify-between items-center">
                  <img src={Logo} alt="" className={`overflow-hidden transition-all ${expanded ? "w-32": "w-0"}`} />
                  <button onClick={()=>setExpanded(curr =>!curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                      {expanded? <ChevronFirst /> : <ChevronLast/>}
                  </button>
              </div>
              <SidebarContext.Provider value={{expanded}}>
                <ul className="flex-1 px-3">{children}</ul>
              </SidebarContext.Provider>
          </nav>
      </aside>
  </div>
  )
}
interface SidebarItemProps {
  icon: React.ReactNode;
  text?: string;
  to?: string;
  active?: boolean;
  alert?: boolean;
}
export function SidebarItem({icon, text, to = "/", active, alert}: SidebarItemProps) {
  const context = useContext(SidebarContext);
  const expanded = context?.expanded ?? false;
  return (
    <Link to={to}>
      <li className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors 
            ${
              active
              ? "bg-gradient-to-r from-blue-200 to-blue-100 text-blue-800"
              : "hover:bg-blue-50 text-gray-600"
            }
            `}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3": "w-0"}`}>{text}</span>
            {alert && 
              <div className={`absolute right-2 w-2 h-2 rounded bg-blue-400 ${expanded ?"":"top-2" }`}  />
            }
      </li>
    </Link>
  )
} 