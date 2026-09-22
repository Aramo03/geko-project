import React from 'react';

const Button = ({ text, onClick, type = 'button', bgColor = 'bg-primary', ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg font-bold w-full uppercase text-white border-secondary px-4 py-2 ${bgColor} hover:bg-opacity-75 focus:outline-none focus:ring focus:ring-opacity-50`}
      {...rest}
    >
      {text}
    </button>
  );
};

export default Button;
