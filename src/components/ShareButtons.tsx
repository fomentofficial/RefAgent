'use client';

import { Button } from '@/components/ui/button';
import { Share2, MessageCircle, Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  noticeId: string;
  deceasedName: string;
}

export default function ShareButtons({ noticeId, deceasedName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/notice/${noticeId}`;
  const shareText = `${deceasedName}님의 부고를 알려드립니다.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${deceasedName}님 부고`,
          description: shareText,
          imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '부고장 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      // Kakao SDK가 로드되지 않은 경우 URL로 공유
      window.open(
        `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      );
    }
  };

  const handleSMS = () => {
    const smsText = `${shareText}\n${shareUrl}`;
    window.location.href = `sms:?body=${encodeURIComponent(smsText)}`;
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${deceasedName}님 부고`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">공유하기</h3>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleKakaoShare}
          variant="outline"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-500"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          카카오톡
        </Button>

        <Button
          onClick={handleSMS}
          variant="outline"
          className="w-full"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          문자
        </Button>

        <Button
          onClick={handleWebShare}
          variant="outline"
          className="w-full"
        >
          <Share2 className="w-4 h-4 mr-2" />
          공유
        </Button>

        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copied ? '복사됨!' : '링크복사'}
        </Button>
      </div>
    </div>
  );
}
