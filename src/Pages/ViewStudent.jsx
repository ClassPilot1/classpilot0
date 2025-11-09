/**
 * View Students Page Component / Qaybta Bogga Eegista Ardayda
 * Displays all students with search functionality
 * Wuxuu muujinayaa dhammaan ardayda leh shaqada baadhida
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, AlertCircle, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../Store/Slices/studentSlice";
import StudentCard from "../components/StudentCard";

const StudentsPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { students, status, error } = useSelector((state) => state.students);

  // Search query state / Xaaladda weydiinta baadhida
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Fetch students when component mounts
   * Soo qaado ardayda marka qaybtu bilaabmo
   */
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  /**
   * Filter students by search query
   * Filtaar ardayda adoo adeegsanaya weydiinta baadhida
   */
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.className?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">

        {/* Students Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Students</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage your student roster</p>
            </div>
            {isAuthenticated && (
              <Link
                to="/addstudent"
                className="inline-flex items-center justify-center px-4 py-2 bg-sky-500 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-sky-600 transition-colors w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>+ Add Student</span>
              </Link>
            )}
          </div>

          {/* Student Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Student list */}
          {status === "loading" ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center py-8">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading students...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center py-8 px-4">
              <div className="rounded-lg bg-red-50 p-6 sm:p-8 text-center border border-red-200 max-w-md w-full">
                <AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">{error}</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center py-8 px-4">
              <div className="text-center max-w-md">
                <Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900 px-4">
                  {searchQuery ? "No students found matching your search" : "No students found"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "Check back soon for student additions"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student._id} student={student} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
