import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout";

export default function BlogPost() {
    return <div>
      <h1>This is my blog post page</h1>
    </div>
  }

  BlogPost.getLayout = function getLayout(page, pageProbs) {
    return <AppLayout {...pageProbs}>{page}</AppLayout>
  }
  

  export const getServerSideProps = withPageAuthRequired(() => {
    return {
        props : {},
    };  
  });