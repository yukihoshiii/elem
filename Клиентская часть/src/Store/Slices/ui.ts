import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    topPanelHidden: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTopPanel: (state) => {
            state.topPanelHidden = !state.topPanelHidden;
        },
        showTopPanel: (state) => {
            state.topPanelHidden = false;
        },
        hideTopPanel: (state) => {
            state.topPanelHidden = true;
        },
    },
});

export const { toggleTopPanel, showTopPanel, hideTopPanel } = uiSlice.actions;
export default uiSlice.reducer;