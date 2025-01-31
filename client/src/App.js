// import "./App.css";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Signup from "./components/Signup";
// import HeaderComponent from "./components/HeaderComponent";
// import RealEstateCard from "./components/RealEstateCard";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import Services from "./components/Services";
// import ProForm from "./components/ProForm";
// import Login from "./components/Login";
// import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

// import { Routes, Route } from "react-router-dom";

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         {/* Public Routes */}
//         <Route
//           path="/"
//           element={
//             <>
//               <Navbar />
//               <HeaderComponent />
//               <div className="property-container">
//                 <RealEstateCard
//                   imageSrc="./source1.jpg"
//                   price="25256"
//                   type="Office for Sale"
//                   size="900"
//                   location="DHA Phase VI, Karachi, Pakistan"
//                   date="26.11.2024 - A DAY AGO"
//                 />
//                 <RealEstateCard
//                   imageSrc="./source1.jpg"
//                   price="25256"
//                   type="Office for Sale"
//                   size="900"
//                   location="DHA Phase VI, Karachi, Pakistan"
//                   date="26.11.2024 - A DAY AGO"
//                 />
//                 {/* Add more RealEstateCard components as needed */}
//               </div>
//               <Footer />
//             </>
//           }
//         />
//         <Route path="/properties" element={<></>} />
//         <Route
//           path="/signup"
//           element={
//             <>
//               <Signup />
//             </>
//           }
//         />
//         <Route
//           path="/about"
//           element={
//             <>
//               <Navbar />
//               <About />
//               <Footer />
//             </>
//           }
//         />
//         <Route
//           path="/services"
//           element={
//             <>
//               <Navbar />
//               <Services />
//               <Footer />
//             </>
//           }
//         />
//         <Route
//           path="/contact"
//           element={
//             <>
//               <Navbar />
//               <Contact />
//               <Footer />
//             </>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <>
//               <Login />
//             </>
//           }
//         />

//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/new-listing" element={<ProForm />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;












// src/App.js
import React from "react";
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
import Login from "./components/Login";
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

import { Routes, Route } from "react-router-dom";
import { UserProvider } from './Usercontext'; // Import UserProvider

function App() {
  return (
    <UserProvider> {/* Wrap everything with UserProvider */}
      <div className="App">
        <Routes>
          {/* Public Routes */}
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
                  {/* Add more RealEstateCard components as needed */}
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
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/new-listing" element={<ProForm />} />
          </Route>
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
