import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteStudent } from "../Store/Slices/studentSlice";
import { User, Mail, Pencil, Trash2, Calendar } from "lucide-react";

const StudentCard = ({ student }) => {
  const dispatch = useDispatch();
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow h-full">
      {/* Edit and Delete Icons - Top Right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
        <Link
          to={`/editstudent/${student._id}`}
          className="text-gray-600 hover:text-violet-500 transition-colors p-1"
          aria-label="Edit student"
        >
          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
        <button
          className="text-gray-600 hover:text-red-500 transition-colors p-1"
          aria-label="Delete student"
          onClick={async (e) => {
            e.preventDefault();
            if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
              try {
                await dispatch(deleteStudent({ id: student._id })).unwrap();
              } catch (error) {
                alert(error || "Failed to delete student. Please try again.");
              }
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>

      {/* Avatar and Name */}
      <div className="flex items-start mb-3 sm:mb-4 pr-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{student.name || "Unknown Student"}</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {student.age ? `${student.age} years old` : "Age not specified"}
          </p>
        </div>
      </div>

      {/* Student Info */}
      <div className="space-y-2 sm:space-y-2.5">
        {/* Email */}
        <div className="flex items-start text-xs sm:text-sm text-gray-700">
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
          <span className="break-words break-all">{student.email || "No email"}</span>
        </div>

        {/* Class */}
        {student.className && (
          <div className="text-xs sm:text-sm text-gray-700">
            <span className="font-medium">Class:</span> {student.className}
          </div>
        )}

        {/* Gender */}
        {student.gender && (
          <div className="text-xs sm:text-sm text-gray-700">
            <span className="font-medium">Gender:</span> {student.gender}
          </div>
        )}

        {/* Joined Date */}
        <div className="flex items-center text-xs sm:text-sm text-gray-700">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>
            <span className="font-medium">Joined:</span> {formatDate(student.createdAt || student.joinedDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
