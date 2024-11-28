import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    xs: { height: 20, width: 60 },   // 3:1 aspect ratio
    sm: { height: 28, width: 84 },   // Reduced from 32x96
    md: { height: 36, width: 108 },  // Reduced from 48x144
    lg: { height: 48, width: 144 }   // Reduced from 64x192
  }

  const dimensions = sizes[size]

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="ProductiveFlow Logo"
        height={dimensions.height}
        width={dimensions.width}
        priority
      />
    </div>
  )
}
