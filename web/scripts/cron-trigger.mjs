import http from 'http';
import https from 'https';

function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000');
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function requestJson(urlString, headers) {
  const url = new URL(urlString);
  const isHttps = url.protocol === 'https:';
  const lib = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        method: 'GET',
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        headers,
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode || 0, body }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('CRON_SECRET is not set. Refusing to trigger /api/notifications/scan without authorization.');
    process.exit(1);
  }

  const endpoint =
    process.env.CRON_ENDPOINT ||
    `${getBaseUrl()}/api/notifications/scan`;

  const { status, body } = await requestJson(endpoint, {
    authorization: `Bearer ${cronSecret}`,
    accept: 'application/json',
  });

  if (status >= 200 && status < 300) {
    console.log(body);
    process.exit(0);
  }

  console.error(`Request failed: ${status}`);
  console.error(body);
  process.exit(1);
}

main().catch((err) => {
  console.error('Failed to trigger cron scan:', err);
  process.exit(1);
});

