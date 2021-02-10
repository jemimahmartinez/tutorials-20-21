import React from 'react';
import { gql, useMutation } from '@apollo/client';

import { LoginForm, Loading } from '../components';
import * as LoginTypes from './__generated__/login';

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      token
    }
  }
`;

export default function Login() {
  const [login, { loading, error }] = useMutation<
    LoginTypes.Login,
    LoginTypes.LoginVariables
  >(LOGIN_USER, {
    onCompleted({ login }) {
      if (login) {
        localStorage.setItem('token', login.token as string);
        localStorage.setItem('userId', login.id as string);
      }
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}

// NOTES:

// Using Apollo Client's React Hook, `useMutation` to execute `LOGIN_USER` mutation
// As with `useQuery`, the hook's result provides properties that help us populate and render our component throughout the mutation's execution
// Unlike `useQuery`, `useMutation` doesn't execute its operation as soon as its component renders
// Instead, the hook returns a mutate function that we call to execute the mutation whenever we want (such as when the user submits a form)

// `onCompleted` callback stores the user's unique ID and session token in `localStorage`, so we can load these values into the in-memory cache the next time the user visits our application
