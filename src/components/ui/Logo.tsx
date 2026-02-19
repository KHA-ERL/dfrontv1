import logoBlack from '../../assets/logo-black.png';
import logoWhite from '../../assets/logo-white.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-20 sm:h-24',
  md: 'h-24 sm:h-32 md:h-40',
  lg: 'h-28 sm:h-36 md:h-48',
};

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const heightClass = sizeMap[size];

  return (
    <>
      <img
        src={logoBlack}
        alt="Cribhub"
        className={`${heightClass} w-auto max-w-full object-contain dark:hidden ${className}`}
      />
      <img
        src={logoWhite}
        alt="Cribhub"
        className={`${heightClass} w-auto max-w-full object-contain hidden dark:block ${className}`}
      />
    </>
  );
}
