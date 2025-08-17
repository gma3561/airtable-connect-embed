# API 명세서 - 부동산 매물 관리 시스템

## 개요

**Base URL**: `https://api.airtable-connect.com`  
**Version**: 1.0  
**Protocol**: HTTPS  
**Content-Type**: application/json  
**Authentication**: Bearer Token (Supabase Auth)

## 인증

모든 API 요청은 Authorization 헤더에 Bearer 토큰을 포함해야 합니다.

```
Authorization: Bearer <access_token>
```

## API 엔드포인트

### 1. 매물 관리

#### 1.1 매물 목록 조회

**Endpoint**: `GET /api/properties`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | No | 통합 검색어 (매물명, 동, 주소) |
| propertyType | string | No | 매물 종류 필터 |
| transactionType | string | No | 거래 유형 필터 |
| propertyStatus | string | No | 매물 상태 필터 |
| agent | string | No | 담당자 필터 |
| sharedOnly | boolean | No | 공유 매물만 조회 |
| limit | number | No | 페이지당 항목 수 (기본: 50, 최대: 100) |
| offset | number | No | 시작 위치 (기본: 0) |
| sortBy | string | No | 정렬 기준 (registrationDate, price, propertyName) |
| sortOrder | string | No | 정렬 순서 (asc, desc) |

**Response**: `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "registrationDate": "2025-08-15",
      "sharedStatus": true,
      "agent": "박소현",
      "propertyStatus": "거래가능",
      "propertyType": "아파트",
      "transactionType": "매매",
      "price": "15억",
      "propertyName": "롯데캐슬이스트폴",
      "buildingDong": "102",
      "buildingHo": "4704",
      "address": "자양동 680-63",
      "areaSupplySqm": "180.16",
      "areaExclusiveSqm": "138.52",
      "areaSupplyPy": "54.49",
      "areaExclusivePy": "41.9",
      "floor": "47",
      "floorsTotal": "48",
      "updatedAt": "2025-08-15T10:30:00Z"
    }
  ],
  "total": 2562,
  "page": 1,
  "pageSize": 50,
  "totalPages": 52
}
```

#### 1.2 매물 상세 조회

**Endpoint**: `GET /api/properties/:id`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 매물 ID (UUID) |

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "registrationDate": "2025-08-15",
  "sharedStatus": true,
  "agent": "박소현",
  "propertyStatus": "거래가능",
  "propertyType": "아파트",
  "transactionType": "월세",
  "price": "5억/100",
  "propertyName": "롯데캐슬이스트폴",
  "buildingDong": "102",
  "buildingHo": "4704",
  "address": "자양동 680-63",
  "contractPeriod": "2년",
  "rentalAmount": "0/1050",
  "rentalType": "월세",
  "resident": "임차인",
  "completionDate": null,
  "reregistrationReason": null,
  "agentMemo": "양도세 관련 메모",
  "specialNotes": "고급풀옵션, 거실전면 통창",
  "photos": ["url1", "url2"],
  "videos": ["url3"],
  "documents": ["url4"],
  "areaSupplySqm": "180.16",
  "areaExclusiveSqm": "138.52",
  "areaSupplyPy": "54.49",
  "areaExclusivePy": "41.9",
  "floor": "47",
  "floorsTotal": "48",
  "createdAt": "2025-08-15T09:00:00Z",
  "updatedAt": "2025-08-15T10:30:00Z"
}
```

#### 1.3 매물 등록

**Endpoint**: `POST /api/properties`

**Request Body**:
```json
{
  "propertyName": "롯데캐슬이스트폴",
  "address": "자양동 680-63",
  "buildingDong": "102",
  "buildingHo": "4704",
  "propertyType": "아파트",
  "transactionType": "매매",
  "propertyStatus": "거래가능",
  "price": "15억",
  "contractPeriod": null,
  "rentalAmount": null,
  "rentalType": null,
  "resident": null,
  "completionDate": null,
  "reregistrationReason": null,
  "agentMemo": "양도세 관련 메모",
  "specialNotes": "고급풀옵션",
  "registrationDate": "2025-08-15",
  "sharedStatus": true,
  "agent": "박소현"
}
```

**Response**: `201 Created`
```json
{
  "id": "new-uuid",
  "propertyName": "롯데캐슬이스트폴",
  "createdAt": "2025-08-15T11:00:00Z"
}
```

#### 1.4 매물 수정

**Endpoint**: `PUT /api/properties/:id`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 매물 ID (UUID) |

**Request Body**: 수정할 필드만 포함
```json
{
  "propertyStatus": "거래완료",
  "completionDate": "2025-08-16",
  "resident": "임차인"
}
```

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "propertyName": "롯데캐슬이스트폴",
  "propertyStatus": "거래완료",
  "updatedAt": "2025-08-16T14:00:00Z"
}
```

#### 1.5 매물 삭제

**Endpoint**: `DELETE /api/properties/:id`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 매물 ID (UUID) |

**Response**: `204 No Content`

### 2. 검색 및 필터

#### 2.1 통합 검색

