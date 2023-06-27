import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../Utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async () => {
    await fetch("/api/addTokens", {
      method : "POST",
    })
  }
    return <div>
      <h1>This is my token topup page</h1>
      <button className="btn" onClick={handleClick}>Add tokens</button>
    </div>
  }

  TokenTopup.getLayout = function getLayout(page, pageProbs) {
    return <AppLayout {...pageProbs}>{page}</AppLayout>
  }
  
  
  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
      const props = await getAppProps(ctx);
      return {
        props,
      };
    },
  });