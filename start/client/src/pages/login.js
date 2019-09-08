import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { LoginForm, Loading } from '../components'

const LoginUserGQLMutation = gql`
  mutation loginUser($email: String!) {
    login(email: $email)
  }
`

export default function LoginMutationComponents() {

  const client = useApolloClient()
  const [login, { loading, error }] = useMutation(
    LoginUserGQLMutation,
    {
      onCompleted({loginToken}) {
        localStorage.setItem('token', loginToken)
        client.writeData({ data: {isLoggedIn: true }})
      }
    }
  )
  
  if (loading) return <Loading />
  if (error) return <p>An error occurred</p>  

  return <LoginForm login={login} />
}


