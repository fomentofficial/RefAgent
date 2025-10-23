'use client';

import Link from 'next/link';
import { useState } from 'react';
import { templates } from '@/lib/templates';
import { Settings, Sparkles, Check, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const sampleNotice = {
    deceased_name: '홍길동',
    age: 80,
    death_date: '2024-01-15T10:00:00',
    funeral_hall: '서울추모공원',
    room_number: '3층 301호',
    burial_date: '2024-01-17T09:00:00',
    resting_place: '용인추모공원',
    host_name: '홍철수',
    contact: '010-1234-5678',
    show_contact: true,
    account_bank: '국민은행',
    account_number: '123-456-789012',
    account_holder: '홍철수',
    show_account: true,
    message: '고인의 명복을 빌어주시기 바랍니다.',
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
            모바일 부고장
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/owner/login" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>내 부고장 관리</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">간편하게 만드는 디지털 부고장</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            모바일 부고장
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            3분 안에 부고장을 만들고 공유하세요<br />
            <span className="text-base text-gray-500">회원가입 없이 전화번호만으로 간편하게</span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Template Selection */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
              템플릿 선택
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group"
                >
                  <div className="transition-all duration-300 hover:scale-[1.02]">
                    {/* Template Preview Card - 더 큰 미리보기 */}
                    <div
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
                      style={{ backgroundColor: template.backgroundColor }}
                    >
                      {/* Template Full Preview */}
                      <div className="p-8 md:p-10" style={{ fontFamily: template.fontFamily }}>
                        {/* Header */}
                        <div className="text-center mb-6 pb-4">
                          <div className="flex items-center justify-center mb-3">
                            {template.id === 'classic' && (
                              <div className="text-3xl" style={{ color: template.accentColor }}>⚘</div>
                            )}
                            {template.id === 'modern' && (
                              <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(135deg, ${template.accentColor}, ${template.textColor})` }}></div>
                            )}
                            {template.id === 'elegant' && (
                              <div className="text-3xl" style={{ color: template.accentColor }}>✿</div>
                            )}
                            {template.id === 'minimal' && (
                              <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: template.accentColor }}></div>
                            )}
                          </div>
                          <h2
                            className="text-2xl md:text-3xl font-bold mb-2"
                            style={{
                              color: template.accentColor,
                              letterSpacing: template.id === 'classic' ? '0.3em' : '0.1em'
                            }}
                          >
                            부 고
                          </h2>
                          <p className="text-base font-light" style={{ color: template.textColor }}>
                            홍길동님의 별세를 알려드립니다
                          </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
                          <div>
                            <p className="opacity-60 mb-1" style={{ color: template.textColor }}>고인</p>
                            <p className="font-semibold" style={{ color: template.textColor }}>홍길동</p>
                          </div>
                          <div>
                            <p className="opacity-60 mb-1" style={{ color: template.textColor }}>향년</p>
                            <p className="font-semibold" style={{ color: template.textColor }}>80세</p>
                          </div>
                          <div>
                            <p className="opacity-60 mb-1" style={{ color: template.textColor }}>별세</p>
                            <p className="font-semibold text-xs" style={{ color: template.textColor }}>2024.1.15</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div
                          className="p-4 rounded-lg mb-4 text-xs"
                          style={{ backgroundColor: template.id === 'minimal' ? '#FAFAFA' : template.textColor + '08' }}
                        >
                          <p className="font-medium mb-1" style={{ color: template.accentColor }}>장례 안내</p>
                          <p className="opacity-70 text-xs" style={{ color: template.textColor }}>서울추모공원 3층 301호</p>
                          <p className="opacity-70 text-xs mt-1" style={{ color: template.textColor }}>발인: 2024.1.17 오전 9시</p>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-3">
                          <p className="text-xs opacity-60" style={{ color: template.textColor }}>
                            고인의 명복을 빕니다
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons with Gradient Blur */}
                      <div
                        className="absolute bottom-0 left-0 right-0 backdrop-blur-md"
                        style={{
                          background: `linear-gradient(to top, ${template.backgroundColor}f5, ${template.backgroundColor}e5 60%, transparent)`,
                          paddingTop: '2.5rem',
                          paddingBottom: '1.25rem'
                        }}
                      >
                        <div className="px-6">
                          <h3
                            className="text-xl font-semibold mb-3 text-center"
                            style={{
                              color: template.textColor,
                              fontFamily: template.fontFamily
                            }}
                          >
                            {template.name}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewTemplate(template.id)}
                              className="flex-1"
                              style={{
                                backgroundColor: template.backgroundColor,
                                color: template.accentColor,
                                borderColor: template.accentColor
                              }}
                            >
                              미리보기
                            </Button>
                            <Button
                              size="sm"
                              asChild
                              className="flex-1"
                              style={{
                                backgroundColor: template.accentColor,
                                color: template.backgroundColor
                              }}
                            >
                              <Link href={`/create?template=${template.id}`}>
                                만들기 <ArrowRight className="w-4 h-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                서비스 특징
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">회원가입 없이 전화번호로 간편 인증</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">카카오지도로 장례식장 위치 표시</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">상주 연락처 및 계좌정보 입력 가능</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">카카오톡, 문자, SNS로 손쉬운 공유</p>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2 justify-center">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">언제든지 내용 수정 및 관리 가능</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {templates.find(t => t.id === previewTemplate)?.name} 템플릿 미리보기
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewTemplate(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {(() => {
                const template = templates.find(t => t.id === previewTemplate);
                if (!template) return null;

                return (
                  <div
                    className="rounded-2xl overflow-hidden shadow-lg p-10"
                    style={{
                      backgroundColor: template.backgroundColor,
                      color: template.textColor,
                      fontFamily: template.fontFamily
                    }}
                  >
                    {/* Header */}
                    <div className="text-center mb-8 pb-6">
                      {template.id === 'classic' && (
                        <div className="text-4xl mb-4" style={{ color: template.accentColor }}>⚘</div>
                      )}
                      {template.id === 'elegant' && (
                        <div className="text-4xl mb-4" style={{ color: template.accentColor }}>✿</div>
                      )}
                      <h1
                        className="text-4xl font-bold mb-4 tracking-wide"
                        style={{
                          color: template.accentColor,
                          letterSpacing: template.id === 'classic' ? '0.3em' : template.id === 'minimal' ? '0.05em' : '0.1em'
                        }}
                      >
                        부 고
                      </h1>
                      <p className="text-xl font-light">
                        {sampleNotice.deceased_name}님의 별세를 알려드립니다
                      </p>
                    </div>

                    {/* 고인 정보 */}
                    <div className="mb-12">
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wider opacity-60">고인</p>
                          <p className="text-2xl font-semibold">{sampleNotice.deceased_name}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wider opacity-60">향년</p>
                          <p className="text-2xl font-semibold">{sampleNotice.age}세</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wider opacity-60">별세일시</p>
                          <p className="text-sm font-light">2024년 1월 15일</p>
                        </div>
                      </div>
                    </div>

                    {/* 장례 정보 */}
                    <div
                      className="mb-10 p-8 rounded-2xl"
                      style={{
                        backgroundColor: template.id === 'minimal' ? '#FAFAFA' : template.textColor + '08'
                      }}
                    >
                      <h2
                        className="text-2xl font-semibold mb-6"
                        style={{
                          color: template.accentColor,
                          letterSpacing: template.id === 'classic' ? '0.2em' : '0.05em'
                        }}
                      >
                        장례 안내
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-baseline">
                          <span className="font-medium w-28 flex-shrink-0 opacity-70">장례식장</span>
                          <span className="font-light">{sampleNotice.funeral_hall}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-medium w-28 flex-shrink-0 opacity-70">빈소</span>
                          <span className="font-light">{sampleNotice.room_number}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-medium w-28 flex-shrink-0 opacity-70">발인일시</span>
                          <span className="font-light">2024년 1월 17일 오전 9시</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="font-medium w-28 flex-shrink-0 opacity-70">장지</span>
                          <span className="font-light">{sampleNotice.resting_place}</span>
                        </div>
                      </div>
                    </div>

                    {/* 상주 정보 */}
                    <div className="mb-10">
                      <h2
                        className="text-2xl font-semibold mb-4"
                        style={{
                          color: template.accentColor,
                          letterSpacing: template.id === 'classic' ? '0.2em' : '0.05em'
                        }}
                      >
                        상주
                      </h2>
                      <div className="space-y-2">
                        <p className="text-xl font-light">{sampleNotice.host_name}</p>
                        <p className="text-sm opacity-60 font-light">연락처: {sampleNotice.contact}</p>
                      </div>
                    </div>

                    {/* 계좌 정보 */}
                    <div
                      className="mb-10 p-8 rounded-2xl"
                      style={{
                        backgroundColor: template.id === 'modern'
                          ? `${template.accentColor}10`
                          : template.id === 'elegant'
                          ? `${template.accentColor}08`
                          : template.textColor + '05'
                      }}
                    >
                      <h2
                        className="text-2xl font-semibold mb-6"
                        style={{
                          color: template.accentColor,
                          letterSpacing: template.id === 'classic' ? '0.2em' : '0.05em'
                        }}
                      >
                        부의금 계좌
                      </h2>
                      <div className="space-y-3">
                        <p className="font-medium text-lg">{sampleNotice.account_bank}</p>
                        <p className="text-xl font-mono tracking-wide">{sampleNotice.account_number}</p>
                        <p className="text-sm opacity-60 font-light">예금주: {sampleNotice.account_holder}</p>
                      </div>
                    </div>

                    {/* 푸터 */}
                    <div className="text-center pt-8 mt-8 opacity-60">
                      {template.id === 'classic' && (
                        <div className="text-2xl mb-3" style={{ color: template.accentColor }}>⚘</div>
                      )}
                      {template.id === 'elegant' && (
                        <div className="text-2xl mb-3" style={{ color: template.accentColor }}>✿</div>
                      )}
                      <p className="text-sm font-light tracking-wide">
                        고인의 명복을 빕니다
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
                className="flex-1"
              >
                닫기
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/create?template=${previewTemplate}`}>
                  이 템플릿으로 만들기 <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
