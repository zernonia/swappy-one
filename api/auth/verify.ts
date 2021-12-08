import { VercelRequest, VercelResponse } from "@vercel/node"
import { supabase } from "../_lib/supabase"
import { clientLite } from "../_lib/twitter"

export default async function (req: VercelRequest, res: VercelResponse) {
  const { oauth_token, oauth_verifier, user_id } = req.query
  if (oauth_token && oauth_verifier) {
    clientLite()
      .getAccessToken({
        oauth_token,
        oauth_verifier,
      })
      .then(async (result) => {
        const { data, error } = await supabase.from("user_token").upsert([
          {
            user_id,
            oauth_token: result.oauth_token,
            oauth_token_secret: result.oauth_token_secret,
          },
        ])
        if (error) {
          res.send("Error inserting token")
        } else {
          res.json({
            success: true,
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(400).send(error)
      })
  } else {
    res.status(400).send("No token found")
  }
}
