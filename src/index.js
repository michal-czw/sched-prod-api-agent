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
    // New endpoint: GET /incidents/{id}
    if (request.method === 'GET') {
      const idMatch = url.pathname.match(/^\/incidents\/([^/]+)$/);
      if (idMatch) {
        const id = idMatch[1];
        const incidents = await feed(env);
        const incident = incidents.find(i => i.id === id);
        if (incident) {
          return json({ incident });
        }
        return json({ error: 'not found' }, 404);
      }
    }

    if (request.method === 'GET' && url.pathname === '/incidents') {
      let incidents = await feed(env);

      // Optional status filter
      const status = url.searchParams.get('status');
      if (status) {
        incidents = incidents.filter(i => i.status === status);
      }

      // Optional since filter (additive read)
      const since = url.searchParams.get('since');
      if (since) {
        const sinceDate = new Date(since);
        if (!isNaN(sinceDate)) {
          incidents = incidents.filter(i => new Date(i.openedAt) > sinceDate);
        }
        // If since is invalid, ignore the filter (return all incidents)
      }

      return json({ incidents });
    }

    return json({ error: 'not found' }, 404);
  },
};
