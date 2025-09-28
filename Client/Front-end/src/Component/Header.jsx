import React, { useEffect, useRef, useState } from 'react';
import Logo from '../assets/logo.png';
import Search from '../assets/search.png';
import UserIcon from '../assets/user2.png';
import CartImg from '../assets/icons8-shopping-cart-50.png';
import Word from '../assets/world.png';
import fr from '../assets/fr-rectangle.png';
import arabe from '../assets/ar-rec.png';
import usa from '../assets/en-rectangle.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cart from './Cart/Cart';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  ;
  const dropdownRef = useRef(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState();
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpenLang(false);
  };
  const handleNavigation = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenLang(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) return setCartCount(0);

        const response = await fetch('http://localhost:4000/cart/count', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCartCount(data.success ? data.count || 0 : 0);
      } catch (err) {
        console.error(err);
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const res = await fetch('http://localhost:4000/Profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="w-full  top-0 left-0 z-50 bg-transparent font-Poppins ">
      <div className='bg-gradient-to-b from-cyan-500 to-transparent flex justify-between items-center w-full py-5 px-4 md:grid md:grid-cols-3'>
          <img src={Logo} alt="Logo" className="max-h-14 sm:max-h-16 md:max-h-24 lg:max-h-32 w-auto object-contain opacity-90 px-2 mt-2 ml-5" />
          <nav className="hidden md:flex  lg:gap-6 sm:gap-4 md:gap-5 text-white font-bold lg:text-xl sm:text-sm md:text-lg">
              <Link to="/" className="relative group text-xl">
                {t('Home')}
                <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
              </Link>
              <Link to="/SeaFood" className="relative group text-xl">
                {t('Seafood')}
                <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
              </Link>
              <button
                onClick={() => handleNavigation('About')}
                className="relative group text-xl"
              >
                {t('About')}
                <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
              </button>
              <button
                onClick={() => handleNavigation('Contact')}
                className="relative group text-xl"
              >
                {t('Contact')}
                <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
              </button>
            </nav>
          <div className="flex justify-center items-center gap-2 px-3">
              {/* cart */}
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="focus:outline-none">
                  <img src={CartImg} alt="Cart" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 cursor-pointer"/>
                </button>
                <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
                <Cart
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  onCartChange={() => {}}
                />
              </div>
              {/* user auth /profile */}
              <div className="relative">
                {localStorage.getItem('auth-token') ? (
                  <div className="relative">
                    <img
                      src={UserIcon}
                      alt="User"
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full cursor-pointer"
                      onClick={() => setOpenProfile(!openProfile)}
                    />
                    {openProfile && (
                      <div className="absolute right-0  w-40 bg-blue-900 bg-opacity-70 rounded-md p-4 flex flex-col gap-2 text-white z-50">
                        <span className=" text-sm md:text-md sm:text-lg font-bold transform hover:scale-105 transition cursor-pointer">{user?.fullname}</span>
                        <Link to="/MyOrders" className="text-sm md:text-md sm:text-md font-medium transform hover:scale-105 transition">
                          {t('MyOrders')}
                        </Link>
                        <button
                          className="bg-blue-700 rounded px-2 py-1 hover:bg-blue-600 cursor-pointer text-sm md:text-md sm:text-lg font-bold transform hover:scale-105 transition"
                          onClick={() => {
                            localStorage.removeItem('auth-token');
                            window.location.reload();
                          }}>
                          {t('Logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/Login">
                    <button className="bg-blue-900 text-white font-bold rounded-full px-8 py-2 hover:bg-white hover:text-blue-900 transition cursor-pointer text-sm md:text-md sm:text-lg">
                      {t('Login')}
                    </button>
                  </Link>
                )}
              </div>
              {/* Multilangue */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenLang(!openLang)}
                  className="flex items-center cursor-pointer"
                >
                  <img src={Word} alt="Lang" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                </button>
                {openLang && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={() => changeLanguage('en')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <img src={usa} alt="English" className="w-6 h-6" />
                          {t('english')}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => changeLanguage('fr')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <img src={fr} alt="French" className="w-6 h-6" />
                          {t('french')}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => changeLanguage('ar')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <img src={arabe} alt="Arabic" className="w-6 h-6" />
                          {t('arabic')}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
            </div>
            {/* humberger menu */}
            <button
              className="md:hidden p-2 ml-2"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}>
              {openMobileMenu ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      {/* responsive */}
      {openMobileMenu && (
        <div className="md:hidden bg-transparent text-white flex justify-center items-center flex-col gap-4 p-5">
          <Link to="/" className='relative group font-semibold'>
            {t('Home')}
            <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
          </Link>
          <Link to="/SeaFood" className='relative group font-semibold'>
            {t('Seafood')}
            <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
          </Link>
          <button onClick={() => handleNavigation('About')} className='relative group font-semibold'>
            {t('About')}
            <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
          </button>
          <button onClick={() => handleNavigation('Contact')} className='relative group font-semibold'>
            {t('Contact')}
            <span className={`absolute -bottom-3 w-0 h-1 rounded-full bg-white transition-all ${i18n.language === 'ar' ? 'right-0' : 'left-0'} group-hover:w-8`}></span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
