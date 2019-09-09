import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import LaunchTile from '../components/launch-tile'
import { LaunchTileDataFragment } from '../pages/launches'

export const getLaunchGQLQuery = gql`
  query GetLaunch($launchId: ID!) {
    launchQuery(id: $launchId) {
      ...LaunchTileDataFragment
    }
  }
  ${LaunchTileDataFragment}
`

export default function CartItem({launchId}) {
  const { data, loading, error } = useQuery(
    getLaunchGQLQuery,
    {variables: {launchId}}
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return data && <LaunchTile launch={data.launch} />
}
