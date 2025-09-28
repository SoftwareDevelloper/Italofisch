import React from 'react'
import Item from './Item/Item'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import { useTranslation } from 'react-i18next'
const ProductSection = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  const [SeaFood,setSeaFood] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [cartItems, setCartItems] = useState([]);
    const fetchSeaFood = async () => {
    try {
        const res = await fetch("http://localhost:4000/Get5SeaFood");
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
        setCartItems((prev) => {
          const newCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
          localStorage.setItem('cart', JSON.stringify(newCart));
          return newCart;
        });
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
            toast.error("You must Login to Add item to cart")
          }
    };
  return (
<div className="flex flex-col items-center px-4 md:px-10 py-10 font-Poppins text-white">
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
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide text-center mb-6 relative after:content-[''] after:block after:w-1/2 after:h-1 after:bg-white after:mx-auto after:mt-2 after:rounded">
    {t('ProductTitle')}
  </h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  items-center gap-6 w-full">
    {SeaFood.map((seafood) => (
      <div className="productCard" key={seafood.id}>
        <Item
          id={seafood.id}
          name={seafood.name}
          image={seafood.image}
          weight={seafood.weight}
          price={seafood.price}
          category={seafood.category}
          description={seafood.description}
          onAddToCart={() => addTocart(seafood.id)}
        />
      </div>
    ))}
  </div>
  <div className="flex justify-center mt-10">
    <Link to="/SeaFood">
      <button className="px-6 py-3 w-40 sm:w-44 md:w-48 rounded-full border border-white bg-transparent text-white text-base sm:text-lg font-bold hover:bg-[#00356665] hover:text-white/70 transition">
        {t('viewAll')}
      </button>
    </Link>
  </div>
</div>


  )
}

export default ProductSection
