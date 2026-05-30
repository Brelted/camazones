import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';

const SETTINGS_STORAGE_KEY = '@camazones/settings';

const initialState = {
  darkMode: false,
  language: 'fr',
  profilePhotoUri: null,
  savedProfile: null,
  changeHistory: [],
  isHydrated: false,
};

const persist = async (settings) => {
  const payload = {
    darkMode: settings.darkMode,
    language: settings.language,
    profilePhotoUri: settings.profilePhotoUri,
    savedProfile: settings.savedProfile,
    changeHistory: settings.changeHistory,
  };
  await storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsRestored: (state, action) => {
      Object.assign(state, action.payload);
      state.isHydrated = true;
    },
    settingsReady: (state) => {
      state.isHydrated = true;
    },
    darkModeChanged: (state, action) => {
      state.darkMode = action.payload;
    },
    languageChanged: (state, action) => {
      state.language = action.payload;
    },
    profilePhotoChanged: (state, action) => {
      state.profilePhotoUri = action.payload;
    },
    profileSaved: (state, action) => {
      state.savedProfile = action.payload;
      state.changeHistory = [
        { id: `${Date.now()}`, label: 'Profil sauvegarde', at: new Date().toISOString() },
        ...state.changeHistory,
      ].slice(0, 8);
    },
  },
});

export const restoreSettings = () => async (dispatch) => {
  try {
    const serialized = await storage.getItem(SETTINGS_STORAGE_KEY);
    if (serialized) {
      dispatch(settingsRestored(JSON.parse(serialized)));
      return;
    }
    dispatch(settingsReady());
  } catch (error) {
    dispatch(settingsReady());
  }
};

export const setDarkModePersisted = (value) => async (dispatch, getState) => {
  dispatch(darkModeChanged(value));
  await persist(getState().settings);
};

export const setLanguagePersisted = (value) => async (dispatch, getState) => {
  dispatch(languageChanged(value));
  await persist(getState().settings);
};

export const setProfilePhotoPersisted = (value) => async (dispatch, getState) => {
  dispatch(profilePhotoChanged(value));
  await persist(getState().settings);
};

export const saveProfilePersisted = (profile) => async (dispatch, getState) => {
  dispatch(profileSaved(profile));
  await persist(getState().settings);
};

export const {
  settingsRestored,
  settingsReady,
  darkModeChanged,
  languageChanged,
  profilePhotoChanged,
  profileSaved,
} = settingsSlice.actions;

export default settingsSlice.reducer;
