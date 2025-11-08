import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Base_URL";


axios.defaults.withCredentials = true;

// Fetch students GET /api/students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",

  async (_, { getState , rejectWithValue }) => {
  
    try {
        const token = getState().auth.token; 
      if (!token) throw new Error("No token found");
      const response = await axios.get(`${BASE_URL}/students`, {
        headers: {
       
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);





// Add student POST /api/students
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; 
      if (!token) throw new Error("No token found");

      const response = await axios.post(`${BASE_URL}/students`, studentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);





// GET /api/students/{id}
export const getStudentById = createAsyncThunk(
  "Students/getStudentById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      // Handle backend error messages
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Invalid or missing token");
      }
      if (error.response?.status === 404) {
        return rejectWithValue("Student not found or not owned by teacher");
      }
      return rejectWithValue(
        error.response?.data?.error || "Server error, please try again later"
      );
    }
  }
);



//  PUT /api/students/{id}  
// Update student  
export const updateStudent = createAsyncThunk(
  "Students/updateStudent",
  async ({ id, studentData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");
      const response = await axios.put(`${BASE_URL}/students/${id}`, studentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Delete student DELETE /api/students/{id} 
export const deleteStudent = createAsyncThunk(
  "Students/deleteStudent",
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("No token found");
      await axios.delete(`${BASE_URL}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  students: [],
  selectedStudent: null, 
  status: "idle",
  error: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
extraReducers: (builder) => {
  builder
    // FETCH
    .addCase(fetchStudents.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(fetchStudents.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.students = action.payload;
      state.error = null;
    })
    .addCase(fetchStudents.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    })

    // ADD
    .addCase(addStudent.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(addStudent.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.students.push(action.payload);
      state.error = null;
    })
    .addCase(addStudent.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    })

    // GET BY ID
    .addCase(getStudentById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(getStudentById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedStudent = action.payload;
      state.error = null;
    })
    .addCase(getStudentById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    })

    // UPDATE
    .addCase(updateStudent.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(updateStudent.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.students.findIndex(
        (student) => student._id === action.payload._id
      );
      if (index !== -1) {
        state.students[index] = action.payload;
      }
      state.error = null;
    })
    .addCase(updateStudent.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    })

    // DELETE
    .addCase(deleteStudent.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(deleteStudent.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.students = state.students.filter(
        (student) => student._id !== action.payload
      );
      state.error = null;
    })
    .addCase(deleteStudent.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
   });
  },
});
export default studentSlice.reducer;
