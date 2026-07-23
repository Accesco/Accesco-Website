import localFont from 'next/font/local';

// Self-hosted from Google Fonts (public/fonts/) so dev/build never depends on
// a live fetch to fonts.googleapis.com — that fetch was intermittently timing
// out behind this network's TLS interception, breaking `next dev` on cold start.
export const spaceGrotesk = localFont({ src: '../public/fonts/space-grotesk-400.woff2', weight: '400', variable: '--font-space-grotesk', display: 'swap' });
export const jetbrainsMono = localFont({ src: '../public/fonts/jetbrains-mono-400.woff2', weight: '400', variable: '--font-jetbrains-mono', display: 'swap' });
export const playfairDisplay = localFont({ src: '../public/fonts/playfair-display-400.woff2', weight: '400', variable: '--font-playfair-display', display: 'swap' });
export const plusJakartaSans = localFont({ src: '../public/fonts/plus-jakarta-sans-400.woff2', weight: '400', variable: '--font-plus-jakarta-sans', display: 'swap' });
export const caveat = localFont({ src: '../public/fonts/caveat-400.woff2', weight: '400', variable: '--font-caveat', display: 'swap' });
export const nunito = localFont({ src: '../public/fonts/nunito-400.woff2', weight: '400', variable: '--font-nunito', display: 'swap' });
export const nunitoSans = localFont({ src: '../public/fonts/nunito-sans-400.woff2', weight: '400', variable: '--font-nunito-sans', display: 'swap' });
export const dmSerifDisplay = localFont({ src: '../public/fonts/dm-serif-display-400.woff2', weight: '400', variable: '--font-dm-serif-display', display: 'swap' });
export const baloo2 = localFont({ src: '../public/fonts/baloo-2-400.woff2', weight: '400', variable: '--font-baloo-2', display: 'swap' });
