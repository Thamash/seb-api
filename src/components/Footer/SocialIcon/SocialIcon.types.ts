type SocialIconType = 'facebook' | 'linkedin' | 'insta' | 'x' | 'youtube';

export interface SocialIconProps {
  icon: SocialIconType;
  link: string;
}