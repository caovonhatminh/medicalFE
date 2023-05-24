import { createSlice } from "@reduxjs/toolkit";

const ThemeSlice = createSlice({
    name: "theme",
    initialState: {
        color: "white",
        mode: "dark",
    },
    reducers: {
        setModeTheme: (state, action) => {
            state.mode = action.payload;
        },

        setColorTheme: (state, action) => {
            state.color = action.payload;
        },
    },
});

export const { setModeTheme, setColorTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
