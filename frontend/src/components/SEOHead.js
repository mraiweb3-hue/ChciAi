import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = 'OpenClaw™ - Digitální AI zaměstnanec pro váš byznys',
  description = 'OpenClaw je inteligentní AI asistent, který pracuje ve vašem digitálním světě. Odpovídá zákazníkům, spravuje e-maily, upravuje web a pomáhá růst vašemu podnikání.',
  keywords = 'AI zaměstnanec, digitální asistent, chatbot, automatizace, umělá inteligence, OpenClaw, AI pro firmy, český AI',
  image = 'https://customer-assets.emergentagent.com/job_chciai-upgrade/artifacts/74zwcrx8_1719436835469.jpeg',
  url = 'https://chciai.cz',
  type = 'website'
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "OpenClaw",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "127"
    },
    "provider": {
      "@type": "Organization",
      "name": "OpenClaw s.r.o.",
      "url": url
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Co je OpenClaw?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OpenClaw je digitální AI zaměstnanec, který může pracovat ve vašem digitálním světě - odpovídat na e-maily, spravovat web, komunikovat se zákazníky a automatizovat rutinní úkoly."
        }
      },
      {
        "@type": "Question",
        "name": "Jak OpenClaw funguje?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OpenClaw se připojí k vašim digitálním nástrojům (e-mail, web, CRM) a autonomně vykonává úkoly podle vašich instrukcí. Vy máte plnou kontrolu nad tím, kam má přístup."
        }
      },
      {
        "@type": "Question",
        "name": "Kolik stojí OpenClaw?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OpenClaw nabízí dva plány - Základ pro každodenní automatizaci a Růst pro pokročilé funkce včetně marketingu a SEO. Kontaktujte nás pro individuální cenovou nabídku."
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="OpenClaw s.r.o." />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:site_name" content="OpenClaw" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Czech" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
    </Helmet>
  );
}
