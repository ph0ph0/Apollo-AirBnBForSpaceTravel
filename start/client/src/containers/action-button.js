import React from 'react';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { getLaunchDetailsGQLQuery } from '../pages/launch'
import Button from '../components/button'

const toggleCartGQLCacheMutation = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`

const cancelTripGQLMutation = gql`
  mutation cancelTrip($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function ActionButton({ isBooked, id, isInCart }) {

  const [mutate, { loading, error }] = useMutation(
    isBooked ? cancelTripGQLMutation : toggleCartGQLCacheMutation,
    {
      variables: {launchId: id},
      refetchQueries: [
        {
          query: getLaunchDetailsGQLQuery,
          variables: { launchId: id }
        }
      ]
    }
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>An error occured: {error.message}</p>

  return (
    <div>
      <Button
        onClick = {mutate}
        isBooked = {isBooked}
        data-testid = {'action-button'}
      >
        {
          isBooked
            ? 'Cancel This Trip'
            : isInCart
            ? 'Remove From Cart'
            :'Add to Cart'
        }
      </Button>
    </div>
  )
}
