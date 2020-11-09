import http from 'k6/http';
import { check } from 'k6';
export let options = {
  discardResponseBodies: true,
  scenarios: {
    ramping: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 2000,
      stages: [
        { duration: '10m', target: 500 },
      ],
    },
  },
};

export default function () {
  var id = 9000000 + Math.floor(Math.random() * 1000000);
  var res = http.get(`http://localhost:3000/hostInfo/${id}`, {
    tags: { name: 'PostsItemURL' },
  });
  check(res, { 'status was 200': (r) => r.status == 200 });
}