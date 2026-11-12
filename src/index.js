// sched-prod API: the incidents the status page and the board read. Contract: contract/api.md.

const json = (body, status = 200) => Response.json(body, { status });

async function feed(env) {
  const res = await fetch(env.FEED_URL);
  if (!res.ok) throw new Error(`feed answered ${res.status}`);
  const { incidents } = await res.json();
  return incidents;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/incidents') {
      return json({ incidents: await feed(env) });
    }
    return json({ error: 'not found' }, 404);
  },
};
