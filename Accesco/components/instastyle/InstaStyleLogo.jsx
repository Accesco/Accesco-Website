import Image from 'next/image';

export default function InstaStyleLogo({ className = '', ...props }) {
  return (
    <img
      src="/images/instastyle-logo.png"
      alt="InstaStyle"
      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
}