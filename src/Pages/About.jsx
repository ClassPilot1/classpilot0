/**
 * About Page Component / Qaybta Bogga About
 * Displays information about ClassPilot features and team members
 * Wuxuu muujinayaa macluumaadka ku saabsan sifooyinka ClassPilot iyo xubnaha kooxda
 */
import React from "react";
// Team member images / Sawirrada xubnaha kooxda
import nurImage from "../assets/nur.jpg";
import yusufImage from "../assets/yuusuf.jpeg.jpeg";
import abdulkadirImage from "../assets/abdulkadirimage.jpeg";
import {
  Lock,
  Users,
  BookOpen,
  LayoutDashboard,
  Smartphone,
  Info,
  Settings
} from "lucide-react";

const About = () => {
  /**
   * Application features list / Liiska sifooyinka codka
   * Each feature has an icon, title, description, and color scheme
   * Sifo kasta wuxuu leeyahay astaan, cinwaan, sharax, iyo nooc midab
   */
  const features = [
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Teachers can sign up, log in, and log out securely, accessing a private dashboard tailored to their needs with robust security measures.",
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Easily add, view, edit, and delete students while keeping track of comprehensive details including names, age, gender, and personal notes.",
      color: "from-sky-500 to-sky-600",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      icon: BookOpen,
      title: "Class Management",
      description: "Create and manage multiple classes, assign students to classes, and view detailed rosters with enrollment tracking for each class.",
      color: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      icon: LayoutDashboard,
      title: "Comprehensive Dashboard",
      description: "Get a quick overview of your total students, total classes, and recent updates all in one centralized, easy-to-read dashboard.",
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Settings,
      title: "Profile Management",
      description: "Manage your account information, update personal details like name and email, change your password, enable two-factor authentication, and control your account settings all in one place.",
      color: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "With a clean, responsive design and intuitive navigation, ClassPilot works seamlessly on both desktop and mobile devices.",
      color: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  /**
   * Team members information / Macluumaadka xubnaha kooxda
   * Contains name, role, and profile image for each team member
   * Wuxuu ka koobanyahay magac, shaqo, iyo sawirka shakhsiyadda xubnaha kooxda
   */
  const teamMembers = [
    {
      name: "Nur Kasim",
      role: "Student Management And Dashboard",
      image: nurImage,
    },
    {
      name: "Yusuf",
      role: "Class Management",
      image: yusufImage,
    },
    {
      name: "cabdiqaadir",
      role: "Authentication and Profile",
      image: abdulkadirImage,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section / Qaybta Madaxa */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Info className="mr-3 h-6 w-6 sm:h-8 sm:w-8 text-violet-500" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">About ClassPilot</h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                A smart classroom management system designed to help teachers organize and manage their students with ease.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section / Qaybta Sifooyinka */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Display each feature card / Muuji kaar kasta oo sifo ah */}
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className={`${feature.iconBg} rounded-lg p-3 mr-4 flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section / Qaybta Kooxda */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Display each team member card / Muuji kaar kasta oo xubnaha kooxda ah */}
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                {/* Member Photo / Sawirka Xubnaha */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-gray-200"
                />

                {/* Member Name / Magaca Xubnaha */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>

                {/* Member Role / Shaqada Xubnaha */}
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
