/* eslint-disable import/prefer-default-export */
import ApiRoutes from './ApiRoutes';

const api = new ApiRoutes();

const auth = {
  isAuthenticated: false,
};

const userData = {
  username: null,
  lastHighScore: 0,
};

const buttonMapping = {
  0: 'X',
  1: 'O',
  12: 'UP',
  15: 'RIGHT',
  13: 'DOWN',
  14: 'LEFT',
};

const getHighscores = () => api.getHighscores();

const getUsername = () => userData.username;

const setUsernameStore = name => {
  userData.username = name;
  auth.isAuthenticated = true;
};

const updateLastHighScore = score => {
  userData.lastHighScore = score;
};

export {
  auth,
  getHighscores,
  setUsernameStore,
  updateLastHighScore,
  buttonMapping,
  getUsername,
};
