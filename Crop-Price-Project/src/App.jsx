import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './Landingpage.jsx';
import CropPricePrediction from "./CropPricePrediction.jsx";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/predict" element={<CropPricePrediction/>}/>
        </Routes>
      </Router>
  )
}

export default App;



