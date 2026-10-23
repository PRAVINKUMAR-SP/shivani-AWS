import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://shivanitech.in';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export default function Seo({
  title = 'Shivani Technologies | Premier Job Portal & IT Services',
  description = 'Shivani Technologies is a premier job portal connecting top talent with leading employers. Explore IT services, career opportunities, and jobs.',
  keywords = 'Shivani Technologies, job portal, shivanitech, IT services, tech jobs, career opportunities, fresher jobs, jobs in Chennai',
  path = '/',
  noindex = false,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  jsonLd = null,
}) {
  const canonical = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Shivani Technologies" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
