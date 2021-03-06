import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Loading, Header, LaunchDetail } from '../components'
import { ActionButton } from '../containers'
import { LaunchTileDataFragment } from './launches'

export const getLaunchDetailsGQLQuery = gql`
  query getLaunchDetails($launchId: ID!) {
    launchQuery(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTileFragment
    }
  }
  ${LaunchTileDataFragment}
`

export default function LaunchQueryComponents({launchId}) {
  
  const { data, loading, error } = useQuery(
    getLaunchDetailsGQLQuery,
    { variables: {launchId} }
  );

  if (loading) return <Loading />;
  if (error) return <p>Error in Launch.js: {error.message} </p>
  
  return (
    <Fragment>
      <Header image = {data.launchQuery.mission.missionPatch}>
        {data.launchQuery.mission.name}
      </Header>
      <LaunchDetail {...data.launchQuery} />
      <ActionButton {...data.launchQuery} />
    </Fragment>
  )
}
