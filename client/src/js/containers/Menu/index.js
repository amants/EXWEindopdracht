import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useFocus } from 'joystick-react';
import { withRouter } from 'react-router-dom';
import { shape } from 'prop-types';

import { buttonMapping, getUsername } from '../../store/index';
const Menu = ({ history }) => {
  const [focusedButton, setFocusedButton] = useState(1);

  useEffect(() => console.log(focusedButton, ' focusedButton'), [
    focusedButton,
  ]);

  let focusedFieldNoState = focusedButton;

  const { isFocused, ref } = useFocus(gamepadEvent => {
    console.log(gamepadEvent.keyCode);
    const tempFieldFocus = focusedFieldNoState;
    const buttonss = [
      document.querySelector(`.start_game`),
      document.querySelector(`.highscores`),
      document.querySelector(`.namechange`),
      document.querySelector(`.quitbutton`),
    ];

    if (buttonMapping[gamepadEvent.keyCode] === 'X') {
      console.log(buttonss);
      console.log(document.querySelector('.start_game'));
      buttonss[tempFieldFocus - 1].click();
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'O') {
      console.log('going back');
      history.push('/');
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'UP') {
      Object.keys(buttonss).map((key, i) => {
        console.log(key, i);
      });
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'DOWN') {
      buttonss.map((key, i) => {
        console.log(i, focusedButton);
        if (i === focusedButton) {
          console.log(focusedFieldNoState, buttonss.length);
          if (focusedFieldNoState === buttonss.length) {
            focusedFieldNoState = 1;
            setFocusedButton(1);
          } else {
            focusedFieldNoState = tempFieldFocus + 1;
            setFocusedButton(
              prevFocusedButton => parseInt(prevFocusedButton) + 1,
            );
          }
        }
      });
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'UP') {
      buttonss.map((key, i) => {
        console.log(i, focusedButton);
        if (i === focusedButton) {
          console.log(focusedFieldNoState, buttonss.length);
          if (focusedFieldNoState <= 1) {
            focusedFieldNoState = buttonss.length;
            setFocusedButton(buttonss.length);
          } else {
            focusedFieldNoState = tempFieldFocus - 1;
            setFocusedButton(
              prevFocusedButton => parseInt(prevFocusedButton) - 1,
            );
          }
        }
      });
    }
  });
  console.log(isFocused);

  return (
    <Container>
      <TitleContainer>
        <Title>The Game</Title>
        <Username>{getUsername()}</Username>
      </TitleContainer>
      <ButtonContainer ref={ref}>
        <Button
          className={`${focusedButton === 1 ? `focused` : ``} start_game`}
          to="/game"
        >
          Start game
        </Button>
        <Button
          className={`${focusedButton === 2 ? `focused` : ``} highscores`}
          to="/highscores"
        >
          highscores
        </Button>
        <Button
          className={`${focusedButton === 3 ? `focused` : ``} namechange`}
          to="/namechange"
        >
          Change name
        </Button>
        <Button
          className={`${focusedButton === 4 ? `focused` : ``} quitbutton`}
          to="/"
        >
          Quit
        </Button>
      </ButtonContainer>
    </Container>
  );
};

Menu.propTypes = {
  history: shape().isRequired,
};

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

const ButtonContainer = styled.div``;

const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
  font-size: 3rem;
  border-radius: 1rem;
  margin: 2rem;
  text-transform: uppercase;
  text-decoration: none;
  color: white;
  font-weight: 900;
  width: 40rem;
  background-color: orangered;
  transition: all 0.2s ease;
  cursor: none;

  &.focused {
    border: 0.5rem solid orange;
    transform: scale(1.1);
  }
`;

const Container = styled.div`
  background: #151515;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  justify-content: center;
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

export default withRouter(Menu);
