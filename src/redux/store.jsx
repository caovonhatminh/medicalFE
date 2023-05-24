import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/UserSlice";
import ThemeSlice from "./slices/ThemeSlice";
import MedicalSlice from "./slices/MedicalSlice";
import AppointmentSlice from "./slices/AppointmentSlice";

const store = configureStore({
    reducer: {
        theme: ThemeSlice,
        user: UserSlice,
        medical: MedicalSlice,
        appointment: AppointmentSlice,
    },
});

export default store;