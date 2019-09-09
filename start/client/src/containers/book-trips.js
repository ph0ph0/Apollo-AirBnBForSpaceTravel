import React from 'react';
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Button from '../components/button'
import { getLaunchGQLQuery } from './cart-item'

const bookTripsGQLQuery = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`

export default function BookTrips({cartItems}) {

  console.log(`!!!!!Items in cart when rendering BookTripsButton: ${cartItems}`)

  const [bookTrips, {data, loading, error}] = useMutation(
    bookTripsGQLQuery,
    {
      refetchQueries: cartItems.map(launchId => ({
        query: getLaunchGQLQuery,
        variables: {launchId}
      })),
      update(cache) {
        cache.writeData({data: {cartItems: [] }})
      }
    }
  )

  console.log(`@@@@Data: ${data}`)
  console.log(`!!!!!data message in book-trips: ${
    data ? 
      data.bookTrips ?
      data.bookTrips.message :
      "No Message" :
    `No data`}`)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error in book-trips.js: {error.message}</p>

  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">
      {data.bookTrips.message}
    </p>
    : (
      <Button onClick = {bookTrips} data-testid="book-button">
        Book All
      </Button>
    )
}
