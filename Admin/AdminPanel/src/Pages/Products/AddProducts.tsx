import { useState} from "react";
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
const AddProducts = () => {
    const [seaFood, setSeaFood] = useState<SeaFoodItem>({
      id: 0,
      name: "",
      description: "",
      price: 0,
      weight: 0,
      category: "",
      image: "",
    });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();

  let imageUrl = seaFood.image;

  if (selectedFile) {
    const formData = new FormData();
    formData.append("image", selectedFile);

    const uploadRes = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();
    imageUrl = uploadData.image_url; // <-- set the URL from server
  }

  try {
    const payload = { ...seaFood, image: imageUrl };
    const res = await fetch("http://localhost:4000/addSeaFood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const Saved = await res.json();
    console.log(Saved);
    setSeaFood({
      id: 0,
      name: "",
      description: "",
      price: 0,
      weight: 0,
      category: "",
      image: "",
    });
    setSelectedFile(null);
    toast.success("Item added successfully");
  } catch (error) {
    console.error("Error adding seaFood:", error);
    toast.error("Add failed");
  }
};

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
      <h2 className="lg:text-3xl sm:text-xl md:text-2xl font-bold mb-4 text-center text-blue-800">
        Update Product
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              value={seaFood.name}
              onChange={(e) => setSeaFood({ ...seaFood, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={seaFood.description}
              onChange={(e) => setSeaFood({ ...seaFood, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={seaFood.price}
              onChange={(e) => setSeaFood({ ...seaFood, price: Number(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight</label>
            <input
              type="number"
              value={seaFood.weight}
              onChange={(e) => setSeaFood({ ...seaFood, weight: Number(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={seaFood.category}
              onChange={(e) => setSeaFood({ ...seaFood, category: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <img
              src={seaFood.image}
              alt={seaFood.name}
              className="w-32 h-32 object-cover rounded mb-2"
            />
            <input
              type="file"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white lg:px-8 lg:py-3 sm:px-6 sm:py-3 md:px-7 md:py-3 lg:text-lg sm:text-xs md:text-md rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts
