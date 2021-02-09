import React, { Fragment, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';
import { LaunchTile, Header, Button, Loading } from '../components';
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

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
  query GetLaunchList($after: String) {
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
  const { data, loading, error } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
    </Fragment>
  );
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

// `Launches` component passes our `GET_LAUNCHES` query to `useQuery` and obtains `data`, `loading`, and `error` properties from the result
// Depending on the state of those properties, we render a list of launches, a loading indicator or an error message
