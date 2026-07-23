import {
  Space_Grotesk,
  JetBrains_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Caveat,
  Nunito,
  Nunito_Sans,
  DM_Serif_Display,
  Baloo_2,
} from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });
export const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display', display: 'swap' });
export const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta-sans', display: 'swap' });
export const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' });
export const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });
export const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito-sans', display: 'swap' });
export const dmSerifDisplay = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-dm-serif-display', display: 'swap' });
export const baloo2 = Baloo_2({ subsets: ['latin'], variable: '--font-baloo-2', display: 'swap' });