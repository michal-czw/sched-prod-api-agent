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
    // Split pathname into parts, ignoring leading/trailing slashes
    const parts = url.pathname.split('/').filter(Boolean);

    // New additive read: GET /incidents/{id}
    if (request.method === 'GET' && parts.length === 2 && parts[0] === 'incidents') {
      const id = parts[1];
      const incidents = await feed(env);
      const incident = incidents.find((i) => i.id === id);
      if (incident) {
        return json({ incident }, 200);
      }
      return json({ error: 'not found' }, 404);
    }

    // Existing list endpoint with optional status filter and since filter
    if (request.method === 'GET' && url.pathname === '/incidents') {
      const status = url.searchParams.get('status');
      const since = url.searchParams.get('since');
      let incidents = await feed(env);
      if (status === 'open' || status === 'resolved') {
        incidents = incidents.filter((i) => i.status === status);
      }
      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate.getTime())) {
          incidents = incidents.filter((i) => new Date(i.openedAt) > sinceDate);
        }
      }
      return json({ incidents });
    }

    // Catch‑all for unknown routes
    return json({ error: 'not found' }, 404);
  },
};
