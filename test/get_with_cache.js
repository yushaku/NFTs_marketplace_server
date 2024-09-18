import { check } from 'k6'
import http from 'k6/http'
import { Counter } from 'k6/metrics'

export const failedRequests = new Counter('failed_requests')
const BASE_URL = 'http://localhost:8080'

export default function () {
  const response = http.get(`${BASE_URL}`, {
    headers: {
      Accepts: 'application/json',
    },
  })

  const success = check(response, {
    'GET request is successful': (r) => r.status === 200,
  })

  if (!success) failedRequests.add(1)
}
