import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
} from '@apollo/client';
import { cache } from './cache';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';

// Initialize ApolloClient
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/graphql',
});

injectStyles();

// Pass the ApolloClient instance to the ApolloProvider component
ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById('root'),
);

// NOTES:

// The `ApolloClient` constructor requires two parameters:
// The `uri` of our GraphQL server (in this case `localhost:4000/graphql`)
// An instance of `InMemoryCache` to use as the client's `cache` - we import this instance from the `cache.ts` file

// client
//   .query({
//     query: gql`
//       query TestQuery {
//         launch(id: 56) {
//           id
//           mission {
//             name
//           }
//         }
//       }
//     `,
//   })
//   .then((result) => console.log(result));

// When the index page opens, on the console in the browser - will see a logged `Object` that contains your server's response to your query
// The data you requested is contained in the object's `data` field, and the other fields provide metadata about the state of the request
// Can also open the Network tab in browser's developer tools and refresh the page to view the shape of the request that Apollo Client makes to execute your query
// (its a POST request to `localhost:4000`)

// `ApolloProvider` component is similar to React's context provider: it wraps your React app and places `client` on the context,
// which enables you to acces it from anywhere in your component tree
