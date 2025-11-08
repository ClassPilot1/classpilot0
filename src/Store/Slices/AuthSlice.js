import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../Base_URL";
import axios from "axios";

axios.defaults.withCredentials = true;

// ✅ Check auth status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
         
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to fetch user"
      );
    }
  }
);

// ✅ Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Registration failed"
      );
    }
  }
);

// ✅ Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Login failed"
      );
    }
  }
);

// ✅ Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      // Call API to blacklist token (if token exists)
      if (token) {
        try {
          await axios.post(
            `${BASE_URL}/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (apiError) {
          // Continue with logout even if API call fails
          console.warn("Logout API call failed, continuing with local logout:", apiError);
        }
      }
      
      // Remove token locally
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      // Ensure cleanup even if there's an error
      localStorage.removeItem("token");
      return rejectWithValue(error.message || "Logout failed");
    }
  }
); 

// ✅ Initial state
const initialState = {
  isAuthenticated: false, // Will be set to true after checkAuthStatus succeeds
  user: null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

// ✅ Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      // 🔹 checkAuthStatus
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token || state.token || localStorage.getItem("token");
        // Ensure token is in localStorage
        if (state.token) {
          localStorage.setItem("token", state.token);
        }
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || action.error.message;
      })

      // 🔹 registerUser
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || action.error.message;
      })

      // 🔹 loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || action.error.message;
      })

      // 🔹 logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || action.error.message;
      });
  },
});

export default authSlice.reducer;
