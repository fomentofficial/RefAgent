import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '모바일 부고장',
  description: '3분 안에 부고장을 만들고 공유하세요',
  openGraph: {
    title: '모바일 부고장',
    description: '3분 안에 부고장을 만들고 공유하세요',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
