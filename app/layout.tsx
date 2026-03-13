import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Gestão Pedagógica - Raymundo Lemos Santana',
  description: 'Gestão Pedagógica',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-br" className={plusJakartaSans.variable}>
      <body suppressHydrationWarning className="font-sans">{children}</body>
    </html>
  );
}
