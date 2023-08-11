import { gql } from '@apollo/client';

export const GET_VIEWER = gql`
  query GetViewer {
    viewer @client
  }
`;
export const GET_CREATING = gql`
  query GetCreating {
    creating @client
  }
`;
export const GET_CURRENT = gql`
  query GetCurrent {
    auction @client
  }
`;

export const GET_ALERT = gql`
  query {
    alert @client
  }
`;

export const GET_WRONG_NETWORK = gql`
  query {
    wrongNetwork @client
  }
`;

export const GET_VIEWPORT = gql`
  query {
    viewportWidth @client
  }
`;
