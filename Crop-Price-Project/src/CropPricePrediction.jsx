import { useState } from "react";
import axios from "axios";
import logo from "../public/assets//logo-1.jpg";

export default function CropPricePrediction() {
  const [formData, setFormData] = useState({
    state: "",
    crop: "",
    temperature: "",
    rainfall: "",
    yield: "",
    production: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://farmahelp-application.onrender.com/predict", formData);
      console.log(response.data);
      setPrediction(response.data.predicted_price);
    } catch (error) {
      console.error("Error fetching prediction", error);
    }
  };

  const states = ["Andhra Pradesh","Bihar","Gujarat", "Uttar Pradesh","Karnataka", "Maharashtra", "Rajasthan", "Tamil Nadu", "Madhya Pradesh", "Punjab", "Haryana"];
  const crops = ["PADDY", "WHEAT", "MAIZE", "SUGARCANE", "COTTON","ARHAR","MOONG","GRAM"];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-2 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <img src={logo}  alt="FarmaHelp" className="w-10 h-10 md:w-12 md:h-12 object-contain"/>
                <h1 className="text-2xl font-bold">FarmaHelp</h1>
            </div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold text-center mb-4">Crop Price Prediction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
                >
                <option value="">Select State</option>
                {states.map((state) => (
                    <option key={state} value={state}>
                    {state}
                    </option>
                ))}
            </select>
            <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
                >
                <option value="" className="font-thin">Select Crop</option>
                {crops.map((crop) => (
                    <option key={crop} value={crop}>
                    {crop}
                    </option>
                ))}
            </select>
            {["temperature", "rainfall", "yield", "production"].map((key) => (
              <input
                key={key}
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
            ))}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 active:scale-95 transition transform duration-150"
            >
              Predict Price
            </button>
          </form>

          {/* Prediction Result */}
          {prediction && (
            <p className="text-lg font-bold text-center mt-4 bg-green-100 p-3 rounded shadow-md">
              Predicted Price: <span className="text-green-700">₹{prediction}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}