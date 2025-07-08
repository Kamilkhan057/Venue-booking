import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaVideo, 
  FaLink, 
  FaUserFriends,
  FaCheckCircle,
  FaChalkboard,
  FaMicrophone,
  FaRecordVinyl
} from 'react-icons/fa';

const Virtual = () => {
  const initialForm = {
    name: '',
    email: '',
    department: '',
    platform: '',
    link: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: 8,
    requirements: [],
  };

  const platformOptions = [
    { id: 'zoom', name: 'Zoom', icon: <FaVideo className="text-blue-500" /> },
    { id: 'teams', name: 'Microsoft Teams', icon: <FaVideo className="text-purple-500" /> },
    { id: 'meet', name: 'Google Meet', icon: <FaVideo className="text-green-500" /> },
    { id: 'webex', name: 'Webex', icon: <FaVideo className="text-red-500" /> },
  ];

  const requirementOptions = [
    { id: 'recording', name: 'Recording', icon: <FaRecordVinyl /> },
    { id: 'whiteboard', name: 'Virtual Whiteboard', icon: <FaChalkboard /> },
    { id: 'moderation', name: 'Moderation Tools', icon: <FaMicrophone /> },
  ];

  const [formData, setFormData] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
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
    
    if (!formData.name || !formData.email || !formData.platform || !formData.date) {
      alert('Please fill all required fields');
      return;
    }
    
    setShowModal(true);
  };

  const handleReset = () => {
    setFormData(initialForm);
    setTimeError('');
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-3 rounded-xl">
          <FaVideo className="text-purple-600 text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Virtual Meeting Details</h2>
          <p className="text-gray-500">Schedule an online video conference with virtual tools</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">1</div>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Marketing"
              />
            </div>
          </div>
        </div>

        {/* Meeting Details */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">2</div>
            Meeting Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-sm">
            <div>
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
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
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
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
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
                  max="50"
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

        {/* Platform Selection */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">3</div>
            Select Platform
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformOptions.map(platform => (
              <div
                key={platform.id}
                onClick={() => setFormData(prev => ({ ...prev, platform: platform.id }))}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                  formData.platform === platform.id
                    ? 'border-purple-500 bg-purple-50 shadow-sm'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-3">
                    {platform.icon}
                  </div>
                  <h4 className="font-bold text-gray-800 text-center">{platform.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Link */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">4</div>
            Meeting Link
          </h3>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Meeting URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                  placeholder="https://meet.example.com/your-meeting"
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">5</div>
            Additional Features
          </h3>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {requirementOptions.map(req => (
                <div
                  key={req.id}
                  onClick={() => handleRequirementChange(req.id)}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.requirements.includes(req.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl mb-2 ${
                    formData.requirements.includes(req.id) 
                      ? 'text-purple-600' 
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
            className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl hover:opacity-90 transition shadow-lg"
          >
            Schedule Virtual Meeting
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
              Virtual Meeting Scheduled!
            </Dialog.Title>
            
            <Dialog.Description className="text-gray-600 mb-6">
              Your online meeting has been successfully booked. Invitations have been sent to participants.
            </Dialog.Description>
            
            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>{formData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-500" />
                  <span>{formData.startTime} - {formData.endTime}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <FaVideo className="text-gray-500" />
                  <span className="truncate">{formData.link}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl hover:opacity-90 transition w-full"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Virtual;