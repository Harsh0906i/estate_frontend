import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import Listing from './Pages/Listing';
import Private from "./Components/Private";
import UpdateListing from "./Pages/UpdateListing";
import ShowListings from "./Pages/ShowListings";
import SearchListing from "./Pages/SearchListing";
function App() {
  return ( 
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchListing />} />
        <Route path="/listing/:listingId" element={<ShowListings />} />
        <Route element={<Private />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<Listing />} />
          <Route path="/updateListing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
