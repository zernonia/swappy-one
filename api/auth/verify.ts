import { VercelRequest, VercelResponse } from "@vercel/node"
import { client } from "../_lib/twitter"

export default async function (req: VercelRequest, res: VercelResponse) {
  const { oauth_token, oauth_verifier } = req.query
  if (oauth_token && oauth_verifier) {
    client()
      .getAccessToken({
        oauth_token,
        oauth_verifier,
      })
      .then((result) => {
        console.log(result)
        res.json(result)
      })
      .catch((error) => {
        res.send(error)
      })
  } else {
    res.send("No token found")
  }
}
