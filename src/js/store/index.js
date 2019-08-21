/* eslint-disable import/prefer-default-export */
const auth = {
  isAuthenticated: false,
};

const userData = {
  username: null,
  lastHighScore: 0,
};

const setUsername = name => {
  userData.username = name;
};

const updateLastHighScore = score => {
  userData.lastHighScore = score;
};

export { auth, setUsername, updateLastHighScore };
