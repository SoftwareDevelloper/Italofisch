import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer, Zoom } from 'react-toastify';

const SeaFoodDetailled = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentLanguage])
  const [SeaFood, setSeaFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [cartItems, setCartItems] = useState([]);
  const { id } = useParams();

  const fetchSeaFood = async () => {
    try {
      const res = await fetch(`http://localhost:4000/GetSeaFood/${id}`);
      const data = await res.json();
      setSeaFood(data || null);
    } catch (error) {
      console.error("Error fetching seaFood:", error);
      setSeaFood(null);
    }
  };

  useEffect(() => {
    fetchSeaFood();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleQuantity = (type) => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const addTocart = (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth-token");

    if (!token) return toast.error("You must Login to Add item to cart");

    fetch("http://localhost:4000/Addtocart", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, user, quantity }),
    })
      .then((res) => res.json())
      .then(() =>
        fetch("http://localhost:4000/GetCart", {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
      .then((res) => res.json())
      .then((cartData) => {
        localStorage.setItem("cart", JSON.stringify(cartData));
        setCartItems(cartData);
        toast.success(`Added ${quantity} item(s) to cart successfully`);
      })
      .catch((error) => console.error("Error adding to cart:", error));
  };

  if (!SeaFood) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-white">
        <div className="w-12 h-12 border-4 border-white border-t-[#00aaff] rounded-full animate-spin"></div>
        <p className="text-lg">Loading seafood details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-transparent text-white flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 justify-center font-[Poppins]">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />

      {/* Left Image */}
      <div className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden">
        <img
          src={SeaFood?.image}
          alt={SeaFood?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Info */}
      <div className="flex flex-col gap-6 max-w-lg w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#003566] tracking-wide">
          {SeaFood?.name}
        </h1>

        <p className="text-white text-base md:text-lg leading-relaxed">{SeaFood?.description}</p>

        <div className="flex justify-between text-white font-semibold text-lg md:text-xl">
          <p>
            {t('weights')} <span className="text-[#003566] font-bold">{SeaFood?.weight} Kg</span>
          </p>
          <p>
           {t('prices')} <span className="text-[#003566] font-bold">{SeaFood?.price} €</span>
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantity("dec")}
            className="w-10 h-10 flex items-center justify-center border-2 border-[#003566] rounded-md text-white font-bold hover:bg-[#003566]/50 transition"
          >
            -
          </button>
          <span className="text-xl font-bold">{quantity}</span>
          <button
            onClick={() => handleQuantity("inc")}
            className="w-10 h-10 flex items-center justify-center border-2 border-[#003566] rounded-md text-white font-bold hover:bg-[#003566]/50 transition"
          >
            +
          </button>
        </div>

        {/* Order Button */}
        <div>
          <button
            onClick={() => addTocart(SeaFood.id)}
            className="w-full md:w-auto px-6 py-3 bg-[#0077b6] hover:bg-[#90e0ef] hover:text-[#003566] text-white font-bold rounded-full transition"
          >
            {t('Order')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeaFoodDetailled;
