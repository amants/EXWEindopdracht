/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFocus } from 'joystick-react';
import InputField from '../../components/InputField';
import { withRouter } from 'react-router';
import { shape } from 'prop-types';

import {
  buttonMapping,
  setUsernameStore,
  getUsername,
} from '../../store/index';
const Home = ({ history }) => {
  const storeUsername = getUsername();
  const [oldUsername, setOldUsername] = useState(storeUsername);
  const [username, setUsername] = useState(
    storeUsername !== 'UNNAMED'
      ? storeUsername.split('')
      : [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  );
  let usernameNoState = [...username];
  const [focusedObject, setFocusedObject] = useState(0);
  let focusedFieldNoState = focusedObject;

  useEffect(() => {
    if (username.length < 8) {
      const tempUsername = [...username];
      tempUsername.push(' ');
      setUsername(tempUsername);
      usernameNoState = tempUsername;
      console.log(tempUsername);
    }
    let joinedName = username.join('').trim();
    console.log(joinedName);
    if (joinedName.length > 0) {
      setUsernameStore(joinedName);
    } else {
      setUsernameStore('UNNAMED');
    }
  }, [username]);

  const { isFocused, ref } = useFocus(gamepadEvent => {
    console.log(usernameNoState);
    const tempdata = [...usernameNoState];
    const tempFieldFocus = focusedFieldNoState;
    while (tempdata.length < 8) {
      tempdata.push(' ');
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'X') {
      history.push('/menu');
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'O') {
      setUsernameStore(oldUsername);
      history.push('/menu');
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'RIGHT') {
      console.log(tempFieldFocus);
      if (tempFieldFocus < 7) {
        focusedFieldNoState = tempFieldFocus + 1;
        setFocusedObject(prevFocusedObject => parseInt(prevFocusedObject) + 1);
      } else {
        focusedFieldNoState = 0;
        setFocusedObject(0);
      }
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'LEFT') {
      if (tempFieldFocus > 0) {
        focusedFieldNoState = tempFieldFocus - 1;
        setFocusedObject(prevFocusedObject => parseInt(prevFocusedObject) - 1);
      } else {
        focusedFieldNoState = 7;
        setFocusedObject(7);
      }
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'UP') {
      if (tempdata[tempFieldFocus]) {
        if (
          tempdata[tempFieldFocus].charCodeAt() > 64 &&
          tempdata[tempFieldFocus].charCodeAt() < 90
        ) {
          tempdata[tempFieldFocus] = String.fromCharCode(
            tempdata[tempFieldFocus].charCodeAt() + 1,
          );
        } else {
          if (tempdata[tempFieldFocus].charCodeAt() === 32) {
            tempdata[tempFieldFocus] = String.fromCharCode(65);
          } else if (tempdata[tempFieldFocus].charCodeAt() === 90) {
            tempdata[tempFieldFocus] = String.fromCharCode(32);
          }
        }
      }
      usernameNoState = tempdata;
      setUsername(tempdata);
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'DOWN') {
      console.log(tempdata, tempFieldFocus);
      if (
        tempdata[tempFieldFocus].charCodeAt() > 65 &&
        tempdata[tempFieldFocus].charCodeAt() < 91
      ) {
        tempdata[tempFieldFocus] = String.fromCharCode(
          tempdata[tempFieldFocus].charCodeAt() - 1,
        );
      } else {
        console.log(tempFieldFocus, tempdata);
        console.log(tempdata[tempFieldFocus].charCodeAt());
        if (tempdata[tempFieldFocus].charCodeAt() === 32) {
          tempdata[tempFieldFocus] = String.fromCharCode(90);
        } else if (tempdata[tempFieldFocus].charCodeAt() === 65) {
          tempdata[tempFieldFocus] = String.fromCharCode(32);
        }
      }
      usernameNoState = tempdata;
      setUsername(tempdata);
    }
  });

  return (
    <Container ref={ref}>
      <TitleContainer>
        <Title>The Game</Title>
        <Username>Choose your username</Username>
      </TitleContainer>
      <UserNameForm>
        <InputField
          type="text"
          focusedInput={focusedObject}
          placeholder={isFocused ? 'focused' : 'Username ...'}
          value={username}
          onChange={value => setUsername(value)}
        />
      </UserNameForm>
    </Container>
  );
};

Home.propTypes = {
  history: shape().isRequired,
};

const Username = styled.h2`
  font-size: 3rem;
  background-color: orange;
  padding: 1.5rem 3rem;
  border-radius: 0 0 1rem 1rem;
  display: 0 0 auto;
  flex-grow: 0;
  font-weight: 900;
  flex-shrink: 0;
`;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: #151515;
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 10rem;
  text-transform: uppercase;
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 4rem;
  flex: 0 0 auto;
  max-width: 100%;
`;

const Label = styled.label``;

const UserNameForm = styled.form``;

export default withRouter(Home);
