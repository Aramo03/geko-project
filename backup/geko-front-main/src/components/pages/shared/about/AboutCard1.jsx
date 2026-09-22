import React from 'react';

export default function AboutCard1({
  Icon,
  count,
  color,
  title,
  space ,
}) {
  const cardStyles = {
    border: `1px solid ${color}`,
    color: color,
    ':hover': { 
      border: `1px solid ${color}`,
    },
  };

  return (
    <article
      style={cardStyles} 
      className={`my-2 w-full ${space ? 'mid:mb-20' : 'mid:mt-5'} mb-5 mt-0 h-[max-content] border-b border-gray-300 rounded-lg transition-all duration-300 p-16  mx-3 flex flex-col items-center justify-around gap-2`}
    >
      <Icon
        style={{ fontSize: '4rem',  color: color }} // Apply dynamic styles to Icon
      />
      <span className="text-4xl">{count}</span>
      <span className="text-lg capitalize text-secondaryLight">{title}</span>
    </article>
  );
}
