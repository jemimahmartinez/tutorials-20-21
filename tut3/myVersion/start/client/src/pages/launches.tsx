import React, { Fragment, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: string) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  return <div />;
};

export default Launches;

// NOTES:

// LAUNCH_TILE_DATA defines a GraphQL fragment, which is named `LaunchTile`
// A fragment is useful for defining a set of fields that you can include across multiple queries without rewriting them
// In the query above, we include the `LaunchTile` fragment in our query by preceeding it with `...`,
// similar to JS spread syntax

// Notice that in addition to fetching a list of `launches`, our query fetches `hasMore` and `cursor` fields.
// That's because the `launches` query returns paginated results
// The `hasMore` field indicates whether there are additional launches beyond the list returned by the server
// The `cursor` field indicates the client's current position within th list of launches. We can execute the query again and provide our most recent `cursor` as the value of the `$after` variable to fetch the next set of launches in the list