**Endpoint**: `GET /api/search`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | 검색어 (최소 2자) |
| type | string | No | 검색 대상 (all, propertyName, address, dong) |
| limit | number | No | 결과 수 제한 (기본: 20) |

**Response**: `200 OK`
```json
{
  "results": [
    {
      "id": "uuid",
      "propertyName": "롯데캐슬이스트폴",
      "address": "자양동 680-63",
      "buildingDong": "102",
      "buildingHo": "4704",
      "matchType": "propertyName",
      "score": 0.95
    }
  ],
  "total": 15,
  "query": "롯데"
}
```

#### 2.2 필터 옵션 조회

**Endpoint**: `GET /api/search/filters`

**Response**: `200 OK`
```json
{
  "propertyTypes": [
    "아파트", "주상복합", "빌라/연립", "오피스텔", "단독주택"
  ],
  "transactionTypes": [
    "분양", "매매", "전세", "월세/렌트", "단기"
  ],
  "propertyStatuses": [
    "거래가능", "거래완료", "거래보류", "거래철회"
  ],
  "agents": [
    "박소현", "정선혜", "송영주", "정윤식", "성은미"
  ]
}
```

### 3. 사용자 인증

#### 3.1 로그인

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "sso@the-realty.co.kr",
  "password": "password123"
}
```

**Response**: `200 OK`
```json
{
  "user": {
    "id": "user-uuid",
    "email": "sso@the-realty.co.kr",
    "name": "박소현",
    "role": "agent"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

#### 3.2 로그아웃

**Endpoint**: `POST /api/auth/logout`

**Response**: `200 OK`
```json
{
  "message": "Successfully logged out"
}
```

#### 3.3 현재 사용자 정보

**Endpoint**: `GET /api/users/me`

**Response**: `200 OK`
```json
{
  "id": "user-uuid",
  "email": "sso@the-realty.co.kr",
  "name": "박소현",
  "role": "agent",
  "permissions": [
    "property.read",
    "property.create",
    "property.update.own"
  ]
}
```

### 4. 광고 관리 (백오피스 전용)

#### 4.1 광고 등록

**Endpoint**: `POST /api/advertisements`

**Request Body**:
```json
{
  "propertyId": "property-uuid",
  "adNumber": "AD-2025-001",
  "adStatus": "활성",
  "adPlatform": "부동산114",
  "adPeriod": "2025-08-15 ~ 2025-09-15"
}
```

**Response**: `201 Created`
```json
{
  "id": "ad-uuid",
  "propertyId": "property-uuid",
  "adNumber": "AD-2025-001",
  "createdAt": "2025-08-15T15:00:00Z"
}
```

#### 4.2 광고 목록 조회

**Endpoint**: `GET /api/advertisements`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| propertyId | string | No | 매물 ID로 필터링 |
| adStatus | string | No | 광고 상태 필터 |
| backofficeUserId | string | No | 백오피스 담당자 필터 |

**Response**: `200 OK`
```json
{
  "items": [
    {
      "id": "ad-uuid",
      "propertyId": "property-uuid",
      "propertyName": "롯데캐슬이스트폴",
      "adNumber": "AD-2025-001",
      "adStatus": "활성",
      "adPlatform": "부동산114",
      "adPeriod": "2025-08-15 ~ 2025-09-15",
      "backofficeUser": "송효경",
      "createdAt": "2025-08-15T15:00:00Z"
    }
  ],
  "total": 1847
}
```

## 에러 응답

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 에러 메시지",
    "details": {
      "field": "추가 정보"
    }
  }
}
```

### 에러 코드

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | 인증되지 않은 요청 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스를 찾을 수 없음 |
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| DUPLICATE_ENTRY | 409 | 중복된 데이터 |
| SERVER_ERROR | 500 | 서버 내부 오류 |

## Rate Limiting

- 인증된 사용자: 분당 100 요청
- 인증되지 않은 사용자: 분당 20 요청

Rate limit 정보는 응답 헤더에 포함됩니다:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1629360000
```

## CORS 정책

다음 도메인에서의 요청을 허용합니다:
- https://airtable-connect.com
- https://app.airtable-connect.com
- http://localhost:3000 (개발 환경)

## 페이지네이션

목록 조회 API는 다음 형식의 페이지네이션을 지원합니다:

**Query Parameters**:
- `limit`: 페이지당 항목 수 (기본: 50, 최대: 100)
- `offset`: 시작 위치 (기본: 0)

**Response Headers**:
```
X-Total-Count: 2562
X-Page-Count: 52
```

## 필드 선택

특정 필드만 조회하려면 `fields` 파라미터를 사용합니다:

```
GET /api/properties?fields=id,propertyName,price,propertyStatus
```

## 웹훅 (향후 구현)

특정 이벤트 발생 시 등록된 URL로 알림을 전송합니다:

- property.created
- property.updated
- property.deleted
- property.status_changed

---

*이 API 명세서는 지속적으로 업데이트됩니다. 최신 버전은 항상 이 문서를 참조하세요.*