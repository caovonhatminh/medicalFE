import { axiosAuth, axiosNotAuth } from "../../config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const SignInUser = createAsyncThunk(
    "user/signin",
    async (user, thunkAPI) => {
        try {
            const { data } = await axiosNotAuth.post(`/user/login`, user);

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: 401,
                message: "Tài khoản hoặc mật khẩu không đúng",
            });
        }
    }
);

export const SignUpUser = createAsyncThunk(
    "user/signup",
    async (user, thunkAPI) => {
        try {
            const { data } = await axiosNotAuth.post(`/user/register`, user);
            return data;
        } catch (error) {
            console.log(error);
            const mes =
                error.response.data.msg === "user is existed"
                    ? "Tài khoản tồn tại"
                    : "Đăng ký thất bại";
            return thunkAPI.rejectWithValue({
                status: 401,
                message: mes,
            });
        }
    }
);

export const GetUserInfo = createAsyncThunk(
    "user/get-info",
    async (thunkAPI) => {
        try {
            const { data } = await axiosAuth.get("/user/get-user-info");
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message: "Có lỗi xảy ra",
            });
        }
    }
);

const initialState = {
    user: {
        avatar: "",
        display_name: "",
        role: 'yt',
    },
    isDoctor: false,
    access_token: localStorage.getItem("access_token") || "",
    refresh_token: localStorage.getItem("refresh_token") || "",
    message: null,
    isLoading: false,
    isSuccess: localStorage.getItem("access_token") !== null,
    isError: false,
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isSuccess = false;
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            if ('caches' in window) {
                caches.keys().then((names) => {
                    // Delete all the cache files
                    names.forEach(name => {
                        caches.delete(name);
                    })
                });

                // Makes sure the page reloads. Changes are only visible after you refresh.
                window.location.reload(true);
            }
        },
        updateUser: (state, { payload }) => {
            state.user = { ...state.user, payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(SignInUser.fulfilled, (state, { payload }) => {
            state.user = payload.data.user;
            state.isDoctor = payload.data.user.role === 'bs' || payload.data.user.role === 'admin'
            state.access_token = payload.data.access_token;
            state.refresh_token = payload.data.refresh_token;
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = "Đăng nhập thành công";
            localStorage.setItem("access_token", payload.data.access_token);
            localStorage.setItem("refresh_token", payload.data.refresh_token);
        });
        builder.addCase(SignInUser.pending, (state, { payload }) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });
        builder.addCase(SignInUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = "reject";
        });
        builder.addCase(SignUpUser.fulfilled, (state, { payload }) => {
            state.user = payload.user;
            state.isDoctor = payload.user.role === 'bs'
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = "Đăng ký thành công";
        });
        builder.addCase(SignUpUser.pending, (state, { payload }) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });
        builder.addCase(SignUpUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = payload.message;
        });
        builder.addCase(GetUserInfo.pending, (state, { payload }) => {
            state.isLoading = true;
        });

        builder.addCase(GetUserInfo.fulfilled, (state, { payload }) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = payload.data
            state.isDoctor = payload.data?.role === 'bs'
        })

        builder.addCase(GetUserInfo.rejected, (state, { payload }) => {
            state.isLoading = false
            state.isSuccess = false
        })
    },
});

export default UserSlice.reducer;
export const { logout, updateUser } = UserSlice.actions;
