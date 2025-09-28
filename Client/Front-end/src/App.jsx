import React from 'react'
import Header from './Component/Header'
import Footer from './Component/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import SeaFood from './Pages/SeaFood/SeaFood'
import SeaFoodDetailled from './Pages/SeaFood/SeaFoodDetailled'
import ScrollToTop from './Component/ScrollToTop'
import Checkout from './Pages/Checkout/checkout'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Myorders from './Pages/Orders/myorders'
const App = () => {
  const stripePromise = loadStripe('pk_test_51S6v8IE7v8OATBnbBlVtlm8bPfSmp0XGNkKsvmzzhgmHaV9Uy5dQimI7pkzR0pLx3gvKJJZ4Rj6YSpPFZkG8B1aR00cb28Gd7t');
  return (
    <div className='App'>
      <Header/>
      <div className="main">
        <ScrollToTop />
        <Elements stripe={stripePromise}>
            
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/Login' element={<Login/>}/>
            <Route path='/Register' element={<Register/>}/>
            <Route path='/SeaFood' element={<SeaFood/>} />
            <Route path='/Detail/:id'  element={<SeaFoodDetailled/> }/>
            <Route path='/CheckOut' element={ <Checkout/> } />
            <Route path='/MyOrders' element={ <Myorders/> } />
          </Routes>
        </Elements>

      </div>
      <Footer/>
    </div>
  )
}

export default App
