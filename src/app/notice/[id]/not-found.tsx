import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NoticeNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          부고장을 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-8">
          부고장이 삭제되었거나 존재하지 않습니다.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
