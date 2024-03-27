import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Select, Space, message } from "antd";
import DarkButton from "../../../components/darkButton/DarkButton";
import backendURL from "../../../lib/backendURL";
import "./AddNewVehicle.css";

const { Option } = Select;

export default function AddNewVehicleForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newVehicleInfo, setNewVehicleInfo] = useState({
    vehicleNumber: "",
    type: "",
    capacity: "",
    fullyLoadedCost: "",
    unloadedCost: "",
  });

  useEffect(() => {
    const fetchVehicleList = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/vehicle/all-vehicles`, {
          withCredentials: true,
        });
        const nextSTSId = data.vehicles.length + 1;
        setNewVehicleInfo((prevInfo) => ({
          ...prevInfo,
          vehicleID: nextSTSId.toString(),
        }));
      } catch (error) {
        console.error("Failed to fetch Vehicle list:", error);
        message.error("Failed to fetch Vehicle list.");
      }
    };

    fetchVehicleList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicleInfo({ ...newVehicleInfo, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    // Check if the change is for the capacity field and parse the number
    if (name === "capacity") {
      const numericValue = parseInt(value, 10); // Parse the numeric part of the value
      setNewVehicleInfo({ ...newVehicleInfo, [name]: numericValue });
    } else {
      // For all other select fields, set the value directly
      setNewVehicleInfo({ ...newVehicleInfo, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation checks...
    try {
      const response = await axios.post(
        `${backendURL}/vehicle/add-vehicle`,
        newVehicleInfo,
        {
          withCredentials: true,
        }
      );
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/VehicleList");
      }, 2000);
      message.success("Vehicle added successfully");
    } catch (error) {
      console.log(error);
      message.error("An error occurred while adding the vehicle.");
    }
  };

  return (
    <div>
      {showSuccess && (
        <div className="success-message">Vehicle added successfully</div>
      )}
      <form className="add-new-firm-form" onSubmit={handleSubmit}>
        <div className="addfirm-main-form">
          <div className="addfirm-form-left">
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  Vehicle Number &nbsp;
                </label>
                <Input
                  size="large"
                  className="addfirm-form-input"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={newVehicleInfo.vehicleNumber}
                  onChange={handleInputChange} // Added onChange handler
                />
              </Space>
            </div>

            {/* Type dropdown */}
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label className="addfirm-form-label">Type &nbsp;</label>
                <Select
                  size="large"
                  placeholder="Select Type"
                  className="addfirm-form-input"
                  value={newVehicleInfo.type}
                  onChange={(value) => handleSelectChange("type", value)}
                >
                  <Option value="Open Truck">Open Truck</Option>
                  <Option value="Dump Truck">Dump Truck</Option>
                  <Option value="Compactor">Compactor</Option>
                  <Option value="Container Carrier">Container Carrier</Option>
                </Select>
              </Space>
            </div>

            {/* Capacity dropdown */}
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label className="addfirm-form-label">Capacity &nbsp;</label>
                <Select
                  size="large"
                  placeholder="Select Capacity"
                  className="addfirm-form-input"
                  value={newVehicleInfo.capacity}
                  onChange={(value) => handleSelectChange("capacity", value)}
                >
                  <Option value="3 ton">3 ton</Option>
                  <Option value="5 ton">5 ton</Option>
                  <Option value="7 ton">7 ton</Option>
                </Select>
              </Space>
            </div>

            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="password" className="addfirm-form-label">
                  Fully Loaded Cost &nbsp;
                </label>
                <Input
                  size="large"
                  placeholder="Enter the Fully Loaded Cost"
                  className="addfirm-form-input"
                  id="fullyLoadedCost"
                  name="fullyLoadedCost"
                  value={newVehicleInfo.fullyLoadedCost}
                  onChange={handleInputChange}
                />
              </Space>
            </div>
          </div>

          <div className="addfirm-form-right">
            <div className="addfirm-form-row">
              <Space direction="horizontal">
                <label htmlFor="name" className="addfirm-form-label">
                  Un-loaded Cost
                </label>
                <Input
                  size="large"
                  placeholder="Enter the Unloaded Cost"
                  className="addfirm-form-input"
                  id="unloadedCost"
                  name="unloadedCost"
                  value={newVehicleInfo.unloadedCost}
                  onChange={handleInputChange}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="registerbtn">
          <DarkButton
            buttonText="Save"
            onClick={() => {
              handleSubmit;
            }}
            routePath="forbidden"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
