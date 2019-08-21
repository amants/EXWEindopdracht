import React from 'react';
import { string, func } from 'prop-types';

const InputField = ({ name, type, value, placeholder, onChange }) => (
  <input
    type={type}
    name={name}
    value={value}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
  />
);

InputField.propTypes = {
  name: string.isRequired,
  type: string.isRequired,
  value: string.isRequired,
  placeholder: string.isRequired,
  onChange: func.isRequired,
};

export default InputField;
