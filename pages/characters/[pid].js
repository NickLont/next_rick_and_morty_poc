import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { useRouter } from "next/router"

const PeoplePage = ({ character }) => {
  const router = useRouter()
  const { pid } = router.query
  console.log("character: ", character)

  return <p>Post: {pid}</p>
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const { data } = await client.query({
    query: gql`
      query {
        characters {
          results {
            id
          }
        }
      }
    `,
  })
  const { results } = data.characters

  // Get all the possible paths we want to pre-render based on posts
  const paths = results.map((result) => ({
    params: { pid: result.id }, // here we tie the id from the url (pid), with the search result having this id
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { pid } = params
  const { data } = await client.query({
    query: gql`
      query {
        character(id: ${pid}) {
          id
          name
          status
          species
          type
          gender
          origin {
            name
          }
          location {
            name
          }
        }
      }
    `,
  })
  const { character } = data
  console.log("character: ", character)

  return {
    props: {
      character,
    },
  }
}

export default PeoplePage
