import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateStudent } from "../Store/Slices/studentSlice";
import { studentSchema, genders } from "../schemas/studentSchema";
import { User, Save, X, AlertCircle } from "lucide-react";

const EditStudentPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.students);
  const [submitError, setSubmitError] = useState(null);

 
  const student = students.find((s) => s._id === id);

  // Check if user is the teacher
  const isAuthor = student && user && String(student.teacherId) === String(user._id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...student,
      teacherId: user?._id,  // Changed from user?.id
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        ...student,
        teacherId: user?._id,  // Changed from user?.id
      });
    }
  }, [student, reset, user]);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      
      const { teacherId, _id, createdAt, updatedAt, ...restData } = data;
      const studentData = {
        ...restData,
        email: data.email === "" ? undefined : data.email,
        gender: data.gender === "" ? undefined : data.gender,
        notes: data.notes === "" ? undefined : data.notes,
        parentEmail: data.parentEmail === "" ? undefined : data.parentEmail,
        parentPhone: data.parentPhone === "" ? undefined : data.parentPhone,
      };
      await dispatch(updateStudent({ id, studentData })).unwrap();
      navigate("/viewstudent");
    } catch (error) {
      console.error("Failed to update student:", error);
      const errorMessage = 
        typeof error === 'string' 
          ? error 
          : error?.message || error?.error || "Failed to update student. Please try again.";
      setSubmitError(errorMessage);
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center px-4">
              <User className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">Student Not Found</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">No student found with this ID</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/viewstudent")}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-violet-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-violet-600 transition-colors"
                >
                  Go back to students
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center px-4">
              <User className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">Unauthorized</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">You cannot edit this student</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/viewstudent")}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-violet-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-violet-600 transition-colors"
                >
                  Go back to students
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 sm:mb-8 flex items-center">
            <User className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-violet-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Student</h2>
          </div>

          {submitError && (
            <div className="mb-4 sm:mb-6 rounded-md bg-red-50 border border-red-200 p-3 sm:p-4">
              <div className="flex">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="ml-2 sm:ml-3">
                  <h3 className="text-xs sm:text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">{submitError}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter student name"
                  />
                  {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter student email"
                  />
                  {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="age" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register("age", { valueAsNumber: true })}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.age ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter student age"
                  />
                  {errors.age && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.age.message}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.gender ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    defaultValue=""
                  >
                    <option value="">Select a gender (optional)</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                  {errors.gender && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.gender.message}</p>}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    {...register("notes")}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.notes ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter notes"
                  />
                  {errors.notes && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.notes.message}</p>}
                </div>

                <div>
                  <label htmlFor="parentEmail" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    id="parentEmail"
                    {...register("parentEmail")}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.parentEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter parent email"
                  />
                  {errors.parentEmail && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.parentEmail.message}</p>}
                </div>

                <div>
                  <label htmlFor="parentPhone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    id="parentPhone"
                    {...register("parentPhone")}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      errors.parentPhone ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter parent phone"
                  />
                  {errors.parentPhone && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.parentPhone.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/viewstudent")}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-violet-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudentPage;
