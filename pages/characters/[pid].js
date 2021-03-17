import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { useRouter } from "next/router"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

const PeoplePage = ({ character }) => {
  const useStyles = makeStyles({
    container: {
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
  })

  const router = useRouter()
  const { pid } = router.query
  console.log("character: ", character)
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {character.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  )
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
          image
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
