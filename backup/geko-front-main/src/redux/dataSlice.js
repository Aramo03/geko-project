// src/redux/dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../utils/utils';
import axios from 'axios';
import i18n from '../i18n';

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        courses: [],
        events: [],
        categories: [],
        reviews: [],
        lessonInfo: [],
        teams: [],
        loading: false,
        error: null,
    },
    reducers: {
        setCategories(state, action) {
            state.categories = action.payload;
        },
        setCourses(state, action) {
            state.courses = action.payload;
        },
        setEvents(state, action) {
            state.events = action.payload;
        },
        setReviews(state, action) {
            state.reviews = action.payload;
        },
        setLessonInfo(state, action) {
            state.lessonInfo = action.payload;
        },
        setTeams(state, action) {
            state.teams = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setSingleCourse(state, action) {
            const index = state.courses.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            } else {
                state.courses.push(action.payload);
            }
        },
        setSingleEvent(state, action) {
            const index = state.events.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = action.payload;
            } else {
                state.events.push(action.payload);
            }
        },
        setSingleCategory(state, action) {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            } else {
                state.categories.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLessonInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessonInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.lessonInfo = action.payload;
            })
            .addCase(fetchLessonInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = [action.payload];
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.events = [action.payload];
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = [action.payload];
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const {
    setCategories,
    setCourses,
    setEvents,
    setReviews,
    setLessonInfo,
    setTeams,
    setLoading,
    setError,
    setSingleCourse,
    setSingleEvent,
    setSingleCategory,
} = dataSlice.actions;

// Thunks
export const fetchCategories = createAsyncThunk(
    'data/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/categories/?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourses = createAsyncThunk(
    'data/fetchCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/popular_courses/?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEvents = createAsyncThunk(
    'data/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/events/?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchReviews = createAsyncThunk(
    'data/fetchReviews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/reviews/?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLessonInfo = createAsyncThunk(
    'data/fetchLessonInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/lesson_info/?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTeams = createAsyncThunk(
    'data/fetchTeams',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/teams/?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'data/fetchCourseById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/popular_courses/${id}?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEventById = createAsyncThunk(
    'data/fetchEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/events/${id}?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'data/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/categories/${id}?language=${i18n.language}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export default dataSlice.reducer;