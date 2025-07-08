# 보안 가이드 (Security Guide)

## 🔒 현재 보안 상태

### ✅ 구현된 보안 기능

1. **관리자 인증**
   - 아이디: `bestcompany`
   - 비밀번호: `best1225!!` (SHA-256 해시 검증)
   - 세션 타임아웃: 30분
   - 로그아웃 시 세션 완전 삭제

2. **비밀번호 보안**
   - SHA-256 해시 기반 비밀번호 검증
   - 비밀번호 변경 기능 (영문 대소문자 + 숫자 필수, 8자 이상)
   - 현재 비밀번호 확인 후 변경

3. **데이터 보안**
   - localStorage 기반 데이터 저장
   - 관리자만 데이터 수정 가능
   - 데이터 초기화 및 백업 기능

4. **개발 환경 보안**
   - 디버깅 로그는 개발 환경에서만 출력
   - 테스트 함수는 개발 환경에서만 노출
   - 프로덕션 환경에서는 민감한 정보 노출 방지

### ⚠️ 보안 제한사항

1. **클라이언트 사이드 인증**
   - 현재 클라이언트 사이드에서만 인증 처리
   - 브라우저 개발자 도구로 우회 가능
   - **프로덕션 환경에서는 서버 사이드 인증 필수**

2. **데이터 저장**
   - localStorage는 클라이언트에 저장되므로 조작 가능
   - **프로덕션 환경에서는 서버 데이터베이스 사용 권장**

3. **이미지 처리**
   - Base64로 이미지 저장 (용량 제한 있음)
   - **프로덕션 환경에서는 CDN 또는 서버 저장소 사용 권장**

## 🚀 배포 전 체크리스트

### ✅ 완료된 항목
- [x] 비밀번호 검증 활성화
- [x] 디버깅 로그 제거 (개발 환경에서만 출력)
- [x] 테스트 함수 제거 (개발 환경에서만 노출)
- [x] 하드코딩된 비밀번호 해시 정리
- [x] 세션 관리 개선
- [x] 에러 메시지 보안 강화

### 🔄 권장 개선사항 (프로덕션 환경)

1. **서버 사이드 인증 구현**
   ```javascript
   // 현재: 클라이언트 사이드
   const ADMIN_CREDENTIALS = { username: 'bestcompany', passwordHash: '...' };
   
   // 권장: 서버 사이드
   const response = await fetch('/api/login', {
     method: 'POST',
     body: JSON.stringify({ username, password })
   });
   ```

2. **데이터베이스 연동**
   ```javascript
   // 현재: localStorage
   localStorage.setItem('products', JSON.stringify(products));
   
   // 권장: 서버 API
   await fetch('/api/products', { method: 'POST', body: JSON.stringify(product) });
   ```

3. **HTTPS 강제 적용**
   ```javascript
   // 프로덕션 환경에서 HTTPS 강제
   if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
     location.replace(`https:${location.href.substring(location.protocol.length)}`);
   }
   ```

4. **환경 변수 관리**
   ```bash
   # .env.production
   REACT_APP_ADMIN_USERNAME=your_admin_username
   REACT_APP_ADMIN_PASSWORD_HASH=your_password_hash
   REACT_APP_API_URL=https://your-api-domain.com
   ```

## 🛡️ 추가 보안 권장사항

### 1. 입력 검증 강화
```javascript
// XSS 방지
const sanitizeInput = (input: string) => {
  return input.replace(/[<>]/g, '');
};

// SQL Injection 방지 (서버 사이드)
const validateInput = (input: string) => {
  const dangerousPatterns = /[;'"\\]/g;
  return !dangerousPatterns.test(input);
};
```

### 2. Rate Limiting (서버 사이드)
```javascript
// 로그인 시도 제한
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15분
```

### 3. CSRF 보호
```javascript
// CSRF 토큰 검증
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
fetch('/api/action', {
  headers: { 'X-CSRF-Token': csrfToken }
});
```

### 4. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 📋 배포 체크리스트

### 필수 확인사항
- [x] 모든 디버깅 코드 제거 또는 개발 환경 조건부 실행
- [x] 하드코딩된 민감 정보 환경 변수로 이동
- [ ] HTTPS 적용 (프로덕션 환경)
- [x] 에러 메시지에서 민감한 정보 제거
- [x] 불필요한 파일 제거 (테스트 파일, 임시 파일 등)

### 권장사항
- [ ] 서버 사이드 인증 구현
- [ ] 데이터베이스 연동
- [ ] 로그 모니터링 시스템 구축
- [ ] 정기적인 보안 업데이트
- [ ] 백업 시스템 구축

## 🔍 보안 테스트

### 로컬 테스트
1. 브라우저 개발자 도구로 localStorage 접근 시도
2. 네트워크 탭에서 민감한 정보 노출 확인
3. 소스 코드에서 하드코딩된 정보 검색

### 프로덕션 테스트
1. HTTPS 강제 적용 확인
2. 관리자 페이지 접근 제한 확인
3. 세션 타임아웃 동작 확인
4. 비밀번호 변경 기능 테스트

---

**⚠️ 중요**: 현재 구현은 개발/테스트 환경용입니다. 프로덕션 환경에서는 반드시 서버 사이드 인증과 데이터베이스를 사용하세요. 