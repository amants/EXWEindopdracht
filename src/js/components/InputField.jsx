import React from 'react';
import { string, func } from 'prop-types';
import styled from 'styled-components';
const InputField = ({
  className,
  name,
  type,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <Container>
      <input
        className={className}
        type={type}
        id="input1"
        name={name}
        value={value[0]}
        // onFocus={() => }
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
        type={type}
        id="input2"
        name={name}
        value={value[1]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
        type={type}
        id="input3"
        name={name}
        value={value[2]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
        type={type}
        id="input4"
        name={name}
        value={value[3]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
        type={type}
        id="input5"
        name={name}
        value={value[4]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
        type={type}
        id="input6"
        name={name}
        value={value[5]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
        type={type}
        id="input7"
        name={name}
        value={value[6]}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={className}
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

const Container = styled.div``;

InputField.defaultProps = {
  className: '',
  type: 'text',
  value: '',
  placeholder: '',
  name: '',
  onChange: () => {},
};

InputField.propTypes = {
  className: string,
  name: string,
  type: string,
  value: string,
  placeholder: string,
  onChange: func,
};

export default InputField;
