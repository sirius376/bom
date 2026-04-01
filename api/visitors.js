const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command) {
  const res = await fetch(`${REDIS_URL}/${command.join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (req.method === 'POST') {
      // 방문자 +1 증가 (최초 접속시)
      const count = await redis(['INCR', 'bomgoat:visitors']);
      res.status(200).json({ count });
    } else {
      // 현재 값만 읽기 (10초마다 갱신용)
      const count = await redis(['GET', 'bomgoat:visitors']);
      res.status(200).json({ count: parseInt(count || 0) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
