import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import Pages from './pages'
import React from 'react'
import ReactDOM from 'react-dom'
import { resolvers, typeDefs } from './resolvers.js'
import gql from 'graphql-tag';
import LoginMutationComponents from './pages/login.js'
import injectStyles from './styles'

const cache = new InMemoryCache()

const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: {
        authorization: localStorage.getItem('token')
    }
}) 

const client = new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers
})

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: []
    }
})

const isLoggedInGQLCacheQuery = gql`
    query isLoggedIn {
        isLoggedIn @client
    }
`

function IsLoggedIn() {
    const { data } = useQuery(isLoggedInGQLCacheQuery)
    return data.isLoggedIn ? <Pages /> : <LoginMutationComponents />
}

injectStyles()
ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>, document.getElementById('root')
)