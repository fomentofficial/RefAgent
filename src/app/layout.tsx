import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  return (
    <html lang="ko">
      <head>
        {/* Kakao SDK for Sharing */}
        {kakaoAppKey && (
          <>
            <Script
              src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
              integrity="sha384-l+xbElFSnPZ2rOaPrU//2FF5B4LB8FiX5q4fXYTlfcG4PGpMkE1vcL7kNXI6Cci0"
              crossOrigin="anonymous"
              strategy="afterInteractive"
              onLoad={() => {
                if (typeof window !== 'undefined' && window.Kakao) {
                  if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(kakaoAppKey);
                  }
                }
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

declare global {
  interface Window {
    Kakao: any;
  }
}
