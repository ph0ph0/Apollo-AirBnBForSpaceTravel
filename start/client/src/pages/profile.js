import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Loading, Header, LaunchTile } from '../components'
import { LaunchTileDataFragment } from './launches'

const getCurrentUsersTripsGQLQuery = gql`
  query GetCurrentUsersTrips {
    meQuery {
      id
      email
      trips {
        ...LaunchTileFragment
      }
    }
  }
  ${LaunchTileDataFragment}
`

export default function ProfileQueryComponents() {

  console.log(`Rendering profile query components`)
  
  const { data, loading, error } = useQuery(
    getCurrentUsersTripsGQLQuery,
    {fetchPolicy: "network-only"}
  )

  if (loading) return <Loading />
  if (error) return <p>Error: {error.message}</p>

  return (
    <Fragment>
      <Header>
        My Trips
      </Header>
      {
        data.me && data.me.trips.length ? (
          data.me.trips.map(launch => (
            <LaunchTile 
              key = {launch.id}
              launch = {launch}
              /> 
          ))
        ) : (
          <p>You haven't booked any trips yet</p>
        )
      }
    </Fragment>
  )
}
