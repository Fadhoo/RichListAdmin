import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface LayoutState {
  sidebarOpened: boolean;
}

const initialState: LayoutState = {
  sidebarOpened: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpened = action.payload;
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;

export default layoutSlice.reducer;
