import { axiosAuth } from '../../config/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moment from "moment";

export const GetAppointment = createAsyncThunk('appointment/get-appointment', async ({username, role},thunkAPI) => {
    try {
        const response = await axiosAuth({
            url: "/medical/appointment",
            method: "get",
        })
        response.data.username = username;

        const responseUsers = await axiosAuth({
            url: "/user/get-users",
            method: "get",
        })
        const listBsi = responseUsers.data.data.filter(({role})=> role === 'bs').map((item) => ({label: item?.fullName, value: item.username}))

        response.data['role'] = role;
        response.data['username'] = username;
        response.data['listBsi'] = listBsi;
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue({
            message: 'Có lỗi xảy ra'
        })
    }
})

const initialState = {
    appointment: [],
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
};

const AppointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(GetAppointment.fulfilled, (state, { payload }) => {
            let listFilter = payload.data

            if(payload?.role == "bs") {
                listFilter = listFilter?.filter((item) => item?.users?.includes(payload?.username));
            }
            listFilter = listFilter?.filter((item) => item?.status !== "0");
            const {listBsi} = payload

            listFilter = listFilter.map(item => {
                const listUser = item?.users?.split(',');

                const list = listUser?.map(user => {
                    const result = listBsi?.find(bsi => bsi.value === user)
                    return result ? result?.label : ''
                })
                return ({
                    ...item,
                    listUser: list,
                })
            })


            state.appointment =  listFilter.sort((a, b) => moment(a.appointment).diff(moment(b.appointment)));
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
        });
        builder.addCase(GetAppointment.pending, (state, { payload }) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });
        builder.addCase(GetAppointment.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = payload?.message;
        });
    },
});

export default AppointmentSlice.reducer;
