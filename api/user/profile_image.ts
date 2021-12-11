import { VercelRequest, VercelResponse } from "@vercel/node"
import { pick } from "lodash"
import { client, clientLite } from "../_lib/twitter"
import { supabase } from "../_lib/supabase"

export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    body: { oldkey, key, id, provider_token, template, period },
  } = req

  const imageData = await supabase.storage.from("profile-image").download(key.split("profile-image/")[1])
  const arrayBuffer = await imageData.data.arrayBuffer()

  // @ts-ignore
  const base64 = new Buffer(arrayBuffer, "binary").toString("base64")
  const { token, secret } = provider_token

  client(token, secret)
    .accountsAndUsers.accountUpdateProfileImage({
      image: base64,
      skip_status: true,
    })
    .then(async (updated_response) => {
      let newDate = new Date()
      newDate.setDate(newDate.getDate() + period)
      const insertedData = await supabase.from("user").upsert([
        {
          id,
          update_on: new Date(),
          change_back_date: newDate,
          old_image_key: oldkey,
          new_image_key: key,
          template,
        },
      ])
      console.log(insertedData.data)

      res.json({
        success: true,
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send(error)
    })
}
