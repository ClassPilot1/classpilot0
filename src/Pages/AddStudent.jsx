/**
 * Add Student Page Component / Qaybta Bogga Daraasadda Daraasadda
 * Form for adding a new student with validation
 * Foomka loo daraasadda arday cusub leh xaqiijin
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentSchema, genders } from "../schemas/studentSchema";
import { addStudent } from "../Store/Slices/studentSlice";
import { UserPlus, Save, X, AlertCircle } from "lucide-react";

const AddStudentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Form submission error state / Xaaladda khaladaadka dirida foomka
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  /**
   * Handle form submission / Maamul dirida foomka
   * Adds a new student and navigates to students list
   * Wuxuu daraasaddaa arday cusub oo wuxuu u wadaa liiska ardayda
   */
  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      
      // Email is required by API - schema validation ensures it's present
      // Iimaylku waa lagama maarmaan - xaqiijinta schema waa hubisaa inuu jiro
      // Convert empty strings to undefined for optional fields only
      // U beddel ereyada madhan undefined si loo sameeyo goobaha ikhtiyaari ah
      // Exclude backend-managed fields / Ka reeb goobaha backend-ku maamula
      const { teacherId, createdAt, updatedAt, ...formData } = data;
      const studentData = {
        ...formData,
        // Email is required, so always include it / Iimaylku waa lagama maarmaan, sidaa darteed had iyo jeer ku dar
        email: formData.email.trim(),
        gender: formData.gender === "" ? undefined : formData.gender,
        notes: formData.notes === "" ? undefined : formData.notes,
        parentEmail: formData.parentEmail === "" ? undefined : formData.parentEmail,
        parentPhone: formData.parentPhone === "" ? undefined : formData.parentPhone,
      };
      await dispatch(addStudent(studentData)).unwrap();
      reset(); // Clear form after success / Nadiifi foomka kadib guul
      navigate("/viewstudent");
    } catch (error) {
      setSubmitError(error.message || "Failed to add student. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 lg:ml-64 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center">
            <UserPlus className="mr-3 h-8 w-8 text-violet-500" />
            <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
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
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter student name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter student email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register("age", { valueAsNumber: true })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.age ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter student age"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.gender ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    defaultValue=""
                  >
                    <option value="">Select a gender (optional)</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    {...register("notes")}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.notes ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter notes"
                  />
                  {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
                </div>

                <div>
                  <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    id="parentEmail"
                    {...register("parentEmail")}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.parentEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter parent email"
                  />
                  {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail.message}</p>}
                </div>

                <div>
                  <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    id="parentPhone"
                    {...register("parentPhone")}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-20 focus:border-transparent transition-colors ${
                      errors.parentPhone ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter parent phone"
                  />
                  {errors.parentPhone && <p className="mt-1 text-sm text-red-600">{errors.parentPhone.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/viewstudent")}
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
                {isSubmitting ? "Adding..." : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage;
