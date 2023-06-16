import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
    return <div>
      <h1>This is my token topup page</h1>
    </div>
  }

  TokenTopup.getLayout = function getLayout(page, pageProbs) {
    return <AppLayout {...pageProbs}>{page}</AppLayout>
  }
  
  
  export const getServerSideProps = withPageAuthRequired(() => {
    return {
        props : {},
    };  
  });