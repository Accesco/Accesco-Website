import Image from 'next/image';

export default function InstaStyleLogo({ className = '', ...props }) {
  return (
    <Image
      src="/images/instastyle-logo.png"
      alt="InstaStyle"
      width={40}
      height={40}
      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
}