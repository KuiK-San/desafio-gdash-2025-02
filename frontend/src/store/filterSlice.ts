import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface FilterState {
    startDate: string | null;
    endDate: string | null;
}

const initialState: FilterState = {
    startDate: null,
    endDate: null,
};

export const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setStartDate(state, action: PayloadAction<string | null>) {
            state.startDate = action.payload;
        },
        setEndDate(state, action: PayloadAction<string | null>) {
            state.endDate = action.payload;
        },
    },
});

export const { setStartDate, setEndDate } = filterSlice.actions;
export default filterSlice.reducer;
