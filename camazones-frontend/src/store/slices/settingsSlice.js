import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';

const SETTINGS_STORAGE_KEY = '@camazones/settings';

const initialState = {
  darkMode: false,
  language: 'fr',
  profilesByEmail: {},
  photosByEmail: {},
  historyByEmail: {},
  isHydrated: false,
};

const persist = async (settings) => {
  await storage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      darkMode: settings.darkMode,
      language: settings.language,
      profilesByEmail: settings.profilesByEmail,
      photosByEmail: settings.photosByEmail,
      historyByEmail: settings.historyByEmail,
    })
  );
};

const normalizeRestoredSettings = (payload = {}) => {
  const profilesByEmail = payload.profilesByEmail ?? {};
  const photosByEmail = payload.photosByEmail ?? {};
  const historyByEmail = payload.historyByEmail ?? {};
  const legacyEmail = payload.savedProfile?.email;

  if (legacyEmail && !profilesByEmail[legacyEmail]) {
    profilesByEmail[legacyEmail] = payload.savedProfile;
  }

  if (legacyEmail && payload.profilePhotoUri && !photosByEmail[legacyEmail]) {
    photosByEmail[legacyEmail] = payload.profilePhotoUri;
  }

  if (legacyEmail && payload.changeHistory?.length && !historyByEmail[legacyEmail]) {
    historyByEmail[legacyEmail] = payload.changeHistory;
  }

  return {
    darkMode: Boolean(payload.darkMode),
    language: payload.language === 'en' ? 'en' : 'fr',
    profilesByEmail,
    photosByEmail,
    historyByEmail,
  };
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsRestored: (state, action) => {
      Object.assign(state, normalizeRestoredSettings(action.payload));
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
      const { email, uri } = action.payload;
      if (email) {
        state.photosByEmail[email] = uri;
      }
    },
    profileSaved: (state, action) => {
      const { email, profile } = action.payload;
      if (!email) {
        return;
      }
      state.profilesByEmail[email] = profile;
      state.historyByEmail[email] = [
        { id: `${Date.now()}`, labelKey: 'profileSaved', at: new Date().toISOString() },
        ...(state.historyByEmail[email] ?? []),
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

export const setProfilePhotoPersisted = ({ email, uri }) => async (dispatch, getState) => {
  dispatch(profilePhotoChanged({ email, uri }));
  await persist(getState().settings);
};

export const saveProfilePersisted = ({ email, profile }) => async (dispatch, getState) => {
  dispatch(profileSaved({ email, profile }));
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
