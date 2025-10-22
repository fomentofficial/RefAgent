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

  // Template-specific styling
  const getTemplateStyles = () => {
    switch (template.id) {
      case 'classic':
        return {
          containerClass: 'max-w-2xl mx-auto p-10 rounded-none shadow-2xl',
          headerClass: 'text-center mb-12 pb-8',
          decorativeElement: '⚘',
        };
      case 'modern':
        return {
          containerClass: 'max-w-2xl mx-auto p-10 rounded-3xl shadow-lg',
          headerClass: 'text-center mb-10 pb-6',
          decorativeElement: null,
        };
      case 'elegant':
        return {
          containerClass: 'max-w-2xl mx-auto p-12 rounded-2xl shadow-xl',
          headerClass: 'text-center mb-12 pb-8',
          decorativeElement: '✿',
        };
      case 'minimal':
        return {
          containerClass: 'max-w-2xl mx-auto p-12 rounded-sm shadow-md',
          headerClass: 'text-center mb-16 pb-8',
          decorativeElement: null,
        };
      default:
        return {
          containerClass: 'max-w-2xl mx-auto p-8 rounded-lg shadow-lg',
          headerClass: 'text-center mb-8 pb-6',
          decorativeElement: null,
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div
      className={styles.containerClass}
      style={{
        backgroundColor: template.backgroundColor,
        color: template.textColor,
        fontFamily: template.fontFamily,
      }}
    >
      {/* 헤더 */}
      <div className={styles.headerClass}>
        {styles.decorativeElement && (
          <div className="text-4xl mb-4" style={{ color: template.accentColor }}>
            {styles.decorativeElement}
          </div>
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
          {notice.deceased_name}님의 별세를 알려드립니다
        </p>
      </div>

      {/* 고인 정보 */}
      <div className="mb-12">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider opacity-60">고인</p>
            <p className="text-2xl font-semibold">{notice.deceased_name}</p>
          </div>
          {notice.age && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider opacity-60">향년</p>
              <p className="text-2xl font-semibold">{notice.age}세</p>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider opacity-60">별세일시</p>
            <p className="text-sm font-light">{formatDateTime(notice.death_date)}</p>
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
            <span className="font-light">{notice.funeral_hall}</span>
          </div>

          {notice.room_number && (
            <div className="flex items-baseline">
              <span className="font-medium w-28 flex-shrink-0 opacity-70">빈소</span>
              <span className="font-light">{notice.room_number}</span>
            </div>
          )}

          <div className="flex items-baseline">
            <span className="font-medium w-28 flex-shrink-0 opacity-70">발인일시</span>
            <span className="font-light">{formatDateTime(notice.burial_date)}</span>
          </div>

          {notice.resting_place && (
            <div className="flex items-baseline">
              <span className="font-medium w-28 flex-shrink-0 opacity-70">장지</span>
              <span className="font-light">{notice.resting_place}</span>
            </div>
          )}
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
          <p className="text-xl font-light">{notice.host_name}</p>
          {notice.show_contact && notice.contact && (
            <p className="text-sm opacity-60 font-light">연락처: {notice.contact}</p>
          )}
        </div>
      </div>

      {/* 계좌 정보 */}
      {notice.show_account && notice.account_bank && (
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
            <p className="font-medium text-lg">{notice.account_bank}</p>
            <p className="text-xl font-mono tracking-wide">{notice.account_number}</p>
            <p className="text-sm opacity-60 font-light">예금주: {notice.account_holder}</p>
          </div>
        </div>
      )}

      {/* 안내문 */}
      {notice.message && (
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
            안내말씀
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed font-light">{notice.message}</p>
        </div>
      )}

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
}
