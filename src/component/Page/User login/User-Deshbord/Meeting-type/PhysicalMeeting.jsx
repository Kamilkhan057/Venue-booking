import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUserFriends,
  FaVideo,
  FaUtensils,
  FaWifi,
  FaCheckCircle,
  FaChalkboard,
  FaLaptop
} from 'react-icons/fa';

const Physical = () => {
  const initialForm = {
    name: '',
    email: '',
    department: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: 5,
    room: '',
    requirements: [],
  };

  const roomOptions = [
    { id: '101', name: 'Conference Room A', capacity: 10, features: ['Projector', 'Whiteboard'] },
    { id: '102', name: 'Conference Room B', capacity: 15, features: ['TV Screen', 'Conference Phone'] },
    { id: '201', name: 'Executive Suite', capacity: 8, features: ['Soundproof', 'Catering'] },
    { id: '202', name: 'Innovation Hub', capacity: 20, features: ['Smart Board', 'Video Conferencing'] },
    { id: '301', name: 'Board Room', capacity: 12, features: ['Leather Seats', 'Premium Audio'] },
  ];

  const requirementOptions = [
    { id: 'projector', name: 'Projector', icon: <FaVideo /> },
    { id: 'catering', name: 'Catering', icon: <FaUtensils /> },
    { id: 'wifi', name: 'High-speed WiFi', icon: <FaWifi /> },
    { id: 'whiteboard', name: 'Whiteboard', icon: <FaChalkboard /> },
    { id: 'video', name: 'Video Conferencing', icon: <FaLaptop /> },
  ];

  const [formData, setFormData] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [timeError, setTimeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (id) => {
    setFormData(prev => {
      const requirements = [...prev.requirements];
      if (requirements.includes(id)) {
        return { ...prev, requirements: requirements.filter(item => item !== id) };
      } else {
        return { ...prev, requirements: [...requirements, id] };
      }
    });
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setFormData(prev => ({ ...prev, room: room.name }));
  };

  const validateTime = () => {
    if (!formData.startTime || !formData.endTime) return true;
    if (formData.startTime >= formData.endTime) {
      setTimeError('End time must be after start time');
      return false;
    }
    setTimeError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTime()) return;
    
    // Additional validation
    if (!formData.name || !formData.email || !formData.room || !formData.date) {
      alert('Please fill all required fields');
      return;
    }
    
    setShowModal(true);
  };

  const handleReset = () => {
    setFormData(initialForm);
    setSelectedRoom(null);
    setTimeError('');
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl">
          <FaMapMarkerAlt className="text-blue-600 text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Physical Meeting Details</h2>
          <p className="text-gray-500">Book an in-person meeting space with resources</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Personal Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
              1
            </div>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-sm">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Marketing"
              />
            </div>
          </div>
        </div>

        {/* Meeting Details */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
              2
            </div>
            Meeting Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    onBlur={validateTime}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  End Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    onBlur={validateTime}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {timeError && (
                <p className="col-span-2 text-red-500 text-sm mt-1">{timeError}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Number of Attendees <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  name="attendees"
                  min="1"
                  max="20"
                  value={formData.attendees}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <FaUserFriends className="text-gray-600" />
                  <span className="font-medium">{formData.attendees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
              3
            </div>
            Select Meeting Room
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomOptions.map(room => (
              <div
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                  selectedRoom?.id === room.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800">{room.name}</h4>
                  <div className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-full">
                    <FaUserFriends className="text-gray-600" />
                    <span>{room.capacity}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Room {room.id}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {room.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
              4
            </div>
            Additional Requirements
          </h3>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {requirementOptions.map(req => (
                <div
                  key={req.id}
                  onClick={() => handleRequirementChange(req.id)}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.requirements.includes(req.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl mb-2 ${
                    formData.requirements.includes(req.id) 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                  }`}>
                    {req.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{req.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-3 text-base font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:opacity-90 transition shadow-lg"
          >
            Book Physical Meeting
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            
            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-3">
              Meeting Booked Successfully!
            </Dialog.Title>
            
            <Dialog.Description className="text-gray-600 mb-6">
              Your physical meeting has been scheduled at <span className="font-semibold">{selectedRoom?.name}</span>.
              Confirmation details have been sent to your email.
            </Dialog.Description>
            
            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedRoom?.name}</h4>
                  <p className="text-sm text-gray-500">Room {selectedRoom?.id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>{formData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-500" />
                  <span>{formData.startTime} - {formData.endTime}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:opacity-90 transition w-full"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Physical;