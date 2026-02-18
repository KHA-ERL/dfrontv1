import logoBlack from '../../assets/logo-black.png';
import logoWhite from '../../assets/logo-white.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-10',
  md: 'h-14',
  lg: 'h-16',
};

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const heightClass = sizeMap[size];

  return (
    <>
      <img
        src={logoBlack}
        alt="Cribhub"
        className={`${heightClass} w-auto dark:hidden ${className}`}
      />
      <img
        src={logoWhite}
        alt="Cribhub"
        className={`${heightClass} w-auto hidden dark:block ${className}`}
      />
    </>
  );
}
