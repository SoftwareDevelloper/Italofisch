import React, { useEffect, useState } from 'react'
import Item from '../../Component/Item/Item'
import { Link } from 'react-router-dom'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const SeaFood = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentLanguage])
    const [SeaFood,setSeaFood] = useState([])
    const [SelectedType, setSelectedType] = useState("all");
    const handleTypeChange = (event) => {
      setSelectedType(event.target.id);
    };
    const handlePriceChange = (e) => {
      setMaxPrice(Number(e.target.value));
    };

    // eslint-disable-next-line no-unused-vars
    const [cartItems,setCartItems] = useState([]);
    const [minPrice]=useState(0)
    const [maxPrice, setMaxPrice] = useState(100);
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
      
    const addTocart = (itemId) => {
      const user = JSON.parse(localStorage.getItem('user'));
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 })); 
      const token = localStorage.getItem('auth-token');
      if (token) {
        fetch("http://localhost:4000/Addtocart", {
          method: 'POST',
            headers: {
              Accept: 'application/json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId: itemId , user:user})
          })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error('Error adding to cart:', error));
          toast.success("Product added to card successfully")
          } else {
            toast.error("Login first!")
          }
    };

  useEffect(() => {
  const fetchFilteredSeaFood = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/PriceAndTypes?min=${minPrice}&max=${maxPrice}&category=${SelectedType}`
      );
      const data = await res.json();
      setSeaFood(data);
    } catch (error) {
      console.error("Error fetching filtered seafood:", error);
    }
  };

  fetchFilteredSeaFood();
}, [maxPrice, SelectedType, minPrice]);

const resetFilters = async () => {
  try {
    const res = await fetch("http://localhost:4000/ResetFilter");
    const data = await res.json();
    setSeaFood(data);
    setSelectedType("all");
    setMaxPrice(100);
  } catch (error) {
    console.error("Error resetting filters:", error);
  }
};

  return (
<div className="SeaFood flex flex-col px-4 md:px-20 font-Poppins">
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    transition={Zoom}
  />
  <div className="text-center mb-6">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white relative after:content-[''] after:block after:w-1/5 after:h-1 after:bg-white after:mx-auto after:mt-2 after:rounded">
      {t('fresh')}
    </h1>
    <p className="text-base sm:text-lg lg:text-xl text-[#d9edfe] font-semibold mt-2">
      {t('discover')}
    </p>
  </div>
  <div className="flex flex-col lg:flex-row gap-10">
    <div className="flex flex-col gap-5 bg-transparent p-6 lg:w-1/4 text-white">
      <div className="flex flex-col gap-3">
        <span className="text-lg font-extrabold text-[#0076b6]"> {t('type')} </span>
        <div className="flex flex-col gap-3">
          {["all", "Fish", "Crustaceans", "Mollusks", "Cephalopods"].map((type) => (
            <div key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={type}
                checked={SelectedType === type}
                onChange={handleTypeChange}
                className="w-5 h-5 cursor-pointer accent-[#0077b6]"
              />
              <label htmlFor={type} className="text-base font-semibold cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-lg font-extrabold text-[#0076b6]"> {t('price')} </span>
        <div className="flex justify-between text-sm font-semibold">
          <span>{minPrice} €</span>
          <span>{maxPrice} €</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={maxPrice}
          onChange={handlePriceChange}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#0077b6] bg-[#0077b6]"
        />
      </div>
      <button
        className="w-40 h-12 bg-[#003450cc] text-white font-bold rounded-md text-sm hover:bg-[#003566] transition"
        onClick={resetFilters}
      >
        {t('cancel')}
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
      {SeaFood.map((seaFood) => (
        <div
          key={seaFood.id}
          className="bg-transparent rounded-xl p-4 hover:-translate-y-1 transition"
        >
          <Item
            id={seaFood.id}
            name={seaFood.name}
            image={seaFood.image}
            weight={seaFood.weight}
            price={seaFood.price}
            category={seaFood.category}
            description={seaFood.description}
            onAddToCart={() => addTocart(seaFood.id)}
          />
        </div>
      ))}
    </div>
  </div>
</div>

  )
}

export default SeaFood
