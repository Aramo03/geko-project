import React from 'react';
import { IoIosArrowUp } from "react-icons/io";

const PageUpScrollButton = () => {
  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-secondary text-white p-2 z-[10000] hover:text-primary rounded-sm transition-colors duration-300 cursor-pointer"
      onClick={handleScrollUp}
    >
      <IoIosArrowUp />
    </div>
  );
};

export default PageUpScrollButton;
