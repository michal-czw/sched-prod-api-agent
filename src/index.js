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
    } else if (request.method === 'GET' && url.pathname.startsWith('/incidents/')) {
      const id = url.pathname.slice(10);
      const incidents = await feed(env);
      const incident = incidents.find(i => i.id === id);
      if (!incident) return json({ error: 'not found' }, 404);
      return json({ incident });
    } else if (request.method === 'POST' && url.pathname.startsWith('/incidents/')) {
      const id = url.pathname.slice(10);
      const incidents = await feed(env);
      const incident = incidents.find(i => i.id === id);
      if (!incident) return json({ error: 'not found' }, 404);
      // Add suggestions only to incidents with a known cause
      if (incident.cause) {
        incident.suggestions = [
          { text: 'Restart the service' },
          { text: 'Check the logs' }
        ];
      }
      return json({ incident });
    } else if (request.method === 'GET' && url.pathname === '/incidents/export.csv') {
      const incidents = await feed(env);
      const csv = incidents.map(incident => [
        incident.id,
        incident.service,
        incident.summary,
        incident.status,
        incident.openedAt
      ]).join('\n');
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv'
        }
      });
    }
    return json({ error: 'not found' }, 404);
  }
};