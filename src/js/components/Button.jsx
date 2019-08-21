import React from 'react';
import { string, func, bool } from 'prop-types';

const InputField = ({ disabled, value, placeholder, onClick }) => (
  <input
    type="submit"
    disabled={disabled}
    value={value}
    placeholder={placeholder}
    onClick={e => {
      e.target.preventDefault();
      onClick();
    }}
  />
);

InputField.propTypes = {
  disabled: bool.isRequired,
  value: string.isRequired,
  placeholder: string.isRequired,
  onClick: func.isRequired,
};

export default InputField;
