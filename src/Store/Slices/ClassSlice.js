import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Base_URL";

axios.defaults.withCredentials = true;

// --------------------
// FETCH CLASSES
// GET /api/classes
export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${BASE_URL}/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
// CREATE CLASS
// POST /api/classes
export const createClass = createAsyncThunk(
  "classes/createClass",
  async (classData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      const response = await axios.post(`${BASE_URL}/classes`, classData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
// GET CLASS BY ID
// GET /api/classes/{id}
export const getClassById = createAsyncThunk(
  "classes/getClassById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${BASE_URL}/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          _t: Date.now()
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
// UPDATE CLASS
// PUT /api/classes/{id}
export const updateClass = createAsyncThunk(
  "classes/updateClass",
  async ({ id, classData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      const response = await axios.put(`${BASE_URL}/classes/${id}`, classData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
// DELETE CLASS
// DELETE /api/classes/{id}
export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      await axios.delete(`${BASE_URL}/classes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
// ENROLL STUDENTS IN CLASS
// POST /api/classes/{id}/students
export const enrollStudents = createAsyncThunk(
  "classes/enrollStudents",
  async ({ classId, studentIds }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const user = getState().auth.user;
      if (!token) throw new Error("No token found");
      if (!user) throw new Error("User not authenticated");

      // Ensure all student IDs are strings (API requirement)
      const normalizedStudentIds = studentIds.map(id => String(id)).filter(id => id && id !== "undefined" && id !== "null");

      if (normalizedStudentIds.length === 0) {
        throw new Error("No valid student IDs provided");
      }

      const requestBody = { student_ids: normalizedStudentIds };

      const response = await axios.post(
        `${BASE_URL}/classes/${classId}/students`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return { classId, data: response.data };
    } catch (error) {
      // Return serializable error object
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to enroll students";
      
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        backendMessage: error.response?.data?.message,
        backendError: error.response?.data?.error,
      });
    }
  }
);

// --------------------
// REMOVE STUDENT FROM CLASS
// DELETE /api/classes/{id}/students/{studentId}
export const removeStudentFromClass = createAsyncThunk(
  "classes/removeStudentFromClass",
  async ({ classId, studentId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      await axios.delete(
        `${BASE_URL}/classes/${classId}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { classId, studentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
// FETCH CLASS STUDENTS
// GET /api/classes/{id}/students
export const fetchClassStudents = createAsyncThunk(
  "classes/fetchClassStudents",
  async (classId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${BASE_URL}/classes/${classId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { classId, students: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// --------------------
const initialState = {
  classes: [],
  items: [], // Keep for backward compatibility
  currentClass: null,
  status: "idle",
  error: null,
};

const classSlice = createSlice({
  name: "classes",
  initialState,
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchClasses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Calculate studentCount from students array if not provided by API
        // Xisaabi studentCount array-ga ardayda haddii API aysan bixin
        // Note: GET /api/classes might not return students array or studentCount
        // Xusuus: GET /api/classes ma bixi karo array-ga ardayda ama studentCount
        state.classes = action.payload.map((cls) => {
          // Check if API returned studentCount (even if not documented)
          // Hubi haddii API-ku bixiyey studentCount (haddii aan loo qorayn)
          const apiStudentCount = cls.studentCount;
          const studentsArray = cls.students || [];
          
          // Use studentCount from API if available, otherwise calculate from students array
          // Isticmaal studentCount API-ka haddii ay jirto, haddii kale xisaabi array-ga ardayda
          const studentCount = apiStudentCount !== undefined && apiStudentCount !== null
            ? apiStudentCount
            : (studentsArray.length > 0 ? studentsArray.length : 0);
          
          return {
            ...cls,
            students: studentsArray,
            studentCount: studentCount,
          };
        });
        state.items = state.classes;
        state.error = null;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      })

      // CREATE
      .addCase(createClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classes.push(action.payload);
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      })

      // GET BY ID
      .addCase(getClassById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        
        // Calculate studentCount from students array if not provided
        // Xisaabi studentCount array-ga ardayda haddii aan la bixin
        const studentsArray = payload.students || [];
        const studentCount = payload.studentCount !== undefined && payload.studentCount !== null
          ? payload.studentCount
          : studentsArray.length;
        
        state.currentClass = {
          ...payload,
          students: studentsArray,
          studentCount: studentCount,
        };
        
        // Update in classes list to keep it in sync
        // Cusbooneysii liiska daraasyada si loo wada socdo
        const index = state.classes.findIndex(
          (cls) => String(cls._id) === String(payload._id)
        );
        if (index !== -1) {
          state.classes[index] = {
            ...state.classes[index],
            ...payload,
            students: studentsArray,
            studentCount: studentCount,
          };
          state.items[index] = state.classes[index];
        }
        state.error = null;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      })

      // UPDATE
      .addCase(updateClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.classes.findIndex(
          (cls) => String(cls._id) === String(action.payload._id)
        );
        if (index !== -1) {
          state.classes[index] = action.payload;
          state.items[index] = action.payload;
        }
        if (
          state.currentClass &&
          String(state.currentClass._id) === String(action.payload._id)
        ) {
          state.currentClass = action.payload;
        }
        state.error = null;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      })

      // DELETE
      .addCase(deleteClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classes = state.classes.filter((cls) => String(cls._id) !== String(action.payload));
        state.items = state.items.filter((cls) => String(cls._id) !== String(action.payload));
        if (state.currentClass && String(state.currentClass._id) === String(action.payload)) {
          state.currentClass = null;
        }
        state.error = null;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      })

      // ENROLL STUDENTS
      .addCase(enrollStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(enrollStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        
        // Update student count in classes list after enrollment
        // Cusbooneysii tiro ardayda liiska daraasyada kadib daraasadda
        // Note: getClassById and fetchClasses are called after enrollment to refresh data
        // Xusuus: getClassById iyo fetchClasses waxaa la wacayaa kadib daraasadda si loo cusbooneysiiyo xogta
        const { classId, data } = action.payload;
        const normalizedClassId = String(classId);
        
        // Try to get updated class data from response
        // Isku day inaad hesho xogta daraasad cusub ee jawaabta
        const updatedClass = data?.class || data;
        
        const clsIndex = state.classes.findIndex(
          (cls) => String(cls._id) === normalizedClassId
        );
        if (clsIndex !== -1 && updatedClass) {
          // Use updated class data from API if available
          // Isticmaal xogta daraasad cusub ee API-ka haddii ay jirto
          const studentsArray = updatedClass.students || [];
          const studentCount = updatedClass.studentCount !== undefined && updatedClass.studentCount !== null
            ? updatedClass.studentCount
            : studentsArray.length;
          
          state.classes[clsIndex] = {
            ...state.classes[clsIndex],
            ...updatedClass,
            studentCount: studentCount,
            students: studentsArray,
          };
          state.items[clsIndex] = state.classes[clsIndex];
        }
        
        // Update currentClass if it matches
        if (state.currentClass && String(state.currentClass._id) === normalizedClassId && updatedClass) {
          const studentsArray = updatedClass.students || [];
          const studentCount = updatedClass.studentCount !== undefined && updatedClass.studentCount !== null
            ? updatedClass.studentCount
            : studentsArray.length;
          
          state.currentClass = {
            ...state.currentClass,
            ...updatedClass,
            studentCount: studentCount,
            students: studentsArray,
          };
        }
      })
      .addCase(enrollStudents.rejected, (state, action) => {
        state.status = "failed";
        // Ensure we only store strings, not objects
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (action.payload?.message) {
          state.error = action.payload.message;
        } else if (action.payload?.backendMessage) {
          state.error = action.payload.backendMessage;
        } else if (action.error?.message) {
          state.error = action.error.message;
        } else {
          state.error = "Failed to enroll students";
        }
      })

      // REMOVE STUDENT FROM CLASS
      .addCase(removeStudentFromClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        
        const { classId, studentId } = action.payload;
        const normalizedClassId = String(classId);
        const normalizedStudentId = String(studentId);
        
      
        if (
          state.currentClass &&
          String(state.currentClass._id) === normalizedClassId
        ) {
          const updatedStudents = (state.currentClass.students || []).filter(
            (s) => String(s._id) !== normalizedStudentId
          );
          
          state.currentClass = {
            ...state.currentClass,
            students: updatedStudents,
            studentCount: updatedStudents.length,
          };
        }
        
        // Update in classes list - create new object reference
        const clsIndex = state.classes.findIndex(
          (cls) => String(cls._id) === normalizedClassId
        );
        if (clsIndex !== -1) {
          const updatedStudents = (state.classes[clsIndex].students || []).filter(
            (s) => String(s._id) !== normalizedStudentId
          );
          
          state.classes[clsIndex] = {
            ...state.classes[clsIndex],
            students: updatedStudents,
            studentCount: updatedStudents.length,
          };
          state.items[clsIndex] = state.classes[clsIndex];
        }
      })
      .addCase(removeStudentFromClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      })

      // FETCH CLASS STUDENTS
      .addCase(fetchClassStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (
          state.currentClass &&
          String(state.currentClass._id) === String(action.payload.classId)
        ) {
          state.currentClass.students = action.payload.students;
          state.currentClass.studentCount = action.payload.students.length;
        }
        state.error = null;
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : action.error.message;
      });
  },
});

export default classSlice.reducer;