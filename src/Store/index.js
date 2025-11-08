import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import studentReducer from "./Slices/studentSlice";
import classReducer from "./Slices/ClassSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    classes: classReducer,
  },
});

export default store;
