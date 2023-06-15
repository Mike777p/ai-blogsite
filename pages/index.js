import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client"

export default function Home() {
  const {user} = useUser();

  console.log("User: ", user)
  return <div>
    <h1>This is my home page</h1>
    <div>
      {user ? 
      <>
        <div>User is logged in </div> 
        <Link href="/api/auth/logout">Logout</Link> 
      </> 
      :
        <Link href="/api/auth/login">Login</Link>

      }
    </div>
  </div>
}
