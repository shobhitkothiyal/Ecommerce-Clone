import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  getUserAddresses,
  deleteAddress,
  updateAddress,
} from "../Redux/Auth/actions.js";

const Addresses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    streetAddress: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    mobile: "",
    isDefault: false,
  });

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (address) => {
    setFormData({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      company: address.company || "",
      streetAddress: address.streetAddress || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      zipCode: address.zipCode || "",
      mobile: address.mobile || "",
      isDefault: address.isDefault || false,
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(addressId))
        .then(() => alert("Address deleted successfully"))
        .catch((err) => alert("Failed to delete address: " + err));
    }
  };

  const handleSetDefault = (address) => {
    dispatch(updateAddress(address._id, { ...address, isDefault: true }))
      .then(() => alert("Default address updated successfully"))
      .catch((err) => alert("Failed to update default address: " + err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateAddress(editingId, formData))
        .then(() => {
          alert("Address updated successfully");
          setShowForm(false);
          setEditingId(null);
          setFormData({
            firstName: "",
            lastName: "",
            company: "",
            streetAddress: "",
            address2: "",
            city: "",
            state: "",
            country: "India",
            zipCode: "",
            mobile: "",
            isDefault: false,
          });
        })
        .catch((err) => alert("Failed to update address: " + err));
    } else {
      dispatch(addAddress(formData))
        .then(() => {
          alert("Address added successfully");
          setShowForm(false);
          setFormData({
            firstName: "",
            lastName: "",
            company: "",
            streetAddress: "",
            address2: "",
            city: "",
            state: "",
            country: "India",
            zipCode: "",
            mobile: "",
            isDefault: false,
          });
        })
        .catch((err) => alert("Failed to add address: " + err));
    }
  };

  return (
    <div className="max-w-[1390px] mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-serif text-center mb-2">Your Addresses</h1>
      <div className="flex justify-center text-sm text-gray-500 mb-12 gap-2">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <span>&gt;</span>
        <Link to="/orders" className="hover:text-black">
          Account
        </Link>
        <span>&gt;</span>
        <span>Addresses</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex flex-col border-l-2 border-transparent">
            <Link
              to="/orders"
              className="pl-4 py-2 text-gray-500 hover:text-black transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/account/addresses"
              className="pl-4 py-2 font-bold text-black border-l-2 border-black -ml-[2px]"
            >
              Addresses
            </Link>
            <button
              onClick={handleLogout}
              className="pl-4 py-2 text-gray-500 hover:text-black transition-colors text-left"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h2 className="text-2xl font-serif mb-6">
            Your Addresses ({user?.addresses?.length || 0})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {user?.addresses?.map((address, index) => (
              <div key={index} className="border p-4 rounded relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <p className="font-bold">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.streetAddress}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
                <p>Mobile: {address.mobile}</p>
                {address.isDefault ? (
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded mt-2 inline-block">
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(address)}
                    className="mt-2 text-sm text-gray-500 hover:text-black underline block"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>

          {!showForm ? (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({
                  firstName: "",
                  lastName: "",
                  company: "",
                  streetAddress: "",
                  address2: "",
                  city: "",
                  state: "",
                  country: "India",
                  zipCode: "",
                  mobile: "",
                  isDefault: false,
                });
              }}
              className="bg-black text-white px-8 py-3 font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Add a New Address
            </button>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg max-w-3xl">
              <h3 className="text-xl font-medium mb-6">
                {editingId ? "Edit Address" : "Add a New Address"}
              </h3>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Address 1
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black bg-white"
                  >
                    <option value="India">India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Set as default address
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2 flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded font-bold hover:opacity-90"
                  >
                    {editingId ? "Update Address" : "Add Address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-600 hover:text-black font-medium px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;