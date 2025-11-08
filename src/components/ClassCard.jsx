import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteClass } from "../Store/Slices/ClassSlice";
import { BookOpen, Users, Pencil, Trash2, Calendar, ArrowRight, Clock } from "lucide-react";

const ClassCard = ({ classItem }) => {
  const dispatch = useDispatch();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${classItem.name}"? This will also delete all related grades and enrollments.`)) {
      return;
    }

    try {
      await dispatch(deleteClass(classItem._id)).unwrap();
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : error?.message || error?.error || "Failed to delete class.";
      alert(`Error: ${errorMessage}`);
    }
  };

  const studentCount = classItem.studentCount ?? classItem.students?.length ?? 0;
  const capacity = classItem.capacity || "Unlimited";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="bg-violet-100 rounded-lg p-3 flex-shrink-0">
              <BookOpen className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={`/class/${classItem._id}`}
                className="block group"
              >
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-1 truncate">
                  {classItem.name}
                </h3>
              </Link>
              {classItem.subject && (
                <p className="text-sm text-gray-600 mb-2">{classItem.subject}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {classItem.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {classItem.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-violet-500" />
            <span>
              <span className="font-semibold text-gray-900">{studentCount}</span>{" "}
              {studentCount === 1 ? "student" : "students"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              Capacity: <span className="font-semibold text-gray-900">{capacity}</span>
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 mb-4">
          {classItem.gradeLevel && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium mr-2">Grade:</span>
              <span>{classItem.gradeLevel}</span>
            </div>
          )}
          {classItem.schedule && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-2" />
              <span className="truncate">{classItem.schedule}</span>
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-2" />
            <span>Created {formatDate(classItem.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/class/${classItem._id}`}
            className="inline-flex items-center text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              to={`/editclass/${classItem._id}`}
              className="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              title="Edit class"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete class"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;