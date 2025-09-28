import { useEffect, useState } from "react";

type User = {
  id: number;
  fullname: string;
  email: string;
};

const UsersList = () => {
  const [user,setUser] = useState<User[]>([])
  const fetchUsers = async () => {
    try {
        const res = await fetch("http://localhost:4000/getAllUsers");
        const data = await res.json();
        console.log("Fetched Data:", data);
        if (data.message && Array.isArray(data.message)) {
        setUser(data.message);
        } else {
        setUser([]);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        setUser([]);
    }
    };
      useEffect(() =>{
        fetchUsers();
      } , [])   
  return (
    <div className="container mx-auto p-6 font-poppins space-y-6">
      <div className="flex flex-wrap justify-center items-center overflow-x-auto rounded-lg shadow-lg">
        <h3 className="text-blue-800 font-semibold mb-2 text-3xl text-center  py-3">Our Customers</h3>
        <table className="min-w-full bg-white border border-gray-200 px-10 py-5">
          <thead className="bg-blue-800">
            <tr className="text-left text-md font-semibold text-white cursor-pointer uppercase">
              <th className="py-3 px-8">ID</th>
              <th className="py-3 px-8 " >Full name</th>
              <th className="py-3 px-8">E-mail</th>
            </tr>
          </thead>
          <tbody className="bg-blue-100">
            {
              user.map((customer,index)=>(
                <tr className="border-t border-none text-blue-800 font-medium hover:bg-white hover:text-xl hover:shadow-md shadow-blue-800 hover:rounded-full  transition duration-200 ease-out cursor-pointer" key={index}>
                   <td className="py-3 px-8 text-md">{customer.id} </td>
                  <td className="py-3 px-8 text-md">{customer.fullname} </td>
                  <td className="py-3 px-8 text-md"> {customer.email} </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default UsersList
