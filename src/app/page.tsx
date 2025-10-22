import Link from 'next/link';
import { templates } from '@/lib/templates';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            모바일 부고장
          </h1>
          <p className="text-xl text-gray-500 font-light">
            3분 안에 부고장을 만들고 공유하세요
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Template Selection */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
              템플릿 선택
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Link
                  key={template.id}
                  href={`/create?template=${template.id}`}
                  className="group block"
                >
                  <div className="h-full transition-all duration-300 hover:scale-105">
                    {/* Template Preview Card */}
                    <div
                      className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                      style={{ backgroundColor: template.backgroundColor }}
                    >
                      {/* Mini Preview */}
                      <div className="p-8 aspect-[3/4]">
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                          {/* Decorative Element based on template */}
                          <div className="w-16 h-16 flex items-center justify-center">
                            {template.id === 'classic' && (
                              <div className="text-4xl" style={{ color: template.accentColor }}>⚘</div>
                            )}
                            {template.id === 'modern' && (
                              <div className="w-12 h-12 rounded-full" style={{ background: `linear-gradient(135deg, ${template.accentColor}, ${template.textColor})` }}></div>
                            )}
                            {template.id === 'elegant' && (
                              <div className="text-4xl" style={{ color: template.accentColor }}>✿</div>
                            )}
                            {template.id === 'minimal' && (
                              <div className="w-8 h-8 rounded-sm" style={{ backgroundColor: template.accentColor }}></div>
                            )}
                          </div>

                          {/* Template Name */}
                          <div className="text-center">
                            <h3
                              className="text-2xl font-medium mb-2"
                              style={{
                                color: template.textColor,
                                fontFamily: template.fontFamily
                              }}
                            >
                              {template.name}
                            </h3>
                            <p
                              className="text-sm opacity-70"
                              style={{ color: template.textColor }}
                            >
                              {template.description}
                            </p>
                          </div>

                          {/* Preview Text */}
                          <div className="text-center space-y-2 text-xs opacity-60" style={{ color: template.textColor, fontFamily: template.fontFamily }}>
                            <div className="font-medium">부 고</div>
                            <div>홍길동님의 별세를</div>
                            <div>알려드립니다</div>
                          </div>
                        </div>
                      </div>

                      {/* Select Button */}
                      <div
                        className="px-6 py-4 text-center font-medium transition-colors duration-300"
                        style={{
                          backgroundColor: template.accentColor,
                          color: template.backgroundColor
                        }}
                      >
                        선택하기
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
              서비스 특징
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-gray-600 font-light">회원가입 없이 전화번호로 간편 인증</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-gray-600 font-light">카카오지도로 장례식장 위치 표시</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-gray-600 font-light">상주 연락처 및 계좌정보 입력 가능</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-gray-600 font-light">카카오톡, 문자, SNS로 손쉬운 공유</p>
              </div>
              <div className="flex items-start space-x-3 md:col-span-2 justify-center">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-gray-600 font-light">언제든지 내용 수정 및 관리 가능</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
