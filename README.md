# 🕊️ 모바일 부고장 서비스

누구나 3분 안에 부고장을 만들고 공유할 수 있는 초간단 모바일 서비스입니다.

## 주요 기능

- ✅ **간편 인증**: 회원가입 없이 전화번호+비밀번호로 인증 및 관리
- 🗺️ **카카오지도**: 장례식장 위치 자동 표시
- 💳 **계좌정보**: 상주 계좌정보 입력 및 공개 설정
- 📱 **손쉬운 공유**: 카카오톡, 문자, SNS 공유 메타태그 자동 생성
- ✏️ **간편 관리**: 언제든지 내용 수정 및 삭제 가능
- 🎨 **다양한 템플릿**: 4가지 스타일의 부고장 템플릿 제공

## 기술 스택

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS, Shadcn/UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Bcrypt (Phone + Password)
- **Maps**: Kakao Maps API
- **Deployment**: Vercel

## 프로젝트 구조

```
RefAgent/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── create/          # 부고장 생성 페이지
│   │   ├── notice/          # 부고장 조회 페이지
│   │   ├── owner/           # 관리자 로그인/관리 페이지
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # 메인 페이지 (템플릿 선택)
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # Shadcn UI 컴포넌트
│   │   └── templates/       # 부고장 템플릿 컴포넌트
│   ├── lib/
│   │   ├── supabase.ts      # Supabase 클라이언트
│   │   ├── auth.ts          # 인증 관련 유틸리티
│   │   ├── kakao-map.ts     # 카카오맵 API 유틸리티
│   │   └── templates.ts     # 템플릿 정의
│   ├── types/
│   │   └── index.ts         # TypeScript 타입 정의
│   └── utils/
│       └── cn.ts            # 클래스명 유틸리티
├── supabase/
│   └── migrations/          # 데이터베이스 마이그레이션
├── PRD.md                   # 프로젝트 요구사항 문서
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
```

### 2. 환경변수 구성

`.env` 파일을 열고 다음 값을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Kakao Maps API
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your_kakao_map_app_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase 데이터베이스 설정

Supabase 프로젝트를 생성한 후, `supabase/migrations/20240101000000_initial_schema.sql` 파일의 SQL을 실행하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 데이터베이스 구조

### notices
부고장 정보를 저장하는 메인 테이블
- 고인 정보 (이름, 향년, 별세일시)
- 장례 정보 (장례식장, 빈소, 발인일시, 장지)
- 상주 정보 (이름, 연락처, 공개여부)
- 계좌 정보 (은행, 계좌번호, 예금주, 공개여부)
- 지도 정보 (위도, 경도)
- 메타데이터 (생성일, 수정일, 활성 여부)

### notice_credentials
부고장 관리를 위한 인증 정보
- 전화번호 (E.164 형식)
- 비밀번호 해시 (Bcrypt)
- 로그인 시도 횟수 및 잠금 정보

### owner_sessions
관리자 세션 정보
- 세션 토큰
- 만료 시간 (30일)

### rate_limits
IP 기반 요청 제한
- 하루 30건 제한

## 주요 페이지

### 1. 메인 페이지 (`/`)
- 템플릿 선택 화면
- 4가지 스타일 제공 (클래식, 모던, 우아한, 미니멀)

### 2. 부고장 생성 (`/create`)
- 고인 정보 입력
- 장례 정보 입력
- 상주 정보 및 계좌 정보 입력
- 관리자 인증 정보 설정 (전화번호 + 비밀번호)

### 3. 부고장 조회 (`/notice/[uuid]`)
- 부고장 내용 표시
- 카카오지도로 장례식장 위치 표시
- 공유 버튼 (카카오톡, 문자, SNS)
- OG 메타태그 자동 생성

### 4. 관리자 로그인 (`/owner/[uuid]/login`)
- 전화번호 + 비밀번호 인증
- 5회 실패 시 10분 잠금

### 5. 부고장 관리 (`/owner/[uuid]/manage`)
- 내용 수정
- 삭제

## 보안 기능

- ✅ Bcrypt를 이용한 비밀번호 해시 (SALT_ROUNDS: 12)
- ✅ 전화번호 E.164 형식 정규화
- ✅ HttpOnly 쿠키 세션 (30일 만료)
- ✅ 로그인 실패 5회 시 10분 잠금
- ✅ IP 기반 요청 제한 (하루 30건)
- ✅ Row Level Security (RLS) 정책 적용

## 운영 정책

- 📅 **보존 기간**: 생성 후 90일간 유지, 이후 비공개 처리
- 🚫 **요청 제한**: IP 기반 하루 30건 제한
- 📮 **신고/삭제**: 요청 접수 기능 제공 (예정)

## API 라우트

### POST `/api/notices`
부고장 생성

### GET `/api/notices/[id]`
부고장 조회

### POST `/api/auth/login`
관리자 로그인

### PUT `/api/notices/[id]`
부고장 수정 (인증 필요)

### DELETE `/api/notices/[id]`
부고장 삭제 (인증 필요)

## 개발 우선순위

1. ✅ 프로젝트 초기 설정 및 기본 구조
2. 🚧 템플릿 선택 + 정보입력 + 계좌입력 + 지도 + 생성
3. 🚧 전화번호/비밀번호 인증 및 세션
4. 🚧 공유 메타/OG 이미지
5. 🚧 수정/삭제 기능
6. 🚧 관리자 페이지 (선택)

## 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
