import Link from 'next/link';
import { templates } from '@/lib/templates';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🕊️ 모바일 부고장
          </h1>
          <p className="text-lg text-gray-600">
            3분 안에 부고장을 만들고 공유하세요
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            템플릿 선택
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/create?template=${template.id}`}
                className="block"
              >
                <div
                  className="p-6 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer h-full"
                  style={{ backgroundColor: template.backgroundColor }}
                >
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: template.textColor }}
                  >
                    {template.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: template.accentColor }}
                  >
                    {template.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span
                      className="text-sm font-medium"
                      style={{ color: template.accentColor }}
                    >
                      이 템플릿 선택 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              서비스 특징
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ 회원가입 없이 전화번호로 간편 인증</li>
              <li>✓ 카카오지도로 장례식장 위치 표시</li>
              <li>✓ 상주 연락처 및 계좌정보 입력 가능</li>
              <li>✓ 카카오톡, 문자, SNS로 손쉬운 공유</li>
              <li>✓ 언제든지 내용 수정 및 관리 가능</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
