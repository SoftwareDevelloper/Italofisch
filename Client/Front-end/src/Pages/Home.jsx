import React from 'react'
import BannerHome from '../Component/BannerHome'
import ProductSection from '../Component/ProductSection'
import AboutSection from '../Component/AboutSection'
import Banner from '../Component/Banner'
import Testimonials from '../Component/Testimonials'
import NewsLetter from '../Component/NewsLetter'

const Home = () => {
  return (
    <div className='home'>
      <BannerHome/>
      <ProductSection/>
      <AboutSection/>
      <Banner/>
      <Testimonials/>
      <NewsLetter/>
    </div>
  )
}

export default Home
