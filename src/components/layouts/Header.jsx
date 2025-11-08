import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../Store/Slices/AuthSlice';
import { 
  Home, 
  Users, 
  BookOpen,
  Settings,
  ChevronDown,
  Search,
  Bell,
  MessageCircle,
  LogOut
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Get user's first name from full name or email
  const getUserFirstName = () => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to login even if logout fails
      navigate("/login");
    }
  };

  const navigationItems = [
 
    { name: 'View Students', href: '/students', icon: Users },
   
  ];

  return (
    <>
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-violet-900 to-violet-800 text-white flex flex-col">
 
      <div className="flex items-center px-6 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-300 to-violet-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold">ClassPilot</h1>
            <p className="text-xs text-violet-200">Teaching made magical</p>
          </div>
        </div>
      </div>


      <nav className="flex-1 px-4 space-y-2">

         <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/home" || location.pathname === "/dashboard"
                  ? "bg-violet-500 text-white" 
                  : "text-violet-200 hover:bg-violet-500 hover:text-white"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
             <Link
              to="/viewstudent"
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/viewstudent" || location.pathname === "/addstudent" || location.pathname.startsWith("/editstudent")
                  ? "bg-violet-500 text-white" 
                  : "text-violet-200 hover:bg-violet-500 hover:text-white"
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Students
            </Link>



             <Link
              to="/viewclass"
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/viewclass" || location.pathname === "/addclass" || location.pathname.startsWith("/editclass") || location.pathname.startsWith("/class/")
                  ? "bg-violet-500 text-white" 
                  : "text-violet-200 hover:bg-violet-500 hover:text-white"
              }`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Classes
            </Link>

            <Link
              to="/profile"
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "bg-violet-500 text-white" 
                  : "text-violet-200 hover:bg-violet-500 hover:text-white"
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Profile
            </Link>

      </nav>


      <div className="p-4 border-t border-violet-700">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">T</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Welcome Back!</p>
            <p className="text-xs text-violet-200">
              {user?.name || user?.email?.split("@")[0] || "Teacher"}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-violet-200" />
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center text-violet-200 hover:text-white hover:bg-violet-600 rounded-lg px-4 py-2 transition-colors text-sm font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
      </div>

      {/* Top Header Bar */}
      <div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          {/* Left: Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello {getUserFirstName()}{" "}
              <span role="img" aria-label="wave">👋</span>
            </h1>
          </div>

          {/* Right: Search, Notifications, Messages */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search from subjects, assignments,"
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent bg-gray-50 hover:bg-gray-100"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-sky-500 transition-colors" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                3
              </span>
            </div>

            {/* Messages */}
            <MessageCircle className="h-6 w-6 text-gray-600 cursor-pointer hover:text-sky-500 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;