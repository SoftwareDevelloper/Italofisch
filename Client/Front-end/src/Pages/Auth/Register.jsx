import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const Register = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentLanguage])
  const [formData,setFormdata] = useState({
    fullname:"",
    email:"",
    password:"",
  })
  const changeHandler = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };
  const SignUp = async () => {
    let responseData;
    await fetch('http://localhost:4000/signup', { 
      method:"POST",
      headers:{
        Accept:'application/form_data',
        'content-type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)
    if(responseData.success){
      toast.success("Account Created Successfully");
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/Login");
    }else{
      toast.error(responseData.errors)
    }
  };
  return (
<div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 ">
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

  <form 
    onSubmit={(e) => { e.preventDefault(); SignUp(); }} 
    className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg flex flex-col gap-6"
  >
    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#003566] text-center">
      {t('register')}
    </h1>
    
    <input 
      type="text"
      name="fullname"
      value={formData.fullname}
      onChange={changeHandler}
      placeholder={t('fullname')}
      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-sm sm:text-base"
    />
    
    <input 
      type="email"
      name="email"
      value={formData.email}
      onChange={changeHandler}
      placeholder={t('email')}
      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-sm sm:text-base"
    />
    
    <input 
      type="password"
      name="password"
      value={formData.password}
      onChange={changeHandler}
      placeholder={t('password')}
      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-sm sm:text-base"
    />
    
    <button 
      type="submit"
      className="w-full py-3 sm:py-4 bg-[#003566] text-white font-bold rounded-lg hover:bg-[#0077b6] transition duration-300 text-sm sm:text-base"
    >
      {t('registerBtn')}
    </button>
    
    <div className="text-center text-sm sm:text-base">
      <p className="inline text-gray-600" style={{fontSize:"15px",color:"gray"}}>{t('have')} </p>
      <Link to="/Login" className="text-cyan-600 font-semibold hover:underline">
        {t('loginBtn')}
      </Link>
    </div>
  </form>
</div>


  )
}

export default Register
