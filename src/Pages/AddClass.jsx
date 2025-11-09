/**
 * Add Class Page Component / Qaybta Bogga Daraasadda Daraasadda
 * Form for creating a new class with validation
 * Foomka loo abuuro daraasad cusub leh xaqiijin
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createClass } from "../Store/Slices/ClassSlice";
import { classSchema } from "../schemas/classSchema";
import { BookOpen, AlertCircle, X, Save } from "lucide-react";

function AddClassPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Form submission error state / Xaaladda khaladaadka dirida foomka
  const [submitError, setSubmitError] = useState(null);

  /**
   * React Hook Form setup with Zod validation
   * Dhisista React Hook Form leh xaqiijinta Zod
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  /**
   * Handle form submission / Maamul dirida foomka
   * Creates a new class and navigates to classes list
   * Wuxuu abuuraa daraasad cusub oo wuxuu u wadaa liiska daraasyada
   */
  const onSubmit = async (data) => {
    try {
      setSubmitError(null);

      // Check if user is authenticated / Hubi haddii isticmaaluhu xaqiijiyey
      if (!user) {
        setSubmitError("You are not authenticated!");
        return;
      }

      // Exclude backend-managed fields / Ka reeb goobaha backend-ku maamula
      // teacherId, _id, createdAt, updatedAt, students, studentCount - these are set by the backend
      const { teacherId, _id, createdAt, updatedAt, students, studentCount, ...formData } = data;
      
      // Convert empty strings to undefined for optional fields
      // U beddel ereyada madhan undefined si loo sameeyo goobaha ikhtiyaari ah
      const classData = {
        name: formData.name.trim(),
        description: formData.description && formData.description.trim() !== "" ? formData.description.trim() : undefined,
        subject: formData.subject && formData.subject.trim() !== "" ? formData.subject.trim() : undefined,
        grade_level: formData.grade_level ? Number(formData.grade_level) : undefined,
        schedule: formData.schedule && formData.schedule.trim() !== "" ? formData.schedule.trim() : undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
      };

      await dispatch(createClass(classData)).unwrap();
      reset(); // Clear form after success / Nadiifi foomka kadib guul
      navigate("/viewclass");
    } catch (error) {
      const errorMessage = 
        typeof error === 'string' 
          ? error 
          : error?.message || error?.error || "Failed to create class. Please try again.";
      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-violet-500" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Class</h2>
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors border-gray-300 resize-none ${
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
                onClick={() => navigate("/viewclass")}
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
                {isSubmitting ? "Creating..." : "Create Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddClassPage;