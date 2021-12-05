import { VercelRequest, VercelResponse } from "@vercel/node"
import { supabase } from "../_lib/supabase"
import { clientLite } from "../_lib/twitter"

export default async function (req: VercelRequest, res: VercelResponse) {
  const { oauth_token, oauth_verifier } = req.query
  if (oauth_token && oauth_verifier) {
    clientLite()
      .getAccessToken({
        oauth_token,
        oauth_verifier,
      })
      .then(async (result) => {
        const { data, error } = await supabase.from("user_token").insert([
          {
            name: result.screen_name,
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
        res.send(error)
      })
  } else {
    res.send("No token found")
  }
}
