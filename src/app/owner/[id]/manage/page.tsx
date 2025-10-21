'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoticeData {
  id: string;
  deceased_name: string;
  age?: number;
  death_date: string;
  funeral_hall: string;
  room_number?: string;
  burial_date: string;
  resting_place?: string;
  host_name: string;
  contact?: string;
  show_contact: boolean;
  account_bank?: string;
  account_number?: string;
  account_holder?: string;
  show_account: boolean;
  message?: string;
}

export default function ManagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotice();
  }, [params.id]);

  const fetchNotice = async () => {
    try {
      const response = await fetch(`/api/notices/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notice');
      }
      const data = await response.json();
      setNotice(data);
    } catch (error) {
      console.error('Error fetching notice:', error);
      setError('부고장을 불러올 수 없습니다. 다시 로그인해주세요.');
      setTimeout(() => router.push(`/owner/${params.id}/login`), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!notice) return;

    const { name, value, type } = e.target;
    setNotice({
      ...notice,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notice) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/notices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      });

      if (!response.ok) {
        throw new Error('Failed to update notice');
      }

      alert('부고장이 성공적으로 수정되었습니다.');
      router.push(`/notice/${params.id}`);
    } catch (error) {
      console.error('Error updating notice:', error);
      setError('수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 부고장을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/notices/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notice');
      }

      alert('부고장이 삭제되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('Error deleting notice:', error);
      setError('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/notice/${params.id}`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error && !notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            부고장 관리
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 고인 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>고인 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deceased_name">고인 성함</Label>
                <Input
                  id="deceased_name"
                  name="deceased_name"
                  required
                  value={notice.deceased_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="age">향년</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={notice.age || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="death_date">별세일시</Label>
                <Input
                  id="death_date"
                  name="death_date"
                  type="datetime-local"
                  required
                  value={notice.death_date?.slice(0, 16) || ''}
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
                <Label htmlFor="funeral_hall">장례식장</Label>
                <Input
                  id="funeral_hall"
                  name="funeral_hall"
                  required
                  value={notice.funeral_hall}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="room_number">빈소</Label>
                <Input
                  id="room_number"
                  name="room_number"
                  value={notice.room_number || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="burial_date">발인일시</Label>
                <Input
                  id="burial_date"
                  name="burial_date"
                  type="datetime-local"
                  required
                  value={notice.burial_date?.slice(0, 16) || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="resting_place">장지</Label>
                <Input
                  id="resting_place"
                  name="resting_place"
                  value={notice.resting_place || ''}
                  onChange={handleChange}
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
                <Label htmlFor="host_name">상주 성함</Label>
                <Input
                  id="host_name"
                  name="host_name"
                  required
                  value={notice.host_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="contact">연락처</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={notice.contact || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show_contact"
                  name="show_contact"
                  checked={notice.show_contact}
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
              <CardTitle>계좌 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="account_bank">은행명</Label>
                <Input
                  id="account_bank"
                  name="account_bank"
                  value={notice.account_bank || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="account_number">계좌번호</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  value={notice.account_number || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="account_holder">예금주</Label>
                <Input
                  id="account_holder"
                  name="account_holder"
                  value={notice.account_holder || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show_account"
                  name="show_account"
                  checked={notice.show_account}
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
              <CardTitle>안내문</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                id="message"
                name="message"
                value={notice.message || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : '변경사항 저장'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/notice/${params.id}`)}
            >
              취소
            </Button>
          </div>

          <div className="pt-6 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full"
            >
              {isDeleting ? '삭제 중...' : '부고장 삭제'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
