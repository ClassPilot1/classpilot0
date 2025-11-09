/**
 * View Classes Page Component / Qaybta Bogga Eegista Daraasyada
 * Displays all classes with search functionality
 * Wuxuu muujinayaa dhammaan daraasyada leh shaqada baadhida
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, AlertCircle, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClasses, getClassById } from "../Store/Slices/ClassSlice";
import ClassCard from "../components/ClassCard";

const ClassesPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { classes, status, error } = useSelector((state) => state.classes);

  // Search query state / Xaaladda weydiinta baadhida
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Fetch classes when component mounts
   * Soo qaado daraasyada marka qaybtu bilaabmo
   * Then fetch each class's details to get accurate studentCount (same as ClassDetail)
   * Kadib soo qaado faahfaahinta daraasad kasta si loo helo studentCount saxda ah (isku midka ClassDetail)
   */
  useEffect(() => {
    const loadClasses = async () => {
      // First fetch the list of classes
      // Marka hore soo qaado liiska daraasyada
      const classesData = await dispatch(fetchClasses()).unwrap();
      
      // Then fetch details for each class to get accurate studentCount
      // Kadib soo qaado faahfaahinta daraasad kasta si loo helo studentCount saxda ah
      if (Array.isArray(classesData) && classesData.length > 0) {
        // Fetch details for each class in parallel
        // Soo qaado faahfaahinta daraasad kasta isku mar
        await Promise.all(
          classesData.map((cls) => dispatch(getClassById(cls._id)))
        );
      }
    };
    
    loadClasses();
  }, [dispatch]);

  /**
   * Filter classes by search query
   * Filtaar daraasyada adoo adeegsanaya weydiinta baadhida
   */
  const filteredClasses = classes.filter((classItem) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      classItem.name?.toLowerCase().includes(query) ||
      classItem.subject?.toLowerCase().includes(query) ||
      classItem.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Classes Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Classes</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage your classes</p>
            </div>
            {isAuthenticated && (
              <Link
                to="/addclass"
                className="inline-flex items-center justify-center px-4 py-2 bg-violet-500 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-violet-600 transition-colors w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>+ Create Class</span>
              </Link>
            )}
          </div>

          {/* Class Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classes by name, subject, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Class list */}
          {status === "loading" ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center py-8">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading classes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center py-8 px-4">
              <div className="rounded-lg bg-red-50 p-6 sm:p-8 text-center border border-red-200 max-w-md w-full">
                <AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">
                  {typeof error === "string" ? error : error?.message || "Failed to load classes"}
                </p>
              </div>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="flex min-h-[300px] sm:min-h-[400px] items-center justify-center py-8 px-4">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">
                  {searchQuery ? "No classes found" : "No classes yet"}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Create your first class to get started"}
                </p>
                {!searchQuery && isAuthenticated && (
                  <div className="mt-6">
                    <Link
                      to="/addclass"
                      className="inline-flex items-center px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create Class
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <ClassCard key={classItem._id} classItem={classItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;