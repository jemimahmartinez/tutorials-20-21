import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Loading, Header, LaunchTile } from '../components';
import { LAUNCH_TILE_DATA } from './launches';
import { RouteComponentProps } from '@reach/router';
import * as GetMyTripsTypes from './__generated__/GetMyTrips';

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface ProfileProps extends RouteComponentProps {}

const Profile: React.FC<ProfileProps> = () => {
  const { data, loading, error } = useQuery<GetMyTripsTypes.GetMyTrips>(
    GET_MY_TRIPS,

    { fetchPolicy: 'network-only' },
  );
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (data === undefined) return <p>ERROR</p>;

  return (
    <Fragment>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (
        data.me.trips.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))
      ) : (
        <p>You haven't booked any trips</p>
      )}
    </Fragment>
  );
};

export default Profile;

// NOTES:

// Apollo Client stores query results in its cacche
// If you query for data that's already present in your cache, Apollo Client can return that data without needing to fetch it over the network

// However, cached data can become stale
// SLightly stale data is acceptable in many ccases, but we definitely want our user's list of booked trips to be up-to-date
// To hadnle this, we've specified a fetch policy for our `GET_MY_TRIPS` query

// A fetch policy defines how Apollo Client uses the cache for a particular query
// The default policy is `cache-first`, which means Apollo Client checks the cache to see if the result is present before making a network request
// If the result is present, no network request ovvurs

// By setting this query's fetch policy to "network-only", we guarantee that Apollo Client always queries our server to fetch the user's most up-to-date list of booked trips
