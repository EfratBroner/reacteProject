import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HelpRequest } from '../../models/helpRequest.model';

interface RequestsState {
    requests: HelpRequest[];
}

const initialState: RequestsState = {
    requests: []
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        // עדכון כל הרשימה (למשל אחרי שליפה מה-API בטעינת האתר)
        setRequests(state, action: PayloadAction<HelpRequest[]>) {
            state.requests = action.payload;
        },
        // הוספת בקשה חדשה
        addHelpRequest(state, action: PayloadAction<HelpRequest>) {
            state.requests.push(action.payload);
        },
        // עדכון בקשה קיימת בסטור
        updateHelpRequest(state, action: PayloadAction<HelpRequest>) {
            const index = state.requests.findIndex(req => req._id === action.payload._id);
            if (index !== -1) {
                state.requests[index] = action.payload;
            }
        }, 
        
        removeHelpRequest(state, action: PayloadAction<string>) {
            state.requests = state.requests.filter(req => req._id !== action.payload);
        }
    }
});

export const { setRequests, addHelpRequest, updateHelpRequest, removeHelpRequest } = requestsSlice.actions;
export default requestsSlice.reducer;