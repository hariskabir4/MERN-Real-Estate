// import './App.css';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Signup from './components/Signup';
// import HeaderComponent from './components/HeaderComponent';
// import RealEstateCard from './components/RealEstateCard';
// import About from './components/About';
// import Contact from './components/Contact';
// import Services from './components/Services';
// import Login from './components/Login';
// import Filter from './components/Filter';
// import ResultCard from './components/ResultCard';
// import ResultsTab from './components/ResultsTab';
// import ParentLayout from './components/ParentLayout';
// import PropertyListingForm from './components/PropertyListingForm';
// import ChatPage_1 from './components/ChatPage_1';
// import MyListing from './components/MyListing';
// import OfferContainer from './components/OfferContainer';
// import MakeOffer from './components/MakeOffer';
// import PropertyDetail from './components/PropertyDetails';
// import AgentLogin from './components/AgentLogin';
// import AgentReg from './components/AgentReg';
// import MyOfferContainer from './components/MyOfferContainer';
// import { Routes, Route, Navigate } from 'react-router-dom';



// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path='/' element={
//           <>
//             <Navbar />
//             <HeaderComponent />
//             <div className='property-container'>
//               <RealEstateCard
//                 imageSrc='./source1.jpg'
//                 price="25256"
//                 type="Office for Sale"
//                 size="900"
//                 location="DHA Phase VI, Karachi, Pakistan"
//                 date="26.11.2024 - A DAY AGO"
//               />
//               <RealEstateCard
//                 imageSrc='./source1.jpg'
//                 price="25256"
//                 type="Office for Sale"
//                 size="900"
//                 location="DHA Phase VI, Karachi, Pakistan"
//                 date="26.11.2024 - A DAY AGO"
//               />
//               <RealEstateCard
//                 imageSrc='./source1.jpg'
//                 price="25256"
//                 type="Office for Sale"
//                 size="900"
//                 location="DHA Phase VI, Karachi, Pakistan"
//                 date="26.11.2024 - A DAY AGO"
//               />
//               <RealEstateCard
//                 imageSrc='./source1.jpg'
//                 price="25256"
//                 type="Office for Sale"
//                 size="900"
//                 location="DHA Phase VI, Karachi, Pakistan"
//                 date="26.11.2024 - A DAY AGO"
//               />
//               <RealEstateCard
//                 imageSrc='./source1.jpg'
//                 price="25256"
//                 type="Office for Sale"
//                 size="900"
//                 location="DHA Phase VI, Karachi, Pakistan"
//                 date="26.11.2024 - A DAY AGO"
//               />
//             </div>
//             <Footer />
//           </>
//         } />

//         <Route path='/properties' element={
//           <>
//             <Navbar />
//             <ParentLayout />
//           </>
//         } />

//         <Route path='/signup' element={
//           <>
//             <Signup />
//           </>
//         } />

//         <Route path='/login' element={
//           <>
//             <Login />
//           </>
//         } />

//         <Route path='/accounts' element={
//           <>
//             {/* <Accounts/> */}
//           </>
//         } />
//         <Route path='/property:id' element={
//           <>
//             {/* ` */}
//           </>
//         } />

//         <Route path='/about' element={
//           <>
//             <Navbar />
//             <About />
//             <Footer />
//           </>
//         } />
//         <Route path='/services' element={
//           <>
//             <Navbar />
//             <Services />
//             <Footer />
//           </>
//         } />
//         <Route path='/contact' element={
//           <>
//             <Navbar />
//             <Contact />
//             <Footer />
//           </>
//         } />

//         <Route path='/new-listing' element={
//           <>
//             <PropertyListingForm />
//           </>
//         } />
        
//         <Route path='/veiw-offers' element={
//           <>
//             <Navbar/>
//             <OfferContainer/>
//             <Footer/>
//           </>
//         } />
//         <Route path='/veiw-offers' element={
//           <>
//             <Navbar/>
//             <OfferContainer/>
//             <Footer/>
//           </>
//         } />
       
//         <Route path='/my-offers' element={
//           <>
//             <Navbar/>
//             <MyOfferContainer/>
//             <Footer/>
//           </>
//         } />

