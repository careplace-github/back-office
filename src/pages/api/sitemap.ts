// pages/api/sitemap.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { PATHS } from 'src/routes/paths';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const smStream = new SitemapStream({ hostname: process.env.NEXTAUTH_URL });
    const pipeline = smStream.pipe(createGzip());

    // Add all your paths to the sitemap, including dynamically generated ones.
    const addPathsToSitemap = paths => {
      Object.values(paths).forEach(path => {
        if (typeof path === 'string') {
          smStream.write({ url: path, changefreq: 'daily', priority: 0.7 });
        } else if (typeof path === 'function') {
          // If it's a function, execute it to get the dynamic URL.
          const dynamicUrl = path();
          smStream.write({ url: dynamicUrl, changefreq: 'daily', priority: 0.7 });
        } else if (typeof path === 'object' && path !== null) {
          // Handle nested paths within the object
          Object.values(path).forEach(nestedPath => {
            if (typeof nestedPath === 'string') {
              smStream.write({ url: nestedPath, changefreq: 'daily', priority: 0.7 });
            } else if (typeof nestedPath === 'function') {
              // If it's a function, execute it to get the dynamic URL.
              const dynamicUrl = nestedPath(':id');
              smStream.write({ url: dynamicUrl, changefreq: 'daily', priority: 0.7 });
            }
          });
        }
      });
    };

    // Add static paths
    addPathsToSitemap(Object.values(PATHS).flat());

    smStream.end();

    // Set the response headers to indicate it's an XML file.
    res.setHeader('content-type', 'application/xml');
    res.setHeader('content-encoding', 'gzip');

    // Convert the sitemap stream to a promise and send it as the response.
    const sitemap = await streamToPromise(pipeline);
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end();
  }
};
