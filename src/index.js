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

    // Existing list endpoint
    if (request.method === 'GET' && url.pathname === '/incidents') {
      return json({ incidents: await feed(env) });
    }

    // Catch‑all for unknown routes
    return json({ error: 'not found' }, 404);
  },
};
