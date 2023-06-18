import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";


export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  const handleClick = async () => {
     

    const response = await fetch("/api/generatePost", {
      method: "POST"
    })
    const json = await response.json();
    console.log("RESULT", json)
    setPostContent(json.post.postContent)
  }

    return <div>
      <h1>This is the new post page</h1>
      <button className="btn" onClick={handleClick}>
        Generate
      </button>
      <div className="max-w-screen-sm p-10 text-center" dangerouslySetInnerHTML={{ __html: postContent}} />
    </div>
  }

  NewPost.getLayout = function getLayout(page, pageProbs) {
    return <AppLayout {...pageProbs}>{page}</AppLayout>
  }
  
  export const getServerSideProps = withPageAuthRequired(() => {
    return {
        props : {},
    };  
  });