import { VercelRequest, VercelResponse } from "@vercel/node"
import { pick } from "lodash"
import { client, clientLite } from "../_lib/twitter"
import { supabase } from "../_lib/supabase"

export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    body: { key, user },
  } = req

  const userData = await supabase.from("user_token").select("*").eq("name", user).single()
  const imageData = await supabase.storage.from("profile-image").download(key.split("profile-image/")[1])
  const arrayBuffer = await imageData.data.arrayBuffer()

  // @ts-ignore
  const base64 = new Buffer(arrayBuffer, "binary").toString("base64")
  const { oauth_token, oauth_token_secret } = userData.data

  client(oauth_token, oauth_token_secret)
    .accountsAndUsers.accountUpdateProfileImage({
      image: base64,
      skip_status: true,
    })
    .then((updated_response) => {
      res.json({
        data: pick(updated_response, "profile_background_color", "profile_image_url_https"),
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send(error)
    })
}
