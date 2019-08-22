import React from 'react';
import { string, func, bool } from 'prop-types';

const Button = ({ className, disabled, value, onClick }) => (
  <input
    className={className}
    type="submit"
    disabled={disabled}
    value={value}
    onClick={e => {
      e.target.preventDefault();
      onClick();
    }}
  />
);

Button.defaultProps = {
  className: '',
  disabled: false,
  value: 'Send',
  onClick: () => {},
};

Button.propTypes = {
  disabled: bool,
  value: string,
  onClick: func,
  className: string,
};

export default Button;
