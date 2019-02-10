import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';
import ws from 'websocket';

let apolloClient = null;
const ssrMode = !process.browser;

const GRAPHQL_URL = 'http://localhost:4000/';
const WS_URL = 'ws://localhost:4000/';

// Polyfill fetch() on the server (used by apollo-client)
if (ssrMode) {
  global.fetch = fetch;
}

function create(initialState) {
  // Create an http link:
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL
    // credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
  });

  let link = httpLink;
  if (!ssrMode) {
    // Create a WebSocket link:
    const wsLink = new WebSocketLink({
      uri: WS_URL,
      options: {
        reconnect: true
      },
      webSocketImpl: ws.client
    });

    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink
    );
  }

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: ssrMode, // Disables forceFetch on the server (so queries are only run once)
    link: link,
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
