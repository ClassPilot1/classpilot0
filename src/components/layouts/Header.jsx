/**
 * Header Component / Qaybta Madaxa
 * Main navigation header with sidebar menu and top bar
 * Madaxa ugu weyn ee socodka leh menu dhinaca iyo bar dusha sare
 */
import React, { useState, useEffect } from 'react';
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
  LogOut,
  Menu,
  X,
  Info
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Get user's first name from full name or email
   * Soo hel magaca koowaad ee isticmaalaha magaca buuxa ama iimaylka
   */
  const getUserFirstName = () => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  /**
   * Handle user logout / Maamul bixinta isticmaalaha
   * Logs out the user and redirects to login page
   * Wuxuu bixiyaa isticmaalaha oo wuxuu u wadaa bogga login
   */
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      // Still navigate to login even if logout fails
      // Weli u wadaa login haddii bixinta ay ku guuldareyso
      navigate("/login");
    }
  };

  /**
   * Close sidebar on mobile when route changes
   * Xidh dhinaca marka waddada isbadalato mobile-ka
   */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  /**
   * Close sidebar when window is resized to desktop size
   * Xidh dhinaca marka daaqaddu weyso ilaa cabirka desktop
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Handle link click - close sidebar on mobile devices
   * Maamul gujinta xiriirka - xidh dhinaca qalabka mobile
   */
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  /**
   * Toggle sidebar open/close state
   * Beddel xaaladda furid/fididka dhinaca
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile Overlay / Dahaarka Mobile */}
      {/* Dark overlay that appears when sidebar is open on mobile */}
      {/* Dahaar madow oo muujiya marka dhinaca mobile furan yahay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Navigation / Socodka Dhinaca */}
      {/* Main navigation sidebar with menu items */}
      {/* Socodka ugu weyn ee dhinaca leh goobaha menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-violet-900 to-violet-800 text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section / Qaybta Sumadda */}
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

        {/* Navigation Menu / Menu Socodka */}
        <nav className="flex-1 px-4 space-y-2">

         <Link
              to="/dashboard"
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
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
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "bg-violet-500 text-white" 
                  : "text-violet-200 hover:bg-violet-500 hover:text-white"
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Profile
            </Link>

            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/about"
                  ? "bg-violet-500 text-white" 
                  : "text-violet-200 hover:bg-violet-500 hover:text-white"
              }`}
            >
              <Info className="mr-3 h-5 w-5" />
              About
            </Link>

        </nav>

        {/* User Profile Section / Qaybta Profile-ka Isticmaalaha */}
        {/* Shows user info and logout button */}
        {/* Wuxuu muujinayaa macluumaadka isticmaalaha iyo badhanka bixinta */}
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
          
          {/* Logout Button / Badhanka Bixinta */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center text-violet-200 hover:text-white hover:bg-violet-600 rounded-lg px-4 py-2 transition-colors text-sm font-medium"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Header Bar / Bar Dusha Sare */}
      {/* Top navigation bar with greeting and search */}
      {/* Bar socodka dusha sare leh salaanta iyo baadhida */}
      <div className="fixed top-0 left-0 lg:left-64 right-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 z-30 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Left: Hamburger Menu + Greeting / Bidix: Menu + Salaanta */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button / Badhanka Menu Hamburger */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Hello {getUserFirstName()}{" "}
                <span role="img" aria-label="wave">👋</span>
              </h1>
            </div>
          </div>

          {/* Right: Search, Notifications, Messages / Midig: Baadhida, Ogeysiisyada, Farriimaha */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Bar / Bar Baadhida */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search from subjects, assignments,"
                className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent bg-gray-50 hover:bg-gray-100 text-sm"
              />
            </div>

            {/* Notifications Icon / Astaanta Ogeysiisyada */}
            <div className="relative">
              <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 cursor-pointer hover:text-sky-500 transition-colors" />
              <span className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                3
              </span>
            </div>

            {/* Messages Icon / Astaanta Farriimaha */}
            <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 cursor-pointer hover:text-sky-500 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;