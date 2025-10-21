'use client';

import { Notice } from '@/types';
import { getTemplateById } from '@/lib/templates';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NoticeTemplateProps {
  notice: Notice;
}

export default function NoticeTemplate({ notice }: NoticeTemplateProps) {
  const template = getTemplateById(notice.template_id);

  if (!template) {
    return <div>템플릿을 찾을 수 없습니다.</div>;
  }

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'yyyy년 M월 d일 (E) a h시 mm분', {
        locale: ko,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg"
      style={{
        backgroundColor: template.backgroundColor,
        color: template.textColor,
        fontFamily: template.fontFamily,
      }}
    >
      {/* 헤더 */}
      <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: template.accentColor }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: template.accentColor }}>
          부 고
        </h1>
        <p className="text-lg">
          {notice.deceased_name}님의 별세를 알려드립니다
        </p>
      </div>

      {/* 고인 정보 */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-sm opacity-70 mb-1">고인</p>
            <p className="text-xl font-semibold">{notice.deceased_name}</p>
          </div>
          {notice.age && (
            <div>
              <p className="text-sm opacity-70 mb-1">향년</p>
              <p className="text-xl font-semibold">{notice.age}세</p>
            </div>
          )}
          <div>
            <p className="text-sm opacity-70 mb-1">별세일시</p>
            <p className="text-sm">{formatDateTime(notice.death_date)}</p>
          </div>
        </div>
      </div>

      {/* 장례 정보 */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: template.textColor + '05' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: template.accentColor }}>
          장례 안내
        </h2>

        <div className="space-y-3">
          <div className="flex">
            <span className="font-semibold w-24 flex-shrink-0">장례식장</span>
            <span>{notice.funeral_hall}</span>
          </div>

          {notice.room_number && (
            <div className="flex">
              <span className="font-semibold w-24 flex-shrink-0">빈소</span>
              <span>{notice.room_number}</span>
            </div>
          )}

          <div className="flex">
            <span className="font-semibold w-24 flex-shrink-0">발인일시</span>
            <span>{formatDateTime(notice.burial_date)}</span>
          </div>

          {notice.resting_place && (
            <div className="flex">
              <span className="font-semibold w-24 flex-shrink-0">장지</span>
              <span>{notice.resting_place}</span>
            </div>
          )}
        </div>
      </div>

      {/* 상주 정보 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: template.accentColor }}>
          상주
        </h2>
        <div className="space-y-2">
          <p className="text-lg">{notice.host_name}</p>
          {notice.show_contact && notice.contact && (
            <p className="text-sm opacity-70">연락처: {notice.contact}</p>
          )}
        </div>
      </div>

      {/* 계좌 정보 */}
      {notice.show_account && notice.account_bank && (
        <div className="mb-8 p-6 rounded-lg border-2" style={{ borderColor: template.accentColor }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: template.accentColor }}>
            부의금 계좌
          </h2>
          <div className="space-y-2">
            <p className="font-semibold">{notice.account_bank}</p>
            <p className="text-lg font-mono">{notice.account_number}</p>
            <p className="text-sm opacity-70">예금주: {notice.account_holder}</p>
          </div>
        </div>
      )}

      {/* 안내문 */}
      {notice.message && (
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: template.textColor + '05' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: template.accentColor }}>
            안내말씀
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed">{notice.message}</p>
        </div>
      )}

      {/* 푸터 */}
      <div className="text-center pt-6 border-t" style={{ borderColor: template.accentColor }}>
        <p className="text-sm opacity-70">
          고인의 명복을 빕니다
        </p>
      </div>
    </div>
  );
}
