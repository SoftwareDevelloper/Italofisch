import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Cart = ({ isOpen, onClose, onCartChange }) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('auth-token');
      try {
        const res = await fetch("http://localhost:4000/getCart", {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setCartItems(Array.isArray(data.cart) ? data.cart : []);
      } catch (err) { console.error(err); }
    };
    fetchCart();
  }, []);

  const removeFromCart = async id => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    const token = localStorage.getItem('auth-token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token) {
      await fetch("http://localhost:4000/RemoveFromCart", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId: id, user }),
      });
      onCartChange?.();
    } else toast.warning('Please login to manage cart.');
  };

  const handleIncrease = async item => {
    const updated = cartItems.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
    setCartItems(updated);
    await updateCartOnBackend(item.id, 'increase');
    onCartChange?.();
  };

  const handleDecrease = async item => {
    if (item.quantity <= 1) return;
    const updated = cartItems.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity - 1 } : ci);
    setCartItems(updated);
    await updateCartOnBackend(item.id, 'decrease');
    onCartChange?.();
  };

  const updateCartOnBackend = async (id, action) => {
    const token = localStorage.getItem('auth-token');
    const endpoint = action === 'increase' ? "http://localhost:4000/Addtocart" : "http://localhost:4000/RemoveFromCart";
    try { await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ itemId: id }) }); }
    catch (err) { console.error(err); }
  };

  const proceedToCheckout = () => {
    navigate('/CheckOut', { state: { cartItems } });
    onClose();
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} transition={Zoom} theme="colored" />
      <div className={`fixed inset-0 bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-[#003566] to-[#0077b6] shadow-2xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col z-50`}>
        <div className="sticky top-0 bg-[#003566cc] backdrop-blur-md flex justify-between items-center px-5 py-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">Your Cart</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-blue-300 transition-transform hover:rotate-90">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-white font-semibold text-lg"> {t('empty')} </p>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition transform">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                    <p className="text-white font-semibold">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDecrease(item)} className="w-7 h-7 bg-white/20 text-white rounded hover:bg-white/40 transition">-</button>
                    <span className="text-white font-semibold">{item.quantity}</span>
                    <button onClick={() => handleIncrease(item)} className="w-7 h-7 bg-white/20 text-white rounded hover:bg-white/40 transition">+</button>
                  </div>
                  <span className="text-white font-semibold">{(item.price * item.quantity).toFixed(2)} €</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-300 text-xl font-bold">&times;</button>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <button onClick={proceedToCheckout} className="flex items-center gap-2 px-5 py-3 bg-[#003566cc] hover:bg-[#00c6ff] rounded-full text-white font-bold transition transform hover:scale-105">
                  {t('Order')} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
