import React from "react";
import { useNavigate } from "react-router-dom";

const EnergyTrackingSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (trackingType) => {
    if (trackingType === "Daily") {
      navigate("/daily-tracker");
    }else if(trackingType==="Weekly"){
        navigate("/weekly-tracker")
    }else if(trackingType==="Monthly"){
      navigate("/monthly-tracker")
  } 
    else {
      alert(`Currently, only Daily , weekly and monthly Tracking is available.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Choose Your Energy Tracking Mode
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-12">
        Select how you want to track your energy consumption.
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        {["Daily", "Weekly", "Monthly"].map((type) => (
          <button
            key={type}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform"
            onClick={() => handleSelection(type)}
          >
            {type} Tracking
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnergyTrackingSelection;
