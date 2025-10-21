# 🚀 배포 가이드

## Vercel 배포 (권장)

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com) 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 Import

### 2. 환경변수 설정

Vercel Dashboard → Settings → Environment Variables

```env
# Production 환경변수
NODE_ENV=production

# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Kakao API
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your_kakao_key

# App URL (중요!)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=30
RATE_LIMIT_WINDOW_HOURS=24

# Session
SESSION_DURATION_DAYS=30
```

**주의사항:**
- `NEXT_PUBLIC_APP_URL`을 실제 배포 URL로 변경하세요
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출하면 안 됩니다

### 3. Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com) 접속
2. 애플리케이션 선택
3. "플랫폼" → "Web 플랫폼" 추가
4. 사이트 도메인 추가:
   ```
   https://your-domain.vercel.app
   ```

### 4. 배포

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 배포
vercel --prod
```

또는 GitHub에 push하면 자동 배포됩니다.

### 5. 배포 후 확인

- [ ] 메인 페이지 접속
- [ ] 부고장 생성 테스트
- [ ] 카카오맵 로딩 확인
- [ ] 공유 기능 테스트
- [ ] OG 메타태그 확인 (카카오톡 공유 시)

## 다른 플랫폼 배포

### Netlify

1. Netlify에서 프로젝트 Import
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. 환경변수 설정 (Vercel과 동일)
4. 배포

### Docker

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# 빌드
docker build -t mobile-obituary .

# 실행
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e NEXT_PUBLIC_KAKAO_MAP_APP_KEY=... \
  -e NEXT_PUBLIC_APP_URL=... \
  mobile-obituary
```

## Supabase 프로덕션 설정

### 1. 프로덕션 인스턴스 생성

1. Supabase Dashboard에서 새 프로젝트 생성
2. 리전 선택 (Seoul 권장)
3. 데이터베이스 비밀번호 설정

### 2. 마이그레이션 실행

1. SQL Editor 열기
2. `supabase/migrations/20240101000000_initial_schema.sql` 내용 복사
3. 실행

### 3. RLS 정책 확인

```sql
-- notices 테이블 RLS 확인
SELECT * FROM pg_policies WHERE tablename = 'notices';

-- 정책이 활성화되어 있는지 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 4. 정기 정리 작업 설정

Supabase에서 Cron 함수 설정:

```sql
-- 매일 자정 실행
SELECT cron.schedule(
  'cleanup-expired-sessions',
  '0 0 * * *',
  $$SELECT cleanup_expired_sessions()$$
);

-- 매일 자정 실행
SELECT cron.schedule(
  'deactivate-old-notices',
  '0 0 * * *',
  $$SELECT deactivate_old_notices()$$
);
```

## 도메인 설정

### Vercel 커스텀 도메인

1. Vercel Dashboard → Settings → Domains
2. 도메인 추가
3. DNS 레코드 설정:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### Kakao Developers 도메인 업데이트

1. Kakao Developers → 애플리케이션 선택
2. 플랫폼 → Web 플랫폼 편집
3. 사이트 도메인 추가:
   ```
   https://yourdomain.com
   ```

## SSL/TLS 인증서

Vercel은 자동으로 SSL 인증서를 발급합니다.

커스텀 서버 사용 시:
- Let's Encrypt 사용 권장
- Certbot으로 자동 갱신 설정

## 모니터링 및 로깅

### Vercel Analytics (권장)

1. Vercel Dashboard → Analytics 탭
2. Enable Analytics
3. 성능 지표 모니터링

### Sentry (에러 추적)

```bash
npm install @sentry/nextjs
```

`.env.production`:
```env
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Google Analytics

`.env.production`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

`src/app/layout.tsx`에 추가:
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

## 성능 최적화

### 1. 이미지 최적화

Next.js Image 컴포넌트 사용:
```tsx
import Image from 'next/image';

<Image
  src="/og-image.png"
  width={1200}
  height={630}
  alt="부고장"
/>
```

### 2. 캐싱 전략

Vercel은 자동으로 정적 자산을 캐싱합니다.

추가 설정:
```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' }
        ]
      }
    ]
  }
}
```

### 3. Database Connection Pooling

Supabase는 자동으로 connection pooling을 제공합니다.

## 백업 및 복구

### Supabase 백업

1. Supabase Dashboard → Database → Backups
2. 자동 백업 활성화 (Pro 플랜)
3. 수동 백업:
   ```bash
   pg_dump -h db.xxx.supabase.co -U postgres > backup.sql
   ```

### 코드 백업

GitHub에 모든 코드가 백업됩니다.

## 보안 체크리스트

### 프로덕션 배포 전

- [ ] 모든 환경변수 설정 확인
- [ ] `NODE_ENV=production` 설정
- [ ] `NEXT_PUBLIC_APP_URL` 프로덕션 URL로 변경
- [ ] HTTPS 활성화 확인
- [ ] CORS 정책 확인
- [ ] Rate limiting 동작 확인
- [ ] RLS 정책 활성화 확인
- [ ] 비밀번호 해싱 확인
- [ ] 세션 쿠키 Secure 플래그 확인

### 정기 점검 (월 1회)

- [ ] Supabase 백업 확인
- [ ] 로그 분석
- [ ] 성능 지표 확인
- [ ] 의존성 업데이트
- [ ] 보안 취약점 점검

## 트러블슈팅

### 1. 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 에러 확인
npm run type-check
```

### 2. 환경변수 오류

- Vercel Dashboard에서 환경변수 재확인
- `NEXT_PUBLIC_` 접두사 확인
- 배포 후 새로운 환경변수 추가 시 재배포 필요

### 3. Kakao Maps 로딩 실패

- Kakao Developers에서 도메인 등록 확인
- JavaScript 키 확인
- 브라우저 콘솔 에러 확인

### 4. Supabase 연결 오류

- API 키 확인
- RLS 정책 확인
- 네트워크 방화벽 확인

## 비용 최적화

### Vercel
- Free Tier: 취미 프로젝트에 충분
- Pro ($20/월): 상용 서비스 권장

### Supabase
- Free Tier: 500MB 데이터, 2GB 전송
- Pro ($25/월): 8GB 데이터, 100GB 전송

### 예상 비용 (월간)
- 100 부고장/월: Free Tier 가능
- 1000 부고장/월: Pro 플랜 권장

## 확장성

### 1. Database Scaling
- Supabase Pro로 업그레이드
- Read Replica 추가 (고급)

### 2. CDN
- Vercel Edge Network 자동 사용
- Cloudflare 추가 (선택)

### 3. Serverless Functions
- Next.js API Routes는 자동으로 serverless
- 별도 설정 불필요

---

**배포 완료 후 반드시 TESTING_CHECKLIST.md의 모든 항목을 테스트하세요!**
