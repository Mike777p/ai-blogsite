import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default function BlogPost(props) {
  console.log("PROPS-> ", props)
    return <div>
      <h1>This is my blog post page</h1>
    </div>
  }

  BlogPost.getLayout = function getLayout(page, pageProbs) {
    return <AppLayout {...pageProbs}>{page}</AppLayout>
  }
  

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const userSession = await getSession(ctx.req, ctx.res);
      
      const client = await clientPromise;
      const db = client.db("blogStandard")

      const user = await db.collection("users").findOne({
        auth0Id : userSession.user.sub
      });

      const post = await db.collection("posts").findOne({
        _id : new ObjectId(ctx.params.postid),
        userId : user._id,
      }) 

      if (!post){
        return {
          redirect : {
            destination : "/post/new",
            permanent : false,
          }
        }
      }
      return {props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        topic: post.topic,
      }}      

    }
  });