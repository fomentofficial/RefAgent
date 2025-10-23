'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OwnerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          setError(
            `${data.error} 남은 시도 횟수: ${data.attemptsRemaining}회`
          );
        } else {
          setError(data.error || '로그인에 실패했습니다.');
        }
        return;
      }

      // Redirect to manage page with the found notice ID
      if (data.noticeId) {
        router.push(`/owner/${data.noticeId}/manage`);
      } else {
        setError('부고장 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            내 부고장 관리
          </h1>
          <p className="text-gray-600">
            부고장을 수정하려면 로그인하세요
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  부고장 생성 시 등록한 전화번호
                </p>
              </div>

              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호 입력"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  부고장 생성 시 설정한 비밀번호
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  아직 부고장이 없으신가요?
                </p>
                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    부고장 만들기
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link href="/">
            <Button variant="ghost">
              메인으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
