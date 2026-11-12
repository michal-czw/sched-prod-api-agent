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

    // New endpoint: GET /incidents/{id}
    if (request.method === 'GET' && /^\/incidents\/[^\/]+$/.test(url.pathname)) {
      const id = url.pathname.split('/')[2];
      const incidents = await feed(env);
      const incident = incidents.find(i => i.id === id);
      if (incident) {
        return json({ incident });
      }
      return json({ error: 'not found' }, 404);
    }

    if (request.method === 'GET' && url.pathname === '/incidents') {
      let incidents = await feed(env);

      // --- since (additive read) ---
      const since = url.searchParams.get('since');
      if (since !== null) {
        const sinceDate = new Date(since);
        if (isNaN(sinceDate.getTime())) {
          return json({ error: 'invalid since parameter' }, 400);
        }
        incidents = incidents.filter(i => new Date(i.openedAt) > sinceDate);
      }

      // --- status filter (additive read) ---
      const status = url.searchParams.get('status');
      if (status) {
        if (status !== 'open' && status !== 'resolved') {
          return json({ error: 'invalid status parameter' }, 400);
        }
        incidents = incidents.filter(i => i.status === status);
      }

      return json({ incidents });
    }
    return json({ error: 'not found' }, 404);
  },
};
