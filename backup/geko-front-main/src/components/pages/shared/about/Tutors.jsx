import React from 'react';

export default function Tutors({ image, name, role }) {
  return (
    <div className="flex text-center flex-col mx-5 items-center ">
      <img
        src={image}
        height={200}
        width={200}
        className="rounded-full p-2 border-2 border-dashed border-primary"
        alt={'user ' + name}
      />
      <h3 className="py-3 text-xl font-bold">{name}</h3>
      <p className="">
        {role}
      </p>
    </div>
  );
}
