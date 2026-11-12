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

    // New endpoint: fetch a single incident by id
    if (request.method === 'GET' && url.pathname.startsWith('/incidents/')) {
      const id = url.pathname.split('/')[2];
      const incidents = await feed(env);
      const incident = incidents.find(i => i.id === id);
      if (!incident) return json({ error: 'not found' }, 404);
      return json({ incident });
    }

    // Existing endpoint: list all incidents (newest first per contract)
    if (request.method === 'GET' && url.pathname === '/incidents') {
      return json({ incidents: await feed(env) });
    }

    // Fallback for any other route
    return json({ error: 'not found' }, 404);
  },
};
