import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../Store/Slices/studentSlice";
import { fetchClasses } from "../Store/Slices/ClassSlice";
import { 
  Users, 
  BookOpen, 
  Plus, 
  UserPlus, 
  Calendar,
  ArrowRight,
  User,
  Mail
} from "lucide-react";

function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, status: studentsStatus } = useSelector((state) => state.students);
  const { classes, status: classesStatus } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
  }, [dispatch]);

  const getUserFirstName = () => {
    if (!user || !user.name) return "Teacher";
    const nameParts = user.name.split(" ");
    return nameParts[0];
  };

  // Calculate total students across all classes
  const totalStudents = students.length;
  const totalClasses = classes.length;

  // Get recent students (last 3)
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  // Get recent classes (last 3)
  const recentClasses = [...classes]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  // Get classes with student count
  const classesWithStudents = classes.map((cls) => ({
    ...cls,
    studentCount: cls.students?.length || cls.studentCount || 0,
  }));

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

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-64 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students Card */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-100 text-sm font-medium mb-1">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
                <p className="text-sky-100 text-xs mt-1">Across all classes</p>
              </div>
              <div className="bg-sky-400 bg-opacity-30 rounded-full p-3">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* My Classes Card */}
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium mb-1">My Classes</p>
                <p className="text-3xl font-bold">{totalClasses}</p>
                <p className="text-violet-100 text-xs mt-1">Active classes</p>
              </div>
              <div className="bg-violet-400 bg-opacity-30 rounded-full p-3">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Average Students Per Class */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Avg Students</p>
                <p className="text-3xl font-bold">
                  {totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0}
                </p>
                <p className="text-green-100 text-xs mt-1">Per class</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Total Capacity */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-1">Total Capacity</p>
                <p className="text-3xl font-bold">
                  {classes.reduce((sum, cls) => sum + (cls.capacity || 0), 0)}
                </p>
                <p className="text-amber-100 text-xs mt-1">Across all classes</p>
              </div>
              <div className="bg-amber-400 bg-opacity-30 rounded-full p-3">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/addstudent"
              className="inline-flex items-center px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors shadow-sm"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Student
            </Link>
            <Link
              to="/addclass"
              className="inline-flex items-center px-6 py-3 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors shadow-sm"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Class
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link
                to="/viewstudent"
                className="text-sm text-violet-500 hover:text-violet-600 font-medium flex items-center"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentStudents.length === 0 && recentClasses.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p>
              ) : (
                <>
                  {recentStudents.map((student) => (
                    <div key={student._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="bg-violet-100 rounded-full p-2 flex-shrink-0">
                        <User className="h-4 w-4 text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          New Student Added
                        </p>
                        <p className="text-xs text-gray-600">
                          {student.name} was added
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(student.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {recentClasses.map((classItem) => (
                    <div key={classItem._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="bg-violet-100 rounded-full p-2 flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Class Created
                        </p>
                        <p className="text-xs text-gray-600">
                          {classItem.name} class was created
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(classItem.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Class Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Class Overview</h2>
              <Link
                to="/viewclass"
                className="text-sm text-violet-500 hover:text-violet-600 font-medium flex items-center"
              >
                View All Classes
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {classesWithStudents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No classes yet. Create your first class!
                </p>
              ) : (
                classesWithStudents.slice(0, 3).map((classItem) => (
                  <Link
                    key={classItem._id}
                    to={`/class/${classItem._id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-amber-100 rounded-lg p-2 flex-shrink-0 mr-3">
                        <BookOpen className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                          {classItem.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {classItem.studentCount} {classItem.studentCount === 1 ? "student" : "students"}
                        </p>
                        {classItem.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {classItem.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Students Grid */}
        {recentStudents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Students</h2>
              <Link
                to="/viewstudent"
                className="text-sm text-violet-500 hover:text-violet-600 font-medium flex items-center"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentStudents.map((student) => (
                <div
                  key={student._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {student.name}
                      </h3>
                      {student.email && (
                        <div className="flex items-center mt-1">
                          <Mail className="w-3 h-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-600 truncate">{student.email}</p>
                        </div>
                      )}
                      {student.age && (
                        <p className="text-xs text-gray-600 mt-1">
                          Age: {student.age}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {formatDate(student.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
