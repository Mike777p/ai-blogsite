import { withPageAuthRequired } from "@auth0/nextjs-auth0"

export default function BlogPost() {
    return <div>
      <h1>This is my blog post page</h1>
    </div>
  }
  

  export const getServerSideProps = withPageAuthRequired(() => {
    return {
        props : {},
    };  
  });