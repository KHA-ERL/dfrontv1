import logoBlack from '../../assets/logo-black.png';
import logoWhite from '../../assets/logo-white.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-10 sm:h-12',
  md: 'h-12 sm:h-16 md:h-20',
  lg: 'h-14 sm:h-18 md:h-24',
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
