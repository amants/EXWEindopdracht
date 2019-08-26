// Dependencies
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useFocus } from 'joystick-react';
import { shape } from 'prop-types';
import styled from 'styled-components';

// Store
import { getHighscores, buttonMapping, getUsername } from '../../store/index';

const Home = ({ history }) => {
  const [highScores, setHighScores] = useState([]);
  useEffect(() => {
    getHighscores().then(res => setHighScores(res.data));
  }, []);
  let rowId = 1;
  const { isFocused, ref } = useFocus(gamepadEvent => {
    if (buttonMapping[gamepadEvent.keyCode] === 'O') {
      history.push('/menu');
    }
  });
  return (
    <Container>
      <TitleContainer>
        <Title>The Game</Title>
        <Username>{getUsername()}</Username>
      </TitleContainer>
      <Table ref={ref}>
        <Thead>
          <tr isfocused={isFocused.toString()}>
            <TH>Place</TH>
            <TH>Username</TH>
            <TH>Score</TH>
          </tr>
        </Thead>
        <Tbody>
          {highScores.map(obj => (
            <tr key={obj.id}>
              <TD>{rowId}</TD>
              <TD>{obj.username}</TD>
              <TD>{obj.score}</TD>
              {(rowId += 1)}
            </tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

const Table = styled.table`
  width: 60rem;
`;

const Thead = styled.thead``;

const Tbody = styled.tbody`
  & > tr:last-child > td:last-child {
    border-radius: 0 0 1rem;
  }

  & > tr:last-child > td:first-child {
    border-radius: 0 0 0 1rem;
  }
`;

const TD = styled.td`
  padding: 1rem;
  background-color: orange;
  font-weight: 700;
  font-size: 1.5rem;
`;

const TH = styled.th`
  background-color: orangered;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1.5rem 3rem;
  text-transform: uppercase;

  &:first-child {
    border-radius: 1rem 0 0;
  }

  &:last-child {
    border-radius: 0 1rem 0 0;
  }
`;

const Container = styled.div`
  background: #151515;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  justify-content: flex-start;
  padding-top: 20rem;
  position: relative;
  cursor: none;
`;

const TitleContainer = styled.div`
  position: absolute;
  top: 4rem;
  text-transform: uppercase;
  flex: 0 0 auto;
  max-width: 80rem;
`;

const Title = styled.h1`
  background: orangered;
  font-weight: 900;
  text-transform: uppercase;
  border-radius: 1rem;
  padding: 2rem 4rem;
  padding-top: 1rem;
  flex: 0 0 auto;
  max-width: 100%;
`;

const Username = styled.h2`
  position: relative;
  top: -1rem;
  font-size: 2rem;
  background-color: orange;
  padding: 1rem 3rem;
  border-radius: 0 0 1rem 1rem;
  display: 0 0 auto;
  flex-grow: 0;
  font-weight: 900;
  flex-shrink: 0;
`;

Home.propTypes = {
  history: shape().isRequired,
};

export default withRouter(Home);
