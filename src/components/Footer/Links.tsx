import React from 'react';
import Link from 'next/link';

const Links = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex flex-col sm:flex-row max-sm:space-y-2 sm:mt-2 justify-between bottom-[56px] text-[#838383] font-medium px-[134px]">
      <div>@ {currentYear} SCALER - All rights reserved</div>
      <div className="flex flex-col sm:flex-row space-x-2">
        <div>
          <Link href="#">Privacy policy</Link>
        </div>
        <div>
          <Link href="#">Cookie policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Links;
