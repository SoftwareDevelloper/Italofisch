import { useEffect, useState } from "react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SeaFoodItem = {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  category: string;
};

const Products = () => {
  const [SeaFood,setSeaFood] = useState<SeaFoodItem[]>([])
  const [SelectedType, setSelectedType] = useState("all");
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedType(event.target.value);
    };
  const fetchSeaFood = async () => {
    try {
        const res = await fetch("http://localhost:4000/GetAllSeaFood");
        const data = await res.json();
        console.log("Fetched Data:", data);
        if (data.message && Array.isArray(data.message)) {
        setSeaFood(data.message);
        } else {
        setSeaFood([]);
        }
    } catch (error) {
        console.error("Error fetching seaFood:", error);
        setSeaFood([]);
    }
    };
      useEffect(() =>{
        fetchSeaFood();
      } , [])   

  async function RemoveProd(id: number): Promise<void> { 
    try{
      const res =  await fetch(`http://localhost:4000/RemoveSeaFood/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      console.log("Delete Response:", data);
      if(data.success){
        toast.success("Product deleted successfully!");
        const updatedSeaFood = [...SeaFood];
        updatedSeaFood.splice(id, 1);
        setSeaFood(updatedSeaFood);
      } else {
        console.error("Failed to delete the product:", data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
  function navigateToUpdate(id:number): void {
    window.location.href = `/UpdateProduct/${id}`;
  }
  function navigateToCreate():void{
    window.location.href="/AddNewFish";
  }
// fetch filtered seafood
  useEffect(() => {
  const fetchFilteredSeaFood = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/Types?category=${SelectedType}`
      );
      const data = await res.json();
      setSeaFood(data);
    } catch (error) {
      console.error("Error fetching filtered seafood:", error);
    }
  };

  fetchFilteredSeaFood();
}, [SelectedType]);
  return (
    <div className="container mx-auto p-6 font-poppins space-y-6">
    <ToastContainer
    position="top-left"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
    />
      <div className="flex justify-between items-center">
        <button onClick={()=>navigateToCreate()} className="bg-blue-800 hover:bg-blue-900 text-white text-lg font-medium px-8 py-3 cursor-pointer rounded-md transition">
          Create  +
        </button>
        <div className="flex justify-center items-center gap-2">
           <h2 className="lg:text-[17px] md:text-base sm:text-sm font-medium text-gray-800">Filters by</h2>
           <select className="border-2 border-gray-200 px-2 py-2 rounded-lg  outline-none text-gray-700 font-semibold"  onChange={handleTypeChange} >
            <option value="all" className="px-2 py-2  text-gray-700 font-semibold" selected={SelectedType === "all"}>All</option>
            <option value="Fish" className="px-2 py-2  text-gray-700 font-semibold" selected={SelectedType === "Fish"}>Fish</option>
            <option value="Crustaceans" className="px-2 py-2  text-gray-700 font-semibold" selected={SelectedType === "Crustaceans"}>Crustaceans</option>
            <option value="Mollusks" className="px-2 py-2  text-gray-700 font-semibold" selected={SelectedType === "Mollusks"}>Mollusks</option>
            <option value="Cephalopods" className="px-2 py-2  text-gray-700 font-semibold"selected={SelectedType === "Cephalopods"}>Cephalopods</option>
           </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200 px-10 py-5">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-700 cursor-pointer">
              <th className="py-3 px-8 " >Product</th>
              <th className="py-3 px-8">Description</th>
              <th className="py-3 px-8">Price(€)</th>
              <th className="py-3 px-8">Weight(kg)</th>
              <th className="py-3 px-8">Category</th>
              <th className="py-3 px-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              SeaFood.map((seaFood,index)=>(
                <tr className="border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer" key={index}>
                  <td className="py-3 px-8 flex justify-center gap-3 items-center text-sm"> <img src={seaFood.image} alt="" className="w-10 h-10"/>{seaFood.name} </td>
                  <td className="py-3 px-8 text-sm"> {seaFood.description} </td>
                  <td className="py-3 px-8 text-sm"> {seaFood.price} </td>
                  <td className="py-3 px-8 text-sm"> {seaFood.weight} </td>
                  <td className="py-3 px-8 text-sm"> {seaFood.category} </td>
                  <td className="py-3 px-8 flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition cursor-pointer" onClick={()=>navigateToUpdate(seaFood.id)} >Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition cursor-pointer" onClick={()=>RemoveProd(seaFood.id)}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products;
