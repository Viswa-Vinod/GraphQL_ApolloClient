import 'dotenv/config';
import 'cross-fetch/polyfill';
import util from 'util';
import ApolloClient, {gql} from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});

const GET_REPOSITORIES_OF_ORGANIZATION=gql`
query($org: String!, $cursor: String) {
    organization(login:$org){
        name
        url
        repositories(first: 5, orderBy: {field: STARGAZERS, direction: ASC}, after: $cursor) {
            edges {
               ...sharedRepositoryEdgeFields
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
}

fragment sharedRepositoryEdgeFields on RepositoryEdge {
     node {
                    id
                    name
                    url
                    stargazers {
                        totalCount
                    }
                }
}
`

const ADD_STAR = gql`
    mutation AddStar($repoId: ID!) {
        addStar(input:{starrableId: $repoId}){
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`
const REMOVE_STAR = gql`
    mutation RemoveStar($repoId: ID!) {
        removeStar(input: {starrableId: $repoId}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`

client.query({
    query: GET_REPOSITORIES_OF_ORGANIZATION,
    variables:{
        org: 'the-road-to-learn-react',
        cursor: "Y3Vyc29yOnYyOpIFzgjNAhg="
    }

}).then(res => console.log(util.inspect(res, {showHidden: false, depth: null})));

// client.mutate({
//     mutation: ADD_STAR,
//     variables: {
//         repoId: 'MDEwOlJlcG9zaXRvcnkxMTk1NTAyODQ='
//     }
// }).then(res => console.log(util.inspect(res, {showHidden: false, depth: null})))

client.mutate({
    mutation: REMOVE_STAR,
    variables: {
        repoId: 'MDEwOlJlcG9zaXRvcnkxMTk1NTAyODQ='
    }
}).then(res => console.log(util.inspect(res, {showHidden: false, depth: null})))

const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };
const user = { ...userCredentials, ...userDetails };

console.log(user);

console.log(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);