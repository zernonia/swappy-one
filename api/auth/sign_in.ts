import { VercelRequest, VercelResponse } from "@vercel/node"
import { clientLite } from "../_lib/twitter"

export default async function (req: VercelRequest, res: VercelResponse) {
  const callback_url =
    process.env.NODE_ENV == "development" ? "http://localhost:3000/callback" : "https://www.swappy.one/callback"

  clientLite()
    .getRequestToken(callback_url)
    .then((result) => {
      console.log(result)
      if (result.oauth_callback_confirmed) {
        // @ts-ignore
        res.redirect(301, `https://api.twitter.com/oauth/authenticate?oauth_token=` + result?.oauth_token)
      } else {
        res.send("Failed to retrieve token")
      }
    })
    .catch((error) => {
      res.send(error)
    })
}
