# 설정 가이드

이 문서는 모바일 부고장 서비스를 로컬 환경에서 실행하기 위한 상세한 설정 가이드입니다.

## 1. 사전 요구사항

- Node.js 20.x 이상
- npm 또는 yarn
- Supabase 계정
- Kakao Developers 계정

## 2. Supabase 설정

### 2.1 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (추천: Northeast Asia - Seoul)

### 2.2 데이터베이스 마이그레이션

1. Supabase 대시보드에서 "SQL Editor" 메뉴 선택
2. `supabase/migrations/20240101000000_initial_schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기 후 "Run" 실행

### 2.3 API 키 확인

1. Supabase 대시보드에서 "Settings" > "API" 메뉴 선택
2. 다음 값들을 복사:
   - Project URL
   - anon public key
   - service_role key (보안 주의!)

## 3. Kakao Maps API 설정

### 3.1 애플리케이션 생성

1. [Kakao Developers](https://developers.kakao.com)에 로그인
2. "내 애플리케이션" > "애플리케이션 추가하기"
3. 앱 이름, 회사명 입력 후 저장

### 3.2 플랫폼 등록

1. 생성한 앱 선택
2. "플랫폼" > "Web 플랫폼 등록"
3. 사이트 도메인 입력:
   - 개발: `http://localhost:3000`
   - 프로덕션: 실제 도메인

### 3.3 JavaScript 키 확인

1. "앱 설정" > "앱 키" 메뉴 선택
2. "JavaScript 키" 복사

## 4. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Kakao Maps API
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your-javascript-key

# Analytics (선택사항)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_NAVER_ANALYTICS_ID=

# hCaptcha (선택사항)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET_KEY=

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 5. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 린트 실행
npm run lint

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 6. 배포 (Vercel)

### 6.1 Vercel 설정

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" > GitHub 저장소 연결
3. 환경변수 설정:
   - `.env.example`의 모든 변수를 Vercel 환경변수로 추가
   - `NEXT_PUBLIC_APP_URL`을 Vercel 도메인으로 변경

### 6.2 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

## 7. 주의사항

### 보안

- ⚠️ `SUPABASE_SERVICE_ROLE_KEY`는 **절대** 클라이언트에 노출하지 마세요
- ⚠️ `.env` 파일은 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- ⚠️ 프로덕션 환경에서는 HTTPS를 사용하세요

### Supabase RLS

- 모든 테이블에 Row Level Security(RLS)가 활성화되어 있습니다
- `service_role` 키를 사용하는 API는 서버 사이드에서만 실행되어야 합니다

### 카카오맵

- 카카오맵 API는 등록된 도메인에서만 동작합니다
- 로컬 개발 시 `http://localhost:3000`을 반드시 등록하세요

## 8. 문제 해결

### Supabase 연결 오류

```
Error: Invalid Supabase URL
```

**해결**: `.env` 파일에서 `NEXT_PUBLIC_SUPABASE_URL` 확인

### 카카오맵 로딩 실패

```
Failed to load Kakao Maps API
```

**해결**:
1. Kakao Developers에서 플랫폼 등록 확인
2. JavaScript 키 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 타입 오류

```
Type error: Cannot find module '@/...'
```

**해결**:
```bash
# TypeScript 재컴파일
rm -rf .next
npm run dev
```

## 9. 다음 단계

기본 설정이 완료되었다면, 다음 기능들을 구현하세요:

1. ✅ 템플릿 선택 및 부고장 생성 (완료)
2. 🚧 부고장 조회 페이지 (`/notice/[uuid]`)
3. 🚧 카카오맵 연동
4. 🚧 관리자 로그인 (`/owner/[uuid]/login`)
5. 🚧 부고장 수정/삭제 (`/owner/[uuid]/manage`)
6. 🚧 공유 기능 (OG 메타태그)

개발 우선순위는 `PRD.md`의 11번 항목을 참고하세요.
