import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceSupabase } from '@/lib/supabase';
import { Notice } from '@/types';
import NoticeTemplate from '@/components/templates/NoticeTemplate';
import KakaoMap from '@/components/KakaoMap';
import ShareButtons from '@/components/ShareButtons';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { geocodeAddress } from '@/lib/kakao-map';

interface NoticePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getNotice(id: string): Promise<Notice | null> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Notice;
}

export async function generateMetadata({
  params,
}: NoticePageProps): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNotice(id);

  if (!notice) {
    return {
      title: '부고장을 찾을 수 없습니다',
    };
  }

  const burialDate = new Date(notice.burial_date).toLocaleDateString('ko-KR');

  return {
    title: `${notice.deceased_name}님 부고`,
    description: `장소: ${notice.funeral_hall}, 발인: ${burialDate}`,
    openGraph: {
      title: `${notice.deceased_name}님 부고`,
      description: `장소: ${notice.funeral_hall}, 발인: ${burialDate}`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/notice/${id}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${notice.deceased_name}님 부고`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${notice.deceased_name}님 부고`,
      description: `장소: ${notice.funeral_hall}, 발인: ${burialDate}`,
    },
  };
}

export default async function NoticePage({ params }: NoticePageProps) {
  const { id } = await params;
  const notice = await getNotice(id);

  if (!notice) {
    notFound();
  }

  // 카카오맵 위치 정보 (실제로는 클라이언트에서 geocoding 해야 하지만, 여기서는 저장된 값 사용)
  const mapLocation = notice.latitude && notice.longitude
    ? {
        lat: notice.latitude,
        lng: notice.longitude,
        address: notice.funeral_hall,
      }
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 관리 버튼 */}
        <div className="flex justify-end mb-4">
          <Link href={`/owner/${id}/login`}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              관리하기
            </Button>
          </Link>
        </div>

        {/* 부고장 내용 */}
        <div className="mb-8">
          <NoticeTemplate notice={notice} />
        </div>

        {/* 지도 */}
        {mapLocation && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              장례식장 위치
            </h3>
            <KakaoMap location={mapLocation} hallName={notice.funeral_hall} />
            <p className="text-sm text-gray-600 mt-2">{notice.funeral_hall}</p>
          </div>
        )}

        {/* 공유 버튼 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ShareButtons
            noticeId={id}
            deceasedName={notice.deceased_name}
          />
        </div>

        {/* 홈으로 */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
