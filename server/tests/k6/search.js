import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.001'], // <0.1%
    http_req_duration: ['p(95)<300'],
  },
};

const BASE = __ENV.API_BASE || 'http://localhost:8787';

export default function () {
  const qs = `q=${encodeURIComponent('자양')}&limit=50&offset=0`;
  const res = http.get(`${BASE}/api/properties/search?${qs}`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
