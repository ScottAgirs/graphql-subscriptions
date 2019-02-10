import React from 'react';
import Head from 'next/head';

import { ApolloProvider } from 'react-apollo';

import Messages from '../components/Messages';
import apolloClient from '../lib/apolloClient';

const App = () => {
  return (
    <div>
      <ApolloProvider client={apolloClient()}>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
          />
        </Head>
        <Messages />
      </ApolloProvider>
    </div>
  );
};

export default App;
