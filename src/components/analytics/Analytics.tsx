import React from 'react';

const trackingIdGA = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID; // Google Analytics ID
const trackingIdClarity = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID; // Microsoft Clarity ID

const Analytics = () => {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      {trackingIdGA && (
        <>
          <script src={`https://www.googletagmanager.com/gtag/js?id=${trackingIdGA}`} />

          <script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${trackingIdGA}');
              `,
            }}
          />
        </>
      )}

      {/* <!-- Microsoft Clarity --> */}
      {trackingIdClarity && (
        <script
          id="microsoft-clarity"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${trackingIdClarity}");
            `,
          }}
        />
      )}
    </>
  );
};

export default Analytics;
