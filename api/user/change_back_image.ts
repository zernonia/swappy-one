import { VercelRequest, VercelResponse } from "@vercel/node"
import { client, clientLite } from "../_lib/twitter"
import { supabase } from "../_lib/supabase"

export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    body: { old_image_key, id, token, secret },
  } = req

  const imageData = await supabase.storage.from("profile-image").download(old_image_key.split("profile-image/")[1])
  const arrayBuffer = await imageData.data.arrayBuffer()

  // @ts-ignore
  const base64 = new Buffer(arrayBuffer, "binary").toString("base64")

  client(token, secret)
    .accountsAndUsers.accountUpdateProfileImage({
      image: base64,
      skip_status: true,
    })
    .then(async (updated_response) => {
      const updatedData = await supabase.from("user").upsert([
        {
          id,
          changed_back: true,
        },
      ])
      console.log(updatedData.data)

      res.json({
        success: true,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send(error)
    })
}
