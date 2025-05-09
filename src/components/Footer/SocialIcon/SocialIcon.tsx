import React from 'react'
import Image from "next/image";
import { SocialIconProps } from './SocialIcon.types';
import Link from 'next/link';

const SocialIcon: React.FC<SocialIconProps> = ({ icon, link}) => {
  return (
    <Link href={link}>
      <Image
        src={`/images/icons/${icon}.png`}
        alt="Corner Decoration"
        width={25}
        height={25}
      />
    </Link>
  )
}

export default SocialIcon