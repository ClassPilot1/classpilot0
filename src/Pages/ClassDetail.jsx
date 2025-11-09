import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClassById,
  enrollStudents,
  removeStudentFromClass,
  fetchClasses,
} from "../Store/Slices/ClassSlice";
import { fetchStudents } from "../Store/Slices/studentSlice";
import {
  BookOpen,
  Users,
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  Calendar,
  Mail,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";

const ClassDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentClass, status, error } = useSelector((state) => state.classes);
  const { students } = useSelector((state) => state.students);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getClassById(id));
      dispatch(fetchStudents());
    }
  }, [id, dispatch]);

  // Get enrolled student IDs
  const enrolledStudentIds = useMemo(() => {
    if (!currentClass?.students) return [];
    return currentClass.students.map((s) => String(s._id));
  }, [currentClass?.students]);

  // Filter available students (not enrolled, owned by teacher)
  const availableStudents = useMemo(() => {
    if (!students || !user) return [];
    const normalizedUserId = String(user._id);
    return students.filter((student) => {
      const normalizedStudentId = String(student._id);
      const normalizedStudentTeacherId = String(student.teacherId);
      const isOwned = normalizedStudentTeacherId === normalizedUserId;
      const isNotEnrolled = !enrolledStudentIds.includes(normalizedStudentId);
      return isOwned && isNotEnrolled;
    });
  }, [students, user, enrolledStudentIds]);

  // Filter students by search query
  const filteredAvailableStudents = useMemo(() => {
    if (!searchQuery) return availableStudents;
    const query = searchQuery.toLowerCase();
    return availableStudents.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
    );
  }, [availableStudents, searchQuery]);

  const handleEnrollStudents = async () => {
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student to enroll.");
      return;
    }

    if (!user || !currentClass) {
      alert("Please refresh the page and try again.");
      return;
    }

    // Verify class ownership
    if (String(currentClass.teacherId) !== String(user._id)) {
      alert("You don't have permission to enroll students in this class.");
      return;
    }

    try {
      setIsEnrolling(true);

      // Get fresh data from backend before validation
      const [latestClassData, freshStudentsData] = await Promise.all([
        dispatch(getClassById(id)).unwrap(),
        dispatch(fetchStudents()).unwrap(),
      ]);

      const freshStudents = Array.isArray(freshStudentsData) ? freshStudentsData : [];
      const latestEnrolledIds = latestClassData?.students?.map((s) => String(s._id)) || [];

      // Normalize user ID for comparison
      const normalizedUserId = String(user._id);

      // Validate students: must be owned by teacher and not already enrolled
      const validStudentIds = selectedStudentIds.filter((studentId) => {
        const normalizedStudentId = String(studentId);
        const student = freshStudents.find((s) => String(s._id) === normalizedStudentId);

        if (!student) {
          return false;
        }

        const normalizedStudentTeacherId = String(student.teacherId);
        const isOwned = normalizedStudentTeacherId === normalizedUserId;
        const isNotEnrolled = !latestEnrolledIds.includes(normalizedStudentId);

        return isOwned && isNotEnrolled;
      });

      if (validStudentIds.length === 0) {
        alert("No valid students to enroll. All selected students either don't belong to you or are already enrolled.");
        setIsEnrolling(false);
        return;
      }

      if (validStudentIds.length !== selectedStudentIds.length) {
        const removedCount = selectedStudentIds.length - validStudentIds.length;
        const proceed = window.confirm(
          `${removedCount} student(s) were removed. Continue with ${validStudentIds.length} student(s)?`
        );
        if (!proceed) {
          setIsEnrolling(false);
          return;
        }
      }

      // Verify class ownership with latest data
      const normalizedClassTeacherId = String(latestClassData.teacherId);
      if (normalizedClassTeacherId !== normalizedUserId) {
        alert("You don't have permission to enroll students in this class.");
        setIsEnrolling(false);
        return;
      }

      // Double-check: Ensure all student IDs are strings and verify ownership one more time
      // Dhiban: Hubi in dhammaan ID-yada ardayda ay yihiin strings oo mar kale hubi milkiyadda
      const finalStudentIds = validStudentIds.map(id => String(id)).filter(studentId => {
        const student = freshStudents.find((s) => String(s._id) === studentId);
        if (!student) {
          return false;
        }
        const studentTeacherId = String(student.teacherId);
        return studentTeacherId === normalizedUserId;
      });

      if (finalStudentIds.length === 0) {
        alert("No valid students to enroll after final validation.");
        setIsEnrolling(false);
        return;
      }

      // Final check: Verify all student IDs are valid and match the exact format from database
      // Hubinta ugu dambeysa: Hubi in dhammaan ID-yada ardayda ay yihiin sax oo ay u qaataan qaabka database-ka
      const verifiedStudentIds = finalStudentIds.filter(studentId => {
        const student = freshStudents.find((s) => {
          return String(s._id) === String(studentId) || s._id === studentId;
        });
        
        if (!student) {
          return false;
        }
        
        const studentTeacherId = String(student.teacherId);
        const userTeacherId = String(normalizedUserId);
        return studentTeacherId === userTeacherId;
      });
      
      if (verifiedStudentIds.length === 0) {
        alert("No valid students to enroll after final verification. Please refresh and try again.");
        setIsEnrolling(false);
        return;
      }
      
      if (verifiedStudentIds.length !== finalStudentIds.length) {
        const proceed = window.confirm(
          `${finalStudentIds.length - verifiedStudentIds.length} student(s) failed verification. Continue with ${verifiedStudentIds.length} student(s)?`
        );
        if (!proceed) {
          setIsEnrolling(false);
          return;
        }
      }

      // Enroll students with verified IDs / Daraasadd ardayda leh ID-yo la xaqiijiyey
      await dispatch(enrollStudents({ classId: id, studentIds: verifiedStudentIds })).unwrap();

      // Refresh class data
      await dispatch(getClassById(id));

      // Refresh the classes list so viewClass shows updated count
      await dispatch(fetchClasses());

      // Reset modal state
      setSelectedStudentIds([]);
      setSearchQuery("");
      setShowAddModal(false);

      alert("Students enrolled successfully!");
    } catch (error) {
      // Handle both string errors and object errors from Redux
      // Maamul khaladaadka string iyo object-ka ka yimaada Redux
      let errorMessage = "Failed to enroll students.";
      let backendDetails = null;

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.backendMessage) {
        errorMessage = error.backendMessage;
        backendDetails = error.data;
      } else if (error?.message) {
        errorMessage = error.message;
        backendDetails = error.data;
      } else if (error?.response?.data) {
        const backendError = error.response.data;
        if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.error) {
          errorMessage = backendError.error;
        }
        backendDetails = backendError;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      // Extract the actual error from the server error message
      let userFriendlyMessage = String(errorMessage || "Failed to enroll students");

      if (userFriendlyMessage && typeof userFriendlyMessage === "string") {
        // The backend message format is: "[Request ID: ...] Server Error\nUncaught Error: ..."
        // Try to extract the actual error message
        if (userFriendlyMessage.includes("Uncaught Error")) {
          const errorMatch = userFriendlyMessage.match(/Uncaught Error:\s*(.+?)(?:\n|$)/);
          if (errorMatch && errorMatch[1]) {
            userFriendlyMessage = errorMatch[1].trim();
          }
        } else if (userFriendlyMessage.includes("Server Error")) {
          const errorMatch = userFriendlyMessage.match(/Server Error[\\n\s]+(.*?)(?:\n|$)/);
          if (errorMatch && errorMatch[1]) {
            userFriendlyMessage = errorMatch[1].trim();
          }
        }
      }

      alert(`Error: ${userFriendlyMessage}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this class?`)) {
      return;
    }

    try {
      const normalizedStudentId = String(studentId);

      // Remove student from class
      await dispatch(removeStudentFromClass({ classId: id, studentId: normalizedStudentId })).unwrap();

      // Refresh class data to get the latest state from backend
      await dispatch(getClassById(id));

      // Refresh classes list for the class list view
      await dispatch(fetchClasses());

      // Clear selected students if the removed student was selected
      setSelectedStudentIds((prev) => prev.filter((id) => String(id) !== normalizedStudentId));
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || error?.error || "Failed to remove student.";
      alert(`Error: ${errorMessage}`);
    }
  };

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

  if (status === "loading" && !currentClass) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading class...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center px-4">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-base font-medium text-gray-900">Class Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {typeof error === "string" ? error : error?.message || "No class found with this ID"}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/viewclass")}
                  className="px-6 py-2 bg-violet-500 text-white rounded-lg text-base font-medium hover:bg-violet-600 transition-colors"
                >
                  Go back to classes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const studentCount = currentClass.studentCount ?? currentClass.students?.length ?? 0;
  const capacity = currentClass.capacity || "Unlimited";
  const isAtCapacity = currentClass.capacity && studentCount >= currentClass.capacity;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/viewclass"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Classes
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="bg-violet-100 rounded-lg p-3">
                <BookOpen className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentClass.name}</h1>
                {currentClass.subject && (
                  <p className="text-sm text-gray-600">{currentClass.subject}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/editclass/${id}`}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>

        {/* Class Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-base text-gray-900">
                {currentClass.description || "No description"}
              </p>
            </div>
            {currentClass.gradeLevel && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Grade Level</p>
                <p className="text-base text-gray-900">{currentClass.gradeLevel}</p>
              </div>
            )}
            {currentClass.schedule && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Schedule</p>
                <div className="flex items-center text-base text-gray-900">
                  <Clock className="mr-2 h-4 w-4" />
                  {currentClass.schedule}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Capacity</p>
              <div className="flex items-center text-base text-gray-900">
                <Users className="mr-2 h-4 w-4" />
                {studentCount} / {capacity}
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
              <p className="text-sm text-gray-600 mt-1">
                {studentCount} {studentCount === 1 ? "student" : "students"} enrolled
              </p>
            </div>
            {!isAtCapacity && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Students
              </button>
            )}
            {isAtCapacity && (
              <div className="text-sm text-amber-600 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                Class at capacity
              </div>
            )}
          </div>

          {/* Students List */}
          {currentClass.students && currentClass.students.length > 0 ? (
            <div className="space-y-3">
              {currentClass.students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-violet-100 rounded-full p-2">
                      <User className="h-5 w-5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {student.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        {student.email && (
                          <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            <span className="truncate">{student.email}</span>
                          </div>
                        )}
                        {student.age && <span>Age: {student.age}</span>}
                        {student.enrolledAt && (
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>Enrolled {formatDate(student.enrolledAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(student._id, student.name)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                    title="Remove student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-base font-medium text-gray-900">No students enrolled</h3>
              <p className="mt-2 text-sm text-gray-600">Add students to get started</p>
              {!isAtCapacity && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Students
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add Students Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Students to Class</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedStudentIds([]);
                    setSearchQuery("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Students List */}
                {filteredAvailableStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-base font-medium text-gray-900">
                      {searchQuery ? "No students found" : "No available students"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "All your students are already enrolled in this class"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAvailableStudents.map((student) => (
                      <label
                        key={student._id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(String(student._id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, String(student._id)]);
                            } else {
                              setSelectedStudentIds(
                                selectedStudentIds.filter((id) => id !== String(student._id))
                              );
                            }
                          }}
                          className="mr-3 h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          {student.email && (
                            <p className="text-xs text-gray-600 truncate">{student.email}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedStudentIds([]);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollStudents}
                  disabled={selectedStudentIds.length === 0 || isEnrolling}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnrolling ? "Enrolling..." : `Enroll ${selectedStudentIds.length} Student${selectedStudentIds.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetail;