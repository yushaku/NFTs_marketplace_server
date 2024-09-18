import { check } from 'k6'
import http from 'k6/http'
import { Counter } from 'k6/metrics'

export const failedRequests = new Counter('failed_requests')
const BASE_URL = 'http://localhost:8080'

export default function () {
  const page = Math.ceil(Math.random() * 10) + 1

  const response = http.get(
    `${BASE_URL}/users/3/posts?page=${page}&perPage=20`,
    {
      headers: {
        Accepts: 'application/json',
      },
    },
  )

  const success = check(response, {
    'GET request is successful': (r) => r.status === 200,
  })

  if (!success) failedRequests.add(1)
}
