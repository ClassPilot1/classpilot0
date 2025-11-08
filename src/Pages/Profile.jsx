import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../Store/Slices/AuthSlice";
import { 
  User, 
  Mail, 
  Camera, 
  Edit, 
  Lock, 
  Shield, 
  Trash2,
  Settings
} from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    // Fetch user data if not already loaded
    if (!user) {
      dispatch(checkAuthStatus());
    } else {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // TODO: Implement update profile functionality
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setIsEditing(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return "T";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 ml-64 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-500"></div>
              <p className="mt-4 text-sm text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-64 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Settings className="mr-3 h-8 w-8 text-violet-500" />
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-violet-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">
                    {getUserInitials()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.name || "User"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {user?.email || "No email"}
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Information Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditProfile}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors text-sm"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent bg-gray-50"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user?.name || "Not set"}</span>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent bg-gray-50"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user?.email || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>

              <div className="space-y-4">
                {/* Password */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Lock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                    Change Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Management</h2>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Delete Account</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

