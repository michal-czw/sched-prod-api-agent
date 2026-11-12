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
      const status = url.searchParams.get('status');
      if (status) {
        // Filter by status; unknown status yields empty list
        incidents = incidents.filter(i => i.status === status);
      }
      return json({ incidents });
    }
    return json({ error: 'not found' }, 404);
  },
};
