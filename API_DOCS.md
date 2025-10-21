# API 문서

## 기본 정보

- **Base URL**: `http://localhost:3000/api` (개발), `https://yourdomain.com/api` (프로덕션)
- **Content-Type**: `application/json`
- **인증**: HttpOnly 쿠키 기반 세션

## 엔드포인트

### 부고장 생성

```http
POST /api/notices
```

#### Request Body

```json
{
  "template_id": "classic",
  "deceased_name": "홍길동",
  "age": 85,
  "death_date": "2024-01-15T10:30:00",
  "funeral_hall": "서울아산병원 장례식장",
  "room_number": "3호실",
  "burial_date": "2024-01-17T09:00:00",
  "resting_place": "하늘공원",
  "host_name": "홍철수",
  "contact": "010-1234-5678",
  "show_contact": true,
  "account_bank": "국민은행",
  "account_number": "123-456-789012",
  "account_holder": "홍철수",
  "show_account": true,
  "message": "고인의 명복을 빕니다.",
  "phone": "010-1234-5678",
  "password": "password123"
}
```

#### Response (201 Created)

```json
{
  "noticeId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Notice created successfully",
  "remaining": 29
}
```

#### Response (429 Too Many Requests)

```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

---

### 부고장 조회

```http
GET /api/notices/:id
```

#### Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "template_id": "classic",
  "deceased_name": "홍길동",
  "age": 85,
  "death_date": "2024-01-15T10:30:00Z",
  "funeral_hall": "서울아산병원 장례식장",
  "room_number": "3호실",
  "burial_date": "2024-01-17T09:00:00Z",
  "resting_place": "하늘공원",
  "host_name": "홍철수",
  "contact": "010-1234-5678",
  "show_contact": true,
  "account_bank": "국민은행",
  "account_number": "123-456-789012",
  "account_holder": "홍철수",
  "show_account": true,
  "message": "고인의 명복을 빕니다.",
  "latitude": 37.5665,
  "longitude": 126.9780,
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

#### Response (404 Not Found)

```json
{
  "error": "Notice not found"
}
```

---

### 부고장 수정

```http
PUT /api/notices/:id
```

**인증 필요**: 세션 쿠키

#### Request Body

```json
{
  "deceased_name": "홍길동",
  "age": 86,
  "death_date": "2024-01-15T10:30:00",
  "funeral_hall": "서울대병원 장례식장",
  "room_number": "5호실",
  "burial_date": "2024-01-17T09:00:00",
  "resting_place": "하늘공원",
  "host_name": "홍철수",
  "contact": "010-1234-5678",
  "show_contact": true,
  "account_bank": "국민은행",
  "account_number": "123-456-789012",
  "account_holder": "홍철수",
  "show_account": true,
  "message": "고인의 명복을 빕니다."
}
```

#### Response (200 OK)

```json
{
  "message": "Notice updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    ...
  }
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

---

### 부고장 삭제

```http
DELETE /api/notices/:id
```

**인증 필요**: 세션 쿠키

#### Response (200 OK)

```json
{
  "message": "Notice deleted successfully"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

---

### 로그인

```http
POST /api/auth/login
```

#### Request Body

```json
{
  "noticeId": "550e8400-e29b-41d4-a716-446655440000",
  "phone": "010-1234-5678",
  "password": "password123"
}
```

#### Response (200 OK)

```json
{
  "message": "Login successful",
  "noticeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

세션 쿠키가 설정됩니다.

#### Response (401 Unauthorized)

```json
{
  "error": "Invalid credentials",
  "attemptsRemaining": 4
}
```

#### Response (403 Forbidden)

```json
{
  "error": "Account is locked. Please try again later."
}
```

---

### 로그아웃

```http
POST /api/auth/logout
```

#### Response (200 OK)

```json
{
  "message": "Logged out successfully"
}
```

---

## 에러 코드

| 상태 코드 | 설명 |
|----------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 실패 |
| 403 | 권한 없음 / 계정 잠금 |
| 404 | 찾을 수 없음 |
| 429 | 요청 제한 초과 |
| 500 | 서버 오류 |

## Rate Limiting

- **제한**: IP당 하루 30건
- **윈도우**: 24시간
- **응답**: 429 Too Many Requests

## 보안

- **비밀번호**: Bcrypt 해싱 (12 rounds)
- **세션**: HttpOnly 쿠키, 30일 만료
- **전화번호**: E.164 형식으로 정규화
- **로그인 제한**: 5회 실패 시 10분 잠금
- **CORS**: 설정된 도메인만 허용

## 예제

### cURL

```bash
# 부고장 생성
curl -X POST http://localhost:3000/api/notices \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "classic",
    "deceased_name": "홍길동",
    "age": 85,
    "death_date": "2024-01-15T10:30:00",
    "funeral_hall": "서울아산병원 장례식장",
    "burial_date": "2024-01-17T09:00:00",
    "host_name": "홍철수",
    "phone": "010-1234-5678",
    "password": "password123"
  }'

# 로그인
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "noticeId": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "010-1234-5678",
    "password": "password123"
  }'

# 부고장 수정
curl -X PUT http://localhost:3000/api/notices/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "deceased_name": "홍길동",
    "age": 86,
    ...
  }'
```

### JavaScript (Fetch)

```javascript
// 부고장 생성
const response = await fetch('/api/notices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    template_id: 'classic',
    deceased_name: '홍길동',
    age: 85,
    death_date: '2024-01-15T10:30:00',
    funeral_hall: '서울아산병원 장례식장',
    burial_date: '2024-01-17T09:00:00',
    host_name: '홍철수',
    phone: '010-1234-5678',
    password: 'password123',
  }),
});

const data = await response.json();
console.log(data.noticeId);

// 로그인
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 쿠키 포함
  body: JSON.stringify({
    noticeId: '550e8400-e29b-41d4-a716-446655440000',
    phone: '010-1234-5678',
    password: 'password123',
  }),
});
```
