import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SmartSchedulerState {
  baseUrl: string;
  apiStatus: {
    data: any;
    statusCode?: number;
    statusText?: string;
  };
  state: {
    isLoading: boolean;
  };
}

const initialState: SmartSchedulerState = {
  baseUrl: "",
  apiStatus: {
    data: null,
  },
  state: {
    isLoading: false,
  },
};

const smartSchedulerSlice = createSlice({
  name: "smartScheduler",
  initialState,
  reducers: {
    toggleGetSmartSchedulerSlotsRequest: (state) => {
      state.state.isLoading = true;
    },
    toggleGetSmartSchedulerSlotsSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.state.isLoading = false;
      state.apiStatus.data = action.payload;
    },
    toggleGetSmartSchedulerSlotsFailure: (
      state,
      action: PayloadAction<{ statusCode?: number; statusText?: string }>
    ) => {
      state.state.isLoading = false;
      state.apiStatus.statusCode = action.payload.statusCode;
      state.apiStatus.statusText = action.payload.statusText;
    },
    clearSmartSchedulerSlots: (state) => {
      state.apiStatus.data = null;
      state.state.isLoading = false;
    },
  },
});

export const {
  toggleGetSmartSchedulerSlotsRequest,
  toggleGetSmartSchedulerSlotsSuccess,
  toggleGetSmartSchedulerSlotsFailure,
  clearSmartSchedulerSlots,
} = smartSchedulerSlice.actions;

export default smartSchedulerSlice.reducer;