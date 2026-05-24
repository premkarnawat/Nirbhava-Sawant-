import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nirbhava Sawant — 3D Designer & Visual Artist',
  description: 'A 3D designer passionate about crafting bold and memorable projects. UI/UX, Branding, Motion Design.',
  keywords: ['3D Design','UI/UX','Branding','Motion Design','Portfolio','Nirbhava Sawant'],
  authors: [{ name: 'Nirbhava Sawant' }],
  openGraph: {
    title: 'Nirbhava Sawant — 3D Designer & Visual Artist',
    description: 'A 3D designer passionate about crafting bold and memorable projects.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>{children}</body>
    </html>
  );
}
