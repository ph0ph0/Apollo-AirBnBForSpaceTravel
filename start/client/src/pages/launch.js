import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Loading, Header, LaunchDetail } from '../components'
import { ActionButton } from '../containers'
import { LaunchTileDataFragment } from './launches'

export const getLaunchDetailsGQLQuery = gql`
  query getLaunchDetails($launchId: ID!) {
    launchQuery(id: $launchId) {
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
  if (error) return <p>Error: {error.message} </p>
  
  return (
    <Fragment>
      <Header image = {data.launch.mission.missionPatch}>
        {data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </Fragment>
  )
}
