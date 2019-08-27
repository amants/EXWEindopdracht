import { create } from 'axios';

let api;

api = create({
  baseURL: `http://samamant.be/exw/api/api.php?do=`,
  timeout: 4000,
});

class ApiRoutes {
  getHighscores = () =>
    api.get('getHighScores').then(response => response.data);

  setHighscore = payload => {
    console.log(payload);
    return api.post('setHighscore', payload).then(response => response.data);
  };
}

export default ApiRoutes;
