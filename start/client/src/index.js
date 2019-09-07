import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import Pages from './pages'
import React from 'react'
import ReactDOM from 'react-dom'

const cache = new InMemoryCache

const link = new HttpLink({
    uri: 'http://localhost:4000/'
}) 

const client = new ApolloClient({
    link: link,
    cache: cache
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <Pages />
    </ApolloProvider>, document.getElementById('root')
)