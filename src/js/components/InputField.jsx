import React from 'react';
import { string, func, number } from 'prop-types';
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
      <input
        className={focusedInput === 0 ? 'focused' : null}
        type={type}
        id="input1"
        name={name}
        value={value[0]}
        // onFocus={() => }
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 1 ? 'focused' : null}
        type={type}
        id="input2"
        name={name}
        value={value[1]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 2 ? 'focused' : null}
        type={type}
        id="input3"
        name={name}
        value={value[2]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 3 ? 'focused' : null}
        type={type}
        id="input4"
        name={name}
        value={value[3]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 4 ? 'focused' : null}
        type={type}
        id="input5"
        name={name}
        value={value[4]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 5 ? 'focused' : null}
        type={type}
        id="input6"
        name={name}
        value={value[5]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 6 ? 'focused' : null}
        type={type}
        id="input7"
        name={name}
        value={value[6]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={focusedInput === 7 ? 'focused' : null}
        type={type}
        id="input8"
        name={name}
        value={value[7]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </Container>
  );
};

const Container = styled.div`
  & > input {
    width: 10rem;
    height: 10rem;
    text-align: center;
    margin: 0.5rem;
    font-size: 7rem;

    &.focused {
      border: 1rem solid lime;
    }
  }
`;

InputField.defaultProps = {
  className: '',
  type: 'text',
  value: '',
  placeholder: '',
  name: '',
  focusedInput: null,
  onChange: () => {},
};

InputField.propTypes = {
  className: string,
  name: string,
  type: string,
  value: string,
  placeholder: string,
  onChange: func,
  focusedInput: number,
};

export default InputField;
