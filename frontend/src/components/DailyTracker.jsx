import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const DailyTracker = () => {
  const [dailyLimit, setDailyLimit] = useState("");
  const [appliances, setAppliances] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [usageHours, setUsageHours] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const applianceOptions = {
    Refrigerator: 1.5,
    "Washing Machine": 0.5,
    "Air Conditioner": 2.0,
    "Microwave Oven": 1.0,
    "LED TV": 0.1,
  };

  const handleAddAppliance = () => {
    if (!selectedAppliance || !usageHours) {
      setPopupType("error");
      setShowModal(true);
      return;
    }
    const energyConsumption = applianceOptions[selectedAppliance] * parseFloat(usageHours);
    setAppliances([
      ...appliances,
      {
        name: selectedAppliance,
        usage: usageHours,
        energy: energyConsumption.toFixed(2),
      },
    ]);
    setSelectedAppliance("");
    setUsageHours("");
  };

  const calculateTotalEnergy = () => {
    return appliances.reduce((total, item) => total + parseFloat(item.energy || 0), 0);
  };

  const handleSubmit = () => {
    const totalEnergy = calculateTotalEnergy();
    if (totalEnergy > parseFloat(dailyLimit)) {
      setPopupType("error");
    } else {
      setPopupType("success");
    }
    setShowModal(true);
  };

  const data = {
    labels: appliances.map((item) => item.name),
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: appliances.map((item) => parseFloat(item.energy)),
        backgroundColor: "rgba(255, 255, 102, 0.8)",
        borderColor: "rgba(255, 255, 102, 1)", 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white", 
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white", 
        },
      },
    },
  };

  const instructionsContent = (
    <div className="text-black">
      <h3 className="text-lg font-bold mb-2">Instructions to Reduce Energy Usage</h3>
      <ul className="list-disc ml-4 mb-4">
        {appliances.map((item, index) => (
          <li key={index}>
            {item.name}: {item.energy} kWh ({item.usage} hours)
          </li>
        ))}
      </ul>
      <p>Suggestions to reduce energy usage:</p>
      <ul className="list-disc ml-4">
        <li>Limit the usage of high-energy appliances like Air Conditioners.</li>
        <li>Unplug appliances when not in use to save standby power.</li>
        <li>Use energy-efficient devices wherever possible.</li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Daily Energy Tracker</h1>

      {/* Energy Limit Input */}
      <div className="mb-8 text-center">
        <label className="text-lg font-medium">Set Your Daily Energy Limit (kWh):</label>
        <input
          type="number"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
          className="ml-4 px-4 py-2 border rounded-lg text-black"
          placeholder="Enter limit"
        />
      </div>

      {/* Add Appliance */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Appliance</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={selectedAppliance}
            onChange={(e) => setSelectedAppliance(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          >
            <option value="">Select Appliance</option>
            {Object.keys(applianceOptions).map((appliance) => (
              <option key={appliance} value={appliance}>
                {appliance}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Usage Hours"
            value={usageHours}
            onChange={(e) => setUsageHours(e.target.value)}
            className="px-4 py-2 border rounded-lg text-black"
          />

          <button
            onClick={handleAddAppliance}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {selectedAppliance && usageHours && (
          <p className="mt-4 text-lg">
            Estimated Energy Consumption: {(
              applianceOptions[selectedAppliance] * parseFloat(usageHours)
            ).toFixed(2)}{" "}
            kWh
          </p>
        )}
      </div>

      {/* Appliances List */}
      {appliances.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Appliance List</h2>
          <ul className="bg-white p-4 rounded-lg shadow-lg text-black">
            {appliances.map((item, index) => (
              <li key={index} className="mb-2 flex justify-between">
                <span>
                  {item.name} - {item.usage} hours - {item.energy} kWh
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:bg-green-700"
        >
          Track Energy
        </button>
      </div>

      {/* Bar Chart */}
      {appliances.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Energy Consumption Graph</h2>
          <Bar data={data} options={options} />
        </div>
      )}

      {/* Popup Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
        >
          <div
            className={`p-6 rounded-lg shadow-lg text-white ${
              popupType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <p className="text-xl mb-4">
              {popupType === "success"
                ? "Energy usage is within the limit. Great job!"
                : "Your energy consumption has exceeded the set limit!"}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-white text-black px-4 py-2 rounded-lg"
              >
                Close
              </button>
              {popupType === "error" && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowInstructions(true);
                  }}
                  className="bg-white text-black px-4 py-2 rounded-lg"
                >
                  View Instructions
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {instructionsContent}
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker;
