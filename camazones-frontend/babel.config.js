module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated doit être en DERNIER
      'react-native-reanimated/plugin',
    ],
  };
};
