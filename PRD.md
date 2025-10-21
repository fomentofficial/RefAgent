# 🕊️ 모바일 부고장 PRD — 전화번호+비밀번호 인증 / 카카오지도 / 계좌입력 포함

## 1. 프로젝트 개요

**목적**: 누구나 3분 안에 부고장을 만들고 공유할 수 있는 초간단 모바일 서비스.

**특징**:
- 회원가입/결제 없이, 전화번호+비밀번호로 인증 및 관리 가능
- 지도: 카카오지도 API 사용(장례식장 위치 표시)
- 계좌: 상주 계좌정보 입력란 포함(부고장 하단에 표시)

## 2. 핵심 흐름

```
메인(템플릿 선택)
  ↓
정보입력 (고인정보 + 상주정보 + 계좌 + 전화번호/비밀번호)
  ↓
부고장 생성 (/notice/[uuid])
  ↓
공유 (카카오/문자/SNS)
  ↓
관리 (/owner/[uuid]/login → /manage)
```

## 3. 주요 기능

### 1) 템플릿 선택
- 카드형 디자인 3~5종 제공
- 배경색·폰트 지정 가능

### 2) 정보 입력
- 고인 이름, 별세일시, 장례식장, 빈소, 발인일시, 장지(선택)
- 상주 이름, 연락처(표시 여부 선택)
- 상주 계좌정보(은행명+계좌번호+예금주)
- 안내문(선택)
- 전화번호, 비밀번호(8자 이상) 설정

### 3) 부고장 생성
- URL 예: /notice/[uuid]
- 지도: 카카오지도 API로 장례식장 위치 표시
- 하단: 상주 연락처, 계좌정보 노출(옵션)

### 4) 공유
- 카카오톡/문자/SNS 공유 메타태그 자동 생성(OG 이미지)
- OG 제목: "[고인명]님 부고"
- OG 설명: "장소: [장례식장명], 발인: [날짜]"

### 5) 관리
- /owner/[uuid]/login (전화번호+비밀번호)
- /owner/[uuid]/manage (내용 수정, 계좌변경, 삭제)

## 4. 데이터베이스 구조 (Supabase)

### notices
```sql
- id (uuid, PK)
- template_id (text)
- deceased_name (text)
- age (int)
- death_date (timestamptz)
- funeral_hall (text)
- room_number (text)
- burial_date (timestamptz)
- resting_place (text)
- host_name (text)
- contact (text)
- account_bank (text)
- account_number (text)
- account_holder (text)
- message (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### notice_credentials
```sql
- notice_id (uuid, FK → notices.id)
- phone_e164 (text)
- password_hash (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### owner_sessions
```sql
- id (uuid, PK)
- notice_id (uuid, FK)
- expires_at (timestamptz)
- created_at (timestamptz)
```

## 5. 지도 기능 (Kakao Maps API)

- 입력된 장례식장명 기준으로 카카오맵 geocoding API 호출 → 위도/경도 저장
- /notice/[uuid] 페이지에서 Kakao Maps JavaScript SDK로 지도 렌더링
- 지도 위 마커: 장례식장명, 주소 표시
- 모바일 반응형(폭 100%, 높이 300px)

## 6. 인증 및 보안

- 인증: 전화번호(E.164)+비밀번호
- 저장: Argon2 또는 Bcrypt 해시
- 세션: HttpOnly 쿠키, 30일 만료
- 로그인 실패 5회 → 10분 잠금
- 복구: 운영자 문의만 허용(복구키 미사용)
- 연락처/계좌는 공개여부 선택 가능

## 7. 화면 구성

- **/** (메인): 템플릿 선택 리스트
- **/create**: 고인·장례·상주·계좌·비밀번호 입력, [부고장 만들기] 버튼
- **/notice/[uuid]**: 고인명, 일정, 지도, 상주정보, 계좌정보, 공유 버튼
- **/owner/[uuid]/login**: 전화번호+비밀번호 입력
- **/owner/[uuid]/manage**: 수정·삭제 가능

## 8. 기술 스택

- Next.js 15 (App Router, SSR)
- Supabase (DB/Storage)
- TailwindCSS + Shadcn/UI
- Kakao Maps API
- Vercel (배포)
- GA4 / Naver Analytics

## 9. 보존 및 운영 정책

- 생성 후 90일간 유지, 이후 비공개 처리
- hCaptcha 적용, 하루 30건 제한(IP 기준)
- 신고/삭제 요청 접수 기능 제공

## 10. KPI (MVP 목표)

- 평균 생성시간: 3분 이내
- 완료율: 85% 이상
- 공유 클릭률: 60% 이상
- 지도 로딩 성공률: 98% 이상

## 11. 개발 우선순위

1. 템플릿 선택 + 정보입력 + 계좌입력 + 지도 + 생성
2. 전화번호/비밀번호 인증 및 세션
3. 공유 메타/OG 이미지
4. 수정/삭제 기능
5. 관리자 페이지(선택)
