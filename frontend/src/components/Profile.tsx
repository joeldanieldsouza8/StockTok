import { auth0 } from "@/src/lib/auth0";

export default async function Profile() {
  // Fetch the user session
  const session = await auth0.getSession();
  
  
}
