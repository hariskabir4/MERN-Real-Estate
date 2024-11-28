import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import HeaderComponent from './components/HeaderComponent';
import RealEstateCard from './components/RealEstateCard';

import { Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={
          <>
            <Navbar />
            <HeaderComponent />
            <div className='property-container'>
              <RealEstateCard
                imageSrc='./source1.jpg'
                price="25256"
                type="Office for Sale"
                size="900"
                location="DHA Phase VI, Karachi, Pakistan"
                date="26.11.2024 - A DAY AGO"
              />
              <RealEstateCard
                imageSrc='./source1.jpg'
                price="25256"
                type="Office for Sale"
                size="900"
                location="DHA Phase VI, Karachi, Pakistan"
                date="26.11.2024 - A DAY AGO"
              />
              <RealEstateCard
                imageSrc='./source1.jpg'
                price="25256"
                type="Office for Sale"
                size="900"
                location="DHA Phase VI, Karachi, Pakistan"
                date="26.11.2024 - A DAY AGO"
              />
              <RealEstateCard
                imageSrc='./source1.jpg'
                price="25256"
                type="Office for Sale"
                size="900"
                location="DHA Phase VI, Karachi, Pakistan"
                date="26.11.2024 - A DAY AGO"
              />
              <RealEstateCard
                imageSrc='./source1.jpg'
                price="25256"
                type="Office for Sale"
                size="900"
                location="DHA Phase VI, Karachi, Pakistan"
                date="26.11.2024 - A DAY AGO"
              />
            </div>
            <Footer />
          </>
        } />

        <Route path='/properties' element={
          <>
            <Navbar />
            <Footer />
          </>
        } />

        <Route path='/signup' element={
          <>
            <Signup />
          </>
        } />

        <Route path='/accounts' element={
          <>
            {/* <Accounts/> */}
          </>
        } />
        <Route path='/property:id' element={
          <>
            {/* ` */}
          </>
        } />
      </Routes>

    </div>
  );
}

export default App;
