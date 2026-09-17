// // store/authSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ✅ Load persisted auth state from localStorage
// const getPersistedAuth = () => {
//   try {
//     const stored = localStorage.getItem("authUser");
//     return stored ? JSON.parse(stored) : null;
//   } catch (err) {
//     console.error("Failed to parse authUser from localStorage", err);
//     return null;
//   }
// };

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (response, { rejectWithValue }) => {
//     try {
//       const { token } = response;
//       const userData = {
//         user: response,
//         isAuthenticated: true,
//         token,
//       };

//       localStorage.setItem("authUser", JSON.stringify(userData));
//       return userData;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       localStorage.removeItem("authUser");
//       return null;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// const initialAuth = getPersistedAuth();

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     authUser: initialAuth, // ✅ load persisted user if exists
//     isAuthLoaded: !!initialAuth, // true if we found user in storage
//     progress: 10,
//   },
//   reducers: {
//     setAuthUser: (state, action) => {
//       state.authUser = action.payload;
//       state.isAuthLoaded = true;
//       localStorage.setItem("authUser", JSON.stringify(action.payload));
//     },
//     updateUser: (state, action) => {
//       if (state.authUser) {
//         state.authUser.user = {
//           ...state.authUser.user,
//           ...action.payload,
//         };
//         localStorage.setItem("authUser", JSON.stringify(state.authUser));
//       }
//     },
//     setProgress: (state, action) => {
//       state.progress = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.authUser = action.payload;
//         state.isAuthLoaded = true;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.authUser = null;
//         state.isAuthLoaded = true;
//       });
//   },
// });

// export const { setAuthUser, updateUser, setProgress } = authSlice.actions;
// export default authSlice.reducer;


// store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Get persisted auth state safely (only on client)
const getPersistedAuth = () => {
  if (typeof window === "undefined") return null; // ❌ prevent server access
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to parse authUser from localStorage", err);
    return null;
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (response, { rejectWithValue }) => {
    try {
      const { token } = response;
      const userData = {
        user: response,
        isAuthenticated: true,
        token,
      };

      // ✅ only write on client
      if (typeof window !== "undefined") {
        localStorage.setItem("authUser", JSON.stringify(userData));
      }

      return userData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authUser");
      }
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ initial state
const initialAuth = getPersistedAuth();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: initialAuth,
    isAuthLoaded: !!initialAuth,
    progress: 10,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      state.isAuthLoaded = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("authUser", JSON.stringify(action.payload));
      }
    },
    updateUser: (state, action) => {
      if (state.authUser) {
        state.authUser.user = {
          ...state.authUser.user,
          ...action.payload,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("authUser", JSON.stringify(state.authUser));
        }
      }
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthLoaded = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authUser = null;
        state.isAuthLoaded = true;
      });
  },
});

export const { setAuthUser, updateUser, setProgress } = authSlice.actions;
export default authSlice.reducer;