//         <Route path='/AgentPortal' element={
//           <>
//             <Navbar/>
//            <AgentLogin/>  
//             <Footer/>
//           </>
//         } />
//         <Route path='/AgentPortal/Registration' element={
//           <>
//             <Navbar/>
//            <AgentReg/>
//             <Footer/>
//           </>
//         } />
        
//         <Route path='/PropertyDetails' element={
//           <>
//             <Navbar/>
//             <PropertyDetail/>
//             <Footer/>
//           </>
//         } />

//         <Route path='/my-listings' element={
//           <>
//             <Navbar />
//             <MyListing
//               imageSrc="./source1.jpg"
//               price="25256"
//               type="Office for Sale"
//               size="900"
//               location="DHA Phase VI, Karachi, Pakistan"
//               date="26.11.2024 - A DAY AGO"
//             />
//             <MyListing
//               imageSrc="./source1.jpg"
//               price="25256"
//               type="Office for Sale"
//               size="900"
//               location="DHA Phase VI, Karachi, Pakistan"
//               date="26.11.2024 - A DAY AGO"
//             />
//             <MyListing
//               imageSrc="./source1.jpg"
//               price="25256"
//               type="Office for Sale"
//               size="900"
//               location="DHA Phase VI, Karachi, Pakistan"
//               date="26.11.2024 - A DAY AGO"
//             />
//             <Footer />
//           </>
//         } />

//         <Route path='/chatpage' element={
//           <>
//             <Navbar />
//             <ChatPage_1 />
//             <Footer />
//           </>
//         } />
//       </Routes>

//     </div>
//   );
// }

// export default App;






import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import HeaderComponent from './components/HeaderComponent';
import RealEstateCard from './components/RealEstateCard';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import ParentLayout from './components/ParentLayout';
import PropertyListingForm from './components/PropertyListingForm';
import OfferContainer from './components/OfferContainer';
import MyOfferContainer from './components/MyOfferContainer';
import MyListing from './components/MyListing';
import PropertyDetail from './components/PropertyDetails';
import AgentLogin from './components/AgentLogin';
import AgentReg from './components/AgentReg';
import ChatPage_1 from './components/ChatPage_1';
import SearchPage from './components/SearchPage';  
import ResultRow from './components/ResultRow';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <HeaderComponent />
            <div className='property-container'>
              <RealEstateCard imageSrc='./source1.jpg' price="25256" type="Office for Sale" size="900" location="DHA Phase VI, Karachi, Pakistan" date="26.11.2024 - A DAY AGO" />
            </div>
            <Footer />
          </>
        } />

        {/* Search Results Page */}
        <Route path="/search-results" element={
          <>
            <Navbar />
            <SearchPage />
            <Footer />
          </>
        } />

        {/* Property Details (Dynamic ID Route) */}
        <Route path="/property/:id" element={
          <>
            <Navbar />
            <PropertyDetail />
            <Footer />
          </>
        } />

        {/* Authentication Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Other Static Pages */}
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/services" element={<><Navbar /><Services /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

        {/* Property Listing Form */}
        <Route path="/new-listing" element={<PropertyListingForm />} />

        {/* Offers & Listings */}
        <Route path="/view-offers" element={<><Navbar /><OfferContainer /><Footer /></>} />
        <Route path="/my-offers" element={<><Navbar /><MyOfferContainer /><Footer /></>} />

        {/* Agent Portal */}
        <Route path="/AgentPortal" element={<><Navbar /><AgentLogin /><Footer /></>} />
        <Route path="/AgentPortal/Registration" element={<><Navbar /><AgentReg /><Footer /></>} />

        {/* My Listings */}
        <Route path="/my-listings" element={
          <>
            <Navbar />
            <MyListing imageSrc="./source1.jpg" price="25256" type="Office for Sale" size="900" location="DHA Phase VI, Karachi, Pakistan" date="26.11.2024 - A DAY AGO" />
            <Footer />
          </>
        } />

        {/* Chat Page */}
        <Route path="/chatpage" element={<><Navbar /><ChatPage_1 /><Footer /></>} />
      </Routes>
    </div>
  );
}

export default App;
