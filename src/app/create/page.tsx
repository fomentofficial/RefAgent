'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTemplateById } from '@/lib/templates';

function CreateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || 'classic';
  const template = getTemplateById(templateId);

  const [formData, setFormData] = useState({
    deceased_name: '',
    age: '',
    death_date: '',
    funeral_hall: '',
    room_number: '',
    burial_date: '',
    resting_place: '',
    host_name: '',
    contact: '',
    show_contact: false,
    account_bank: '',
    account_number: '',
    account_holder: '',
    show_account: false,
    message: '',
    phone: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          template_id: templateId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create notice');
      }

      const { noticeId } = await response.json();
      router.push(`/notice/${noticeId}`);
    } catch (error) {
      console.error('Error creating notice:', error);
      alert('부고장 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!template) {
    return <div>템플릿을 찾을 수 없습니다.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            부고장 만들기
          </h1>
          <p className="text-gray-600">
            선택한 템플릿: <span className="font-semibold">{template.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 고인 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>고인 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deceased_name">고인 성함 *</Label>
                <Input
                  id="deceased_name"
                  name="deceased_name"
                  required
                  value={formData.deceased_name}
                  onChange={handleChange}
                  placeholder="예: 홍길동"
                />
              </div>
              <div>
                <Label htmlFor="age">향년</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="예: 85"
                />
              </div>
              <div>
                <Label htmlFor="death_date">별세일시 *</Label>
                <Input
                  id="death_date"
                  name="death_date"
                  type="datetime-local"
                  required
                  value={formData.death_date}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* 장례 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>장례 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="funeral_hall">장례식장 *</Label>
                <Input
                  id="funeral_hall"
                  name="funeral_hall"
                  required
                  value={formData.funeral_hall}
                  onChange={handleChange}
                  placeholder="예: 서울아산병원 장례식장"
                />
              </div>
              <div>
                <Label htmlFor="room_number">빈소</Label>
                <Input
                  id="room_number"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  placeholder="예: 3호실"
                />
              </div>
              <div>
                <Label htmlFor="burial_date">발인일시 *</Label>
                <Input
                  id="burial_date"
                  name="burial_date"
                  type="datetime-local"
                  required
                  value={formData.burial_date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="resting_place">장지</Label>
                <Input
                  id="resting_place"
                  name="resting_place"
                  value={formData.resting_place}
                  onChange={handleChange}
                  placeholder="예: 하늘공원"
                />
              </div>
            </CardContent>
          </Card>

          {/* 상주 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상주 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="host_name">상주 성함 *</Label>
                <Input
                  id="host_name"
                  name="host_name"
                  required
                  value={formData.host_name}
                  onChange={handleChange}
                  placeholder="예: 홍철수"
                />
              </div>
              <div>
                <Label htmlFor="contact">연락처</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="예: 010-1234-5678"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show_contact"
                  name="show_contact"
                  checked={formData.show_contact}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="show_contact">연락처 공개</Label>
              </div>
            </CardContent>
          </Card>

          {/* 계좌 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>계좌 정보 (선택)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="account_bank">은행명</Label>
                <Input
                  id="account_bank"
                  name="account_bank"
                  value={formData.account_bank}
                  onChange={handleChange}
                  placeholder="예: 국민은행"
                />
              </div>
              <div>
                <Label htmlFor="account_number">계좌번호</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  placeholder="예: 123-456-789012"
                />
              </div>
              <div>
                <Label htmlFor="account_holder">예금주</Label>
                <Input
                  id="account_holder"
                  name="account_holder"
                  value={formData.account_holder}
                  onChange={handleChange}
                  placeholder="예: 홍철수"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show_account"
                  name="show_account"
                  checked={formData.show_account}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="show_account">계좌정보 공개</Label>
              </div>
            </CardContent>
          </Card>

          {/* 안내문 */}
          <Card>
            <CardHeader>
              <CardTitle>안내문 (선택)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="추가 안내사항을 입력해주세요"
              />
            </CardContent>
          </Card>

          {/* 인증 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>관리자 인증 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">전화번호 (관리용) *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="예: 010-1234-5678"
                />
                <p className="text-xs text-gray-500 mt-1">
                  부고장 수정 시 사용됩니다
                </p>
              </div>
              <div>
                <Label htmlFor="password">비밀번호 (관리용) *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8자 이상"
                />
                <p className="text-xs text-gray-500 mt-1">
                  최소 8자 이상 입력해주세요
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? '생성 중...' : '부고장 만들기'}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    }>
      <CreateForm />
    </Suspense>
  );
}
