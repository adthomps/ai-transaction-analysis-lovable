import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

type Bindings = {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static assets
app.get('/assets/*', serveStatic({ root: './', manifest: {} }));
app.get('/favicon.ico', serveStatic({ path: './favicon.ico' }));
app.get('/robots.txt', serveStatic({ path: './robots.txt' }));

// Serve static files with proper MIME types
app.get('*', async (c, next) => {
  const url = new URL(c.req.url);
  const pathname = url.pathname;

  // Handle static file extensions
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/)) {
    try {
      const response = await c.env.ASSETS.fetch(c.req.url);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error('Error serving static file:', error);
    }
  }

  // SPA fallback - serve index.html for all other routes
  try {
    const indexUrl = new URL('/index.html', c.req.url);
    const response = await c.env.ASSETS.fetch(indexUrl.toString());
    
    if (response.ok) {
      // Handle redirects
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('Location');
        if (location) {
          return c.redirect(location);
        }
      }
      
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
  } catch (error) {
    console.error('Error serving SPA fallback:', error);
  }

  return c.notFound();
});

export default app;