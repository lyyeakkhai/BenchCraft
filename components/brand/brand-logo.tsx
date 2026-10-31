import Image from 'next/image';

interface BrandLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  width = 130,
  height = 30,
  className = 'h-7 w-auto',
  priority = false,
}: BrandLogoProps) {
  return (
    <span className="relative inline-flex items-center">
      {/* Light mode lockup */}
      <Image
        src="/benchcraft-lockup-light.svg"
        alt="BenchCraft"
        width={width}
        height={height}
        className={`${className} dark:hidden block`}
        priority={priority}
      />
      {/* Dark mode lockup */}
      <Image
        src="/benchcraft-lockup-dark.svg"
        alt="BenchCraft"
        width={width}
        height={height}
        className={`${className} hidden dark:block`}
        priority={priority}
      />
    </span>
  );
}
