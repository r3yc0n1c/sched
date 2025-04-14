import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  instantMeeting: null,
  scheduledMeetings: [],
};

export const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setInstantMeeting: (state, action) => {
      state.instantMeeting = action.payload;
    },
    setScheduledMeeting: (state, action) => {
      state.scheduledMeetings.push(action.payload);
    },
    clearInstantMeeting: (state) => {
      state.instantMeeting = null;
    },
    clearScheduledMeeting: (state, action) => {
      state.scheduledMeetings = state.scheduledMeetings.filter(
        meeting => meeting.link !== action.payload
      );
    },
  },
});

export const {
  setInstantMeeting,
  setScheduledMeeting,
  clearInstantMeeting,
  clearScheduledMeeting,
} = meetingsSlice.actions;

export default meetingsSlice.reducer; 