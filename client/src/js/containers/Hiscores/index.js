// Dependencies
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useFocus } from 'joystick-react';
import { shape } from 'prop-types';

// Store
import { getHighscores, buttonMapping } from '../../store/index';

const Home = ({ history }) => {
  const [highScores, setHighScores] = useState([]);
  getHighscores().then(res => setHighScores(res.data));
  let rowId = 1;
  const { isFocused, ref } = useFocus(gamepadEvent => {
    if (buttonMapping[gamepadEvent.keyCode] === 'O') {
      console.log('going back');
      history.push('/menu');
    }
  });
  return (
    <table ref={ref}>
      <thead>
        <tr isfocused={isFocused.toString()}>
          <th>Place</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {highScores.map(obj => (
          <tr key={obj.id}>
            <td>{rowId}</td>
            <td>{obj.username}</td>
            <td>{obj.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Home.propTypes = {
  history: shape().isRequired,
};

export default withRouter(Home);
