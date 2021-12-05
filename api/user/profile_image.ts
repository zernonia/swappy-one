import { VercelRequest, VercelResponse } from "@vercel/node"
import { pick } from "lodash"
import { client, clientLite } from "../_lib/twitter"
import { supabase } from "../_lib/supabase"

export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    body: { key, token },
  } = req

  const { data, error } = await supabase.storage.from("profile-image").download(key.split("profile-image/")[1])
  const arrayBuffer = await data.arrayBuffer()

  // @ts-ignore
  const base64 = new Buffer(arrayBuffer, "binary").toString("base64")

  client(token)
    .accountsAndUsers.accountUpdateProfileImage({
      image: base64,
      skip_status: true,
    })
    // .post("account/update_profile_image", { image: base64, skip_status: true })
    .then((updated_response) => {
      console.log(updated_response)
      res.json({
        data: pick(updated_response, "profile_background_color", "profile_image_url_https"),
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send(error)
    })
}
