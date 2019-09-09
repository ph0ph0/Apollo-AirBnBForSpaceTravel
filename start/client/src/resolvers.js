import gql from 'graphql-tag'
import { getCartItemsGQLCacheQuery } from './pages/cart';

export const typeDefs = gql`
    extend type Query {
        isLoggedInQuery: Boolean!
        cartItemsQuery: [ID!]!
    }

    extend type Launch {
        isInCart: Boolean!
    }

    extend type Mutation {
        addOrRemoveFromCart(id: ID!): [Launch]
    }
`
export const resolvers = {
    Launch: {
        isInCart: (launch, _, { cache }) => {
            const { cartItems } = cache.readQuery({ query: getCartItemsGQLCacheQuery });
            return cartItems.includes(launch.id)
        }
    },
    Mutation: {
        addOrRemoveFromCart: (_, {id}, {cache}) => {
            const { cartItems } = cache.readQuery({ query: getCartItemsGQLCacheQuery });
            const data = {
                cartItems: cartItems.includes(id)
                    ? cartItems.filter(i => i !== id)
                    : [...cartItems, id]
            };
            cache.writeQuery({ query: getCartItemsGQLCacheQuery, data })
            return data.cartItems
        }
    }
}
