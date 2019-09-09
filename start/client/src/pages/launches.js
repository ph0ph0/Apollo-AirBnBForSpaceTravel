import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { LaunchTile, Header, Button, Loading } from '../components'

export const LaunchTileDataFragment = gql`
  fragment LaunchTileFragment on Launch {
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
`

const getLaunchesGQLQuery = gql`
  query getLaunchList($after: String) {
    launchesQuery(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTileFragment
      }
    }
  }
  ${LaunchTileDataFragment}
`

export default function LaunchesQueryComponents() {

  const { data, loading, error, fetchMore} = useQuery(getLaunchesGQLQuery)

  if (loading) return <Loading />
  if (error) return <p>Error</p>

  console.log(`^^^^data: ${data.launchesQuery.launches[0].id}`)

  return (
    <Fragment>
      <Header>
        {data.launchesQuery &&
          data.launchesQuery.launches &&
            data.launchesQuery.launches.map(launch => (
              <LaunchTile 
                key = {launch.id}
                launch = {launch}
              />
            ))}
      </Header>
      {
          data.launchesQuery &&
            data.launchesQuery.hasMore && (
              <Button
                onClick = {() => 
                  fetchMore({
                    variables: {
                      after: data.launchesQuery.cursor
                    },
                    updateQuery: (prev, { fetchMoreResult, ...rest}) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...fetchMoreResult,
                        launches: {
                          ...fetchMoreResult.launches,
                          launches: [
                            ...prev.launches.launches,
                            ...fetchMoreResult.launches.launches
                          ]
                        }
                      }
                    }
                  })
                }
              >
                Load More
              </Button>
            )
        }
    </Fragment>
  )
}
