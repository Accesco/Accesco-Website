import localFont from 'next/font/local';

<<<<<<< HEAD
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', adjustFontFallback: false });
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap', adjustFontFallback: false });
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap', adjustFontFallback: false });
export const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display', display: 'swap', adjustFontFallback: false });
export const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta-sans', display: 'swap', adjustFontFallback: false });
export const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap', adjustFontFallback: false });
export const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap', adjustFontFallback: false });
export const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito-sans', display: 'swap', adjustFontFallback: false });
export const dmSerifDisplay = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-dm-serif-display', display: 'swap', adjustFontFallback: false });
export const baloo2 = Baloo_2({ subsets: ['latin'], variable: '--font-baloo-2', display: 'swap', adjustFontFallback: false });
export const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap', adjustFontFallback: false });
export const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap', adjustFontFallback: false });
export const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap', adjustFontFallback: false });
=======
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
>>>>>>> origin/main
