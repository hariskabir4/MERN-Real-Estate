import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import HeaderComponent from "./components/HeaderComponent";
import RealEstateCard from "./components/RealEstateCard";
import About from "./components/About";
import Contact from "./components/Contact";
import Services from "./components/Services";
import ProForm from "./components/ProForm";


import { Routes, Route} from "react-router-dom";
// import PropertyForm from './components/PropertyForm';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HeaderComponent />
              <div className="property-container">
                <RealEstateCard
                  imageSrc="./source1.jpg"
                  price="25256"
                  type="Office for Sale"
                  size="900"
                  location="DHA Phase VI, Karachi, Pakistan"
                  date="26.11.2024 - A DAY AGO"
                />
                <RealEstateCard
                  imageSrc="./source1.jpg"
                  price="25256"
                  type="Office for Sale"
                  size="900"
                  location="DHA Phase VI, Karachi, Pakistan"
                  date="26.11.2024 - A DAY AGO"
                />
                <RealEstateCard
                  imageSrc="./source1.jpg"
                  price="25256"
                  type="Office for Sale"
                  size="900"
                  location="DHA Phase VI, Karachi, Pakistan"
                  date="26.11.2024 - A DAY AGO"
                />
                <RealEstateCard
                  imageSrc="./source1.jpg"
                  price="25256"
                  type="Office for Sale"
                  size="900"
                  location="DHA Phase VI, Karachi, Pakistan"
                  date="26.11.2024 - A DAY AGO"
                />
                <RealEstateCard
                  imageSrc="./source1.jpg"
                  price="25256"
                  type="Office for Sale"
                  size="900"
                  location="DHA Phase VI, Karachi, Pakistan"
                  date="26.11.2024 - A DAY AGO"
                />
                <RealEstateCard
                  imageSrc="./source1.jpg"
                  price="25256"
                  type="Office for Sale"
                  size="900"
                  location="DHA Phase VI, Karachi, Pakistan"
                  date="26.11.2024 - A DAY AGO"
                />
              </div>
              <Footer />
            </>
          }
        />

        <Route path="/properties" element={<></>} />

        <Route
          path="/signup"
          element={
            <>
              <Signup />
            </>
          }
        />
          { <Route
          path="/new-listing"
          element={
            <>
              <ProForm />
            </>
          }
        /> }

        <Route path="/accounts" element={<>{/* <Accounts/> */}</>} />
        <Route path="/property:id" element={<>{/* ` */}</>} />

        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />

      
      </Routes>
    </div>
  );
}

export default App;
