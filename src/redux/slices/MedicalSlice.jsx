import { axiosAuth } from "../../config/axios";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import moment from "moment";
import { removeAccents } from "../../constants";

export const GetMedicals = createAsyncThunk(
    "medical/get-medicals",
    async ({username, role},thunkAPI) => {
        try {
            const response = await axiosAuth({
                url: "/medical/get-medical-records",
                method: "get",
            });

            const responseUsers = await axiosAuth({
                url: "/user/get-users",
                method: "get",
            })
            const listBsi = responseUsers.data.data.filter(({role})=> role === 'bs').map((item) => ({label: item?.fullName, value: item.username}))

            console.log(role)
            response.data['role'] = role;
            response.data['username'] = username;
            response.data['listBsi'] = listBsi;
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message: "Có lỗi xảy ra",
            });
        }
    }
);

export const FilterMedicals = createAsyncThunk(
    "medical/filter-medicals",
    async (data, thunkAPI) => {
        try {
            const response = await axiosAuth({
                url: "/medical/search-medical-record",
                method: "post",
                data,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message: "Có lỗi xảy ra",
            });
        }
    }
)

const initialState = {
    medical: [],
    medicalFilter: [],
    medicalTotal: [],
    medicalStatistics: [],
    medicalDeleted: [],
    message: null,
    isLoading: false,
    isSuccess: localStorage.getItem("access_token") !== null,
    isError: false,
};

const MedicalSlice = createSlice({
    name: "medical",
    initialState,
    reducers: {
        handleChangePage: (state) => {
            state.isLoading = true;
            setTimeout(() => {
                state.isLoading = false;
            }, 200)
        },
        filterData: (state, { payload }) => {
            try {
                const curState = current(state);
                const { text_search } = payload;
                const data = curState.medical.filter(item => item.text_search?.includes(text_search))
                state.medicalFilter = data;

            } catch (error) {
                console.log(error);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(GetMedicals.fulfilled, (state, { payload }) => {

            let monthStatistics = [];
            let medicalTotal = {};
            let totalHospital = [];
            let totalPeople = [];
            let totalVisited = 0;
            let totalMedicine = 0

            for (let i = 1; i <= 12; i++) {
                monthStatistics.push(0);
            }

            let listMedicalFilter = payload.data;
            const {listBsi, role} = payload

            if(payload?.role == "bs") {
                listMedicalFilter = listMedicalFilter?.filter((item) => item?.users?.includes(payload?.username));
            }

            let totalRecord = listMedicalFilter.length


            console.log(listBsi)
            listMedicalFilter = listMedicalFilter.map(item => {
                const listUser = item?.users?.split(',');
                console.log(listUser)

                const list = listUser?.map(user => {
                    const result = listBsi.find(bsi => bsi.value === user)
                    return result ? result?.label : ''
                })
                return ({
                    ...item,
                    listUser: list,
                })
            })

            const listMedical = listMedicalFilter.map(record => {
                if (moment(record.updateAt).year() === moment().year() && moment(record.createAt).year() === moment().year()) {
                    const monthIndex = moment(record.createAt).month();
                    monthStatistics[monthIndex] += record.medicalResults.length
                }
                // only not delete
                if (record.status === "1") {
                    if (!totalHospital.includes(record.hospitalName)) {
                        totalHospital.push(record.hospitalName)
                    }
                    if (!totalPeople.includes(record.fullName)) {
                        totalPeople.push(record.fullName)
                    }
                    totalVisited += record.medicalResults.length
                    totalMedicine += +record.medicine_count

                }

                const fullName = record.fullName.toLocaleLowerCase();
                const phone = record.phone.toLocaleLowerCase();
                return { ...record, text_search: `${fullName}${phone}${removeAccents(`${fullName}${phone}`)}` }
            });

            medicalTotal = [
                {
                    "icon": "fa fa-user",
                    "count": totalPeople.length,
                    "title": "Bệnh nhân"
                },
                {
                    "icon": "fa fa-medkit",
                    "count": totalRecord,
                    "title": "Bệnh án"
                },
                {
                    "icon": "fa fa-ambulance",
                    "count": totalVisited,
                    "title": "Lần khám"
                },
                {
                    "icon": "bx bx-file",
                    "count": totalMedicine,
                    "title": "Toa Thuốc"
                }
            ]

            const medical = listMedical.filter(x => x.status === '1');
            state.medical = medical.sort((a, b) => moment(b.updateAt) - moment(a.updateAt));
            state.medicalFilter = medical.sort((a, b) => moment(b.updateAt) - moment(a.updateAt));
            state.medicalDeleted = listMedical.filter(x => x.status === '0');
            state.medicalStatistics = monthStatistics;
            state.medicalTotal = medicalTotal;
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
        });
        builder.addCase(GetMedicals.pending, (state, { payload }) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });
        builder.addCase(GetMedicals.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = payload?.message;
        });
    },
});

export default MedicalSlice.reducer;

export const { handleChangePage, filterData } = MedicalSlice.actions
