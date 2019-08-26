/* eslint-disable import/prefer-default-export */
import ApiRoutes from './ApiRoutes';

const api = new ApiRoutes();

const auth = {
  isAuthenticated: false,
};

const userData = {
  username: 'UNNAMED',
  lastHighScore: 0,
};

const buttonMapping = {
  0: 'X',
  1: 'O',
  9: 'PAUSE',
  12: 'UP',
  15: 'RIGHT',
  13: 'DOWN',
  14: 'LEFT',
};

const getHighscores = () => api.getHighscores();

const setHighscore = score => {
  if (score > userData.lastHighScore) {
    updateLastHighScore(score);
  }
  return api.setHighscore({
    username: userData.username,
    score,
  });
};

const getLastHighScore = () => userData.lastHighScore;

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
  getLastHighScore,
  updateLastHighScore,
  buttonMapping,
  getUsername,
  setHighscore,
};
