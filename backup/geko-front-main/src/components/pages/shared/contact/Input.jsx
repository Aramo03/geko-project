import React from 'react';

const Input = React.forwardRef(({type = 'text', placeholder = '', error, ...rest}, ref) => {
    return placeholder !== 'Message' ? (
        <div>
            <input
                type={type}
                placeholder={placeholder + ' *'}
                className={`${type === 'email' ? '' : 'capitalize'} appearance-none my-1 block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${
                    error ? 'border-red-500' : ''
                }`}
                ref={ref} // Pass the ref provided by react-hook-form
                {...rest}
                autoComplete={type === 'email' ? 'email' : 'on'}
            />
            {error && <p className="text-red-500 text-xs italic">This field is required</p>}
        </div>
    ) : (
        <div>
      <textarea
          placeholder={placeholder + ' *'}
          className={`capitalize appearance-none min-h-[5.75vh] max-h-[10vh] block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${
              error ? 'border-red-500' : ''
          }`}
          ref={ref} // Pass the ref provided by react-hook-form
          {...rest}
      ></textarea>
            {error && <p className="text-red-500 text-xs italic">This field is required</p>}
        </div>
    );
});

export default Input;
