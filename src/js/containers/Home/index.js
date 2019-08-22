import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFocus } from 'joystick-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
const Home = () => {
  const [username, setUsername] = useState([
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
  ]);
  const [disabled, setDisabled] = useState(true);
  let usernameNoState = [...username];
  const buttonMapping = {
    0: 'X',
    12: 'UP',
    15: 'RIGHT',
    13: 'DOWN',
    14: 'LEFT',
  };
  const [focusedObject, setFocusedObject] = useState(0);
  let focusedFieldNoState = focusedObject;

  useEffect(() => {
    let joinedName = username.join('').trim();
    console.log(joinedName);
    setDisabled(joinedName.length >= 3 ? false : true);
  }, [username]);

  const { isFocused, ref } = useFocus(gamepadEvent => {
    console.log(gamepadEvent.keyCode);
    const tempdata = [...usernameNoState];
    const tempFieldFocus = focusedFieldNoState;
    if (buttonMapping[gamepadEvent.keyCode] === 'X') {
      alert('Confirm name');
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'RIGHT') {
      focusedFieldNoState = tempFieldFocus + 1;
      setFocusedObject(prevFocusedObject => parseInt(prevFocusedObject) + 1);
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'LEFT') {
      focusedFieldNoState = tempFieldFocus - 1;
      setFocusedObject(prevFocusedObject => parseInt(prevFocusedObject) - 1);
    }

    if (buttonMapping[gamepadEvent.keyCode] === 'UP') {
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
      usernameNoState = tempdata;
      setUsername(tempdata);
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'DOWN') {
      console.log(tempdata[tempFieldFocus].charCodeAt());
      if (
        tempdata[tempFieldFocus].charCodeAt() > 65 &&
        tempdata[tempFieldFocus].charCodeAt() < 91
      ) {
        tempdata[tempFieldFocus] = String.fromCharCode(
          tempdata[tempFieldFocus].charCodeAt() - 1,
        );
      } else {
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
    <Container>
      <UserNameForm>
        <Label ref={ref} htmlFor="username">
          {isFocused ? 'focused' : 'Username ...'}
        </Label>
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

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: orangered;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label``;

const UserNameForm = styled.form``;

export default Home;
