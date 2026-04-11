import Image from 'next/image';

export default function InstaStyleLogo({ className = '', ...props }) {
  return (
    <Image
      src="/images/instastyle-logo.png"
      alt=""
      width={40}
      height={40}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
}