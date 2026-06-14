import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Volunteer } from '../../models/volunteer.model';

interface VolunteerState {
    volunteer: Volunteer | null;
}

const initialState: VolunteerState = {
    volunteer: null
};

const volunteerSlice = createSlice({
    name: 'volunteer',
    initialState,
    reducers: {
        setVolunteer(state, action: PayloadAction<Volunteer>) {
            state.volunteer = action.payload;
        },
        clearVolunteer(state) {
            state.volunteer = null;
        }
    }
});

export const { setVolunteer, clearVolunteer } = volunteerSlice.actions;
export default volunteerSlice.reducer;
