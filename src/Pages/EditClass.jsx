import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getClassById, updateClass } from "../Store/Slices/ClassSlice";
import { classSchema } from "../schemas/classSchema";
import { BookOpen, Save, X, AlertCircle, Users } from "lucide-react";

const EditClassPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentClass, status } = useSelector((state) => state.classes);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getClassById(id));
    }
  }, [id, dispatch]);

  // Check if user is the teacher
  const isAuthor = currentClass && user && String(currentClass.teacherId) === String(user._id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  useEffect(() => {
    if (currentClass) {
      reset({
        name: currentClass.name || "",
        description: currentClass.description || "",
        subject: currentClass.subject || "",
        grade_level: currentClass.gradeLevel || currentClass.grade_level || undefined,
        schedule: currentClass.schedule || "",
        capacity: currentClass.capacity || undefined,
      });
    }
  }, [currentClass, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);

      if (!user) {
        setSubmitError("You are not authenticated!");
        return;
      }

      // Exclude read-only fields
      const { teacherId, _id, createdAt, updatedAt, students, studentCount, ...formData } = data;
      
  
      const classData = {
        name: formData.name.trim(),
        description: formData.description && formData.description.trim() !== "" ? formData.description.trim() : undefined,
        subject: formData.subject && formData.subject.trim() !== "" ? formData.subject.trim() : undefined,
        grade_level: formData.grade_level ? Number(formData.grade_level) : undefined,
        schedule: formData.schedule && formData.schedule.trim() !== "" ? formData.schedule.trim() : undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
      };

      await dispatch(updateClass({ id, classData })).unwrap();
      navigate(`/class/${id}`);
    } catch (error) {
      console.error("Failed to update class:", error);
      const errorMessage = 
        typeof error === 'string' 
          ? error 
          : error?.message || error?.error || "Failed to update class. Please try again.";
      setSubmitError(errorMessage);
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
              <p className="mt-1 text-sm text-gray-500">No class found with this ID</p>
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

  if (!isAuthor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center px-4">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-base font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have permission to edit this class</p>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="mr-3 h-8 w-8 text-violet-500" />
              <h2 className="text-2xl font-bold text-gray-900">Edit Class</h2>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="mr-1 h-4 w-4" />
              <span>{currentClass.studentCount || currentClass.students?.length || 0} students</span>
            </div>
          </div>

          {submitError && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{submitError}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
              <div className="space-y-6">
                {/* Class Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="e.g., 3rd Grade Mathematics"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors resize-none ${
                      errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Provide a brief description of the class (optional)"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register("subject")}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.subject ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="e.g., Mathematics, Science, Reading"
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
                </div>

                {/* Grade Level and Schedule Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Grade Level */}
                  <div>
                    <label htmlFor="grade_level" className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <input
                      type="number"
                      id="grade_level"
                      {...register("grade_level", { valueAsNumber: true })}
                      min="1"
                      max="12"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                        errors.grade_level ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="e.g., 3"
                    />
                    {errors.grade_level && <p className="mt-1 text-sm text-red-600">{errors.grade_level.message}</p>}
                  </div>

                  {/* Schedule */}
                  <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule
                    </label>
                    <input
                      type="text"
                      id="schedule"
                      {...register("schedule")}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                        errors.schedule ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="e.g., Mon/Wed/Fri 10:00 AM"
                    />
                    {errors.schedule && <p className="mt-1 text-sm text-red-600">{errors.schedule.message}</p>}
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    {...register("capacity", { valueAsNumber: true })}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.capacity ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="e.g., 25"
                  />
                  {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/class/${id}`)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

export default EditClassPage;