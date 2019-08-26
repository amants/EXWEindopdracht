/* stylelint-disable selector-no-qualifying-type */
import React from 'react';
import { string, func, number, array } from 'prop-types';
import styled from 'styled-components';
const InputField = ({
  className,
  name,
  type,
  value,
  placeholder,
  onChange,
  focusedInput,
}) => {
  return (
    <Container className={className}>
      <InputContainer className={focusedInput === 0 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 0 ? 'focused' : null}
          type={type}
          id="input1"
          name={name}
          disabled
          value={value[0]}
          // onFocus={() => }
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 1 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 1 ? 'focused' : null}
          type={type}
          disabled
          id="input2"
          name={name}
          value={value[1]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 2 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 2 ? 'focused' : null}
          type={type}
          disabled
          id="input3"
          name={name}
          value={value[2]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 3 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 3 ? 'focused' : null}
          type={type}
          disabled
          id="input4"
          name={name}
          value={value[3]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 4 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 4 ? 'focused' : null}
          type={type}
          disabled
          id="input5"
          name={name}
          value={value[4]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 5 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 5 ? 'focused' : null}
          type={type}
          disabled
          id="input6"
          name={name}
          value={value[5]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 6 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 6 ? 'focused' : null}
          type={type}
          disabled
          id="input7"
          name={name}
          value={value[6]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
      <InputContainer className={focusedInput === 7 ? 'focused' : null}>
        <LeftArrow className="arrow" />
        <RightArrow className="arrow" />
        <input
          className={focusedInput === 7 ? 'focused' : null}
          type={type}
          disabled
          id="input8"
          name={name}
          value={value[7]}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      </InputContainer>
    </Container>
  );
};

const LeftArrow = styled.div`
  margin-top: 0;
  top: 3.5rem;
  width: 0;
  height: 0;
  border-bottom: 2rem solid transparent;
  border-top: 2rem solid transparent;
  border-right: 2rem solid white;
  z-index: 500;
  position: absolute;
  left: -3rem;
`;

const RightArrow = styled.div`
  margin-top: 50%;
  top: -2rem;
  width: 0;
  height: 0;
  border-bottom: 2rem solid transparent;
  border-top: 2rem solid transparent;
  border-left: 2rem solid white;
  z-index: 500;
  position: absolute;
  right: -3rem;
`;

const InputContainer = styled.div`
  position: relative;
  & .arrow {
    display: none;
  }
  &.focused {
    & .arrow {
      display: block;
    }
    &::before {
      content: '';
      margin-left: 50%;
      left: -2rem;
      width: 0;
      height: 0;
      border-left: 2rem solid transparent;
      border-right: 2rem solid transparent;
      border-bottom: 2rem solid white;
      border-top: none;
      z-index: 500;
      position: absolute;
      top: -3rem;
    }

    &::after {
      content: '';
      margin-left: 50%;
      left: -2rem;
      width: 0;
      height: 0;
      border-left: 2rem solid transparent;
      border-right: 2rem solid transparent;
      border-top: 2rem solid white;
      z-index: 500;
      position: absolute;
      bottom: -3rem;
    }
  }
  & > input {
    width: 10rem;
    height: 10rem;
    text-align: center;
    margin: 0.5rem;
    font-size: 7rem;
    background-color: orangered;
    border: none;
    border-radius: 0.5rem;
    font-weight: 900;

    &.focused {
      border: 1rem solid orange;

      &:disabled {
        color: white;
      }
    }

    &:disabled {
      color: #151515;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  justify-content: center;
`;

InputField.defaultProps = {
  className: '',
  type: 'text',
  value: [],
  placeholder: '',
  name: '',
  focusedInput: null,
  onChange: () => {},
};

InputField.propTypes = {
  className: string,
  name: string,
  type: string,
  value: array,
  placeholder: string,
  onChange: func,
  focusedInput: number,
};

export default InputField;
