import React from 'react';
import NewRelic from 'components/newrelic';
import settingsProvider from 'utils/settings-provider';

type Props = {
  body: string,
  assets: Object,
  locale: string,
  title: string,
  description: string,
  author: string
};

function ServerHTML(props: Props) {
  const { body, assets, locale, title, description, author } = props;
  const newRelicEnabled = settingsProvider.get('NEW_RELIC.ENABLED') || false;

  return (
    <html lang={ locale }>
      <head>
        { /* These top three meta tags must come first */ }
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />

        { /* styles */ }
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
        <link rel='apple-touch-icon' sizes='57x57' href='/apple-touch-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/apple-touch-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/apple-touch-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/apple-touch-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/apple-touch-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/apple-touch-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/apple-touch-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/apple-touch-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon-180x180.png' />
        <link rel='icon' type='image/png' href='/favicon-32x32.png' sizes='32x32' />
        <link rel='icon' type='image/png' href='/android-chrome-192x192.png' sizes='192x192' />
        <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
        <link rel='icon' type='image/png' href='/favicon-16x16.png' sizes='16x16' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='apple-mobile-web-app-title' content='DowJones VentureSource' />
        <meta name='application-name' content='DowJones VentureSource' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='msapplication-TileImage' content='/mstile-144x144.png' />
        <meta name='theme-color' content='#ffffff' />
        <link rel='icon' type='image/ico' href='/favicon.ico' />

        { /* add newrelic browser monitoring */ }
        { newRelicEnabled && <NewRelic
          licenseKey={ settingsProvider.get('NEW_RELIC.LICENSE_KEY') }
          applicationID={ settingsProvider.get('NEW_RELIC.APPLICATION_ID') } /> }

        { assets.style.map((href, idx) =>
          <link key={ idx } rel='stylesheet' href={ href } />) }

        { /* SEO */ }
        <title>{ title }</title>
        <meta name='description' content={ description || '' } />
        <meta name='author' content={ author || '' } />
      </head>
      <body>
        <div id='content' dangerouslySetInnerHTML={ { __html: body } } />
        <script src={ assets.script[0] } />
      </body>
    </html>
  );
}

export default ServerHTML;
