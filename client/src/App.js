import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import HeaderComponent from './components/HeaderComponent';
import RealEstateCard from './components/RealEstateCard';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Login from './components/Login';
import Filter from './components/Filter';
import ResultCard from './components/ResultCard';
import ResultsTab from './components/ResultsTab';
import ParentLayout from './components/ParentLayout';
import PropertyListingForm from './components/PropertyListingForm';
import ChatPage_1 from './components/ChatPage_1';
import MyListing from './components/MyListing';
import OfferContainer from './components/OfferContainer';
import MakeOffer from './components/MakeOffer';
import PropertyDetail from './components/PropertyDetails';
import AgentLogin from './components/AgentLogin';
import AgentReg from './components/AgentReg';
import MyOfferContainer from './components/MyOfferContainer';
import Inspection_Agent from './components/Inspection_Agent';
import OnsiteInspectorForm from './components/OnsiteInspectorForm'
import TopProperties from './components/TopProperties';
import Dashboard from './components/Dashboard';
import AgentNavbar from './components/AgentNavbar';
import OnsiteInspectionReport from './components/OnsiteInspectionReport';
import sampleInspectionData from './components/sampleInspectionData';
import AIPropertyInspection from './components/AIPropertyEstimation';
import OnsiteInspectionRequestForm from './components/OnsiteInspectionRequestForm';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './Usercontext'; // Import UserProvider
import AIPropertyEstimation from './components/AIPropertyEstimation';


function App() {
  return (
    <UserProvider> {/* Wrap everything with UserProvider */}
      <div className="App">
        <Routes>
          <Route path='/' element={
            <>
              <Navbar />
              <HeaderComponent />
              {/* <div className='property-container'>
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
            </div> */}
              <TopProperties />
              <Footer />
            </>
          } />

          <Route path='/search-results' element={
            <>
              <Navbar />
              <ParentLayout />
            </>
          } />

          <Route path='/signup' element={
            <>
              <Signup />
            </>
          } />

          <Route path='/AgentPortal/Registration' element={
            <>
              <AgentReg />
            </>
          } />
          <Route path='/AgentPortal/Home' element={
            <>
              <AgentNavbar />
              <Dashboard />
              <Footer />
            </>
          } />
          <Route path='/AgentPortal/about' element={
            <>
              <AgentNavbar />
              <About />
              <Footer />
            </>
          } />
          <Route path='/AgentPortal/services' element={
            <>
              <AgentNavbar />
              <Services />
              <Footer />
            </>
          } />
          <Route path='/AgentPortal/contact' element={
            <>
              <AgentNavbar />
              <Contact />
              <Footer />
            </>
          } />
          <Route path='/AgentPortal/chatpage' element={
            <>
              <AgentNavbar />
              <ChatPage_1 />
              <Footer />
            </>
          } />

          <Route path='/login' element={
            <>
              <Login />
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

          <Route path='/about' element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          } />
          <Route path='/AIPropertyValuation' element={
            <>
              <Navbar />
             <AIPropertyEstimation/>
              <Footer />
            </>
          } />
          <Route path='/onsiteInspectionRequestForm' element={
            <>
              <Navbar />
              <OnsiteInspectionRequestForm/>
              <Footer />
            </>
          } />
          <Route path='/onsiteInspectionResult' element={
            <>
              <Navbar />
              <div>
                {sampleInspectionData.map((data, index) => (
                  <OnsiteInspectionReport key={index} {...data} />
                ))}
              </div>
              <Footer />
            </>
          } />
          <Route path='/services' element={
            <>
              <Navbar />
              <Services />
              <Footer />
            </>
          } />
          <Route path='/contact' element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />

          <Route element={<ProtectedRoute />}>
            <Route path='/new-listing' element={
              <>
                <PropertyListingForm />
              </>
            } />
            <Route path='/my-listings' element={
              <>
                <Navbar />
                <MyListing />
                <Footer />
              </>
            } />
          </Route>

          <Route path='/veiw-offers' element={
            <>
              <Navbar />
              <OfferContainer />
              <Footer />
            </>
          } />
          <Route path='/veiw-offers' element={
            <>
              <Navbar />
              <OfferContainer />
              <Footer />
            </>
          } />

          <Route path='/my-offers' element={
            <>
              <Navbar />
              <MyOfferContainer />
              <Footer />
            </>
          } />

          <Route path='/AgentPortal' element={
            <>
              <Navbar />
              <AgentLogin />
              <Footer />
            </>
          } />
          <Route path='/AgentPortal' element={
            <>
              <Navbar />
              <AgentLogin />
              <Footer />
            </>
          } />

          <Route path='/AgentPortal/onsite-inspection' element={
            <>
              <Navbar />
              <Inspection_Agent />
              <Footer />
            </>
          } />
          <Route path='/AgentPortal/onsite-inspector' element={
            <>
              <AgentNavbar />
              <OnsiteInspectorForm />
              <Footer />
            </>
          } />

          <Route path='/property/:id' element={
            <>
              <Navbar />
              <PropertyDetail />
              <Footer />
            </>
          } />

          <Route path='/chatpage' element={
            <>
              <Navbar />
              <ChatPage_1 />
              <Footer />
            </>
          } />
        </Routes>

      </div>
    </UserProvider>
  );
}

export default App;
