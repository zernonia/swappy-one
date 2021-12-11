import { VercelRequest, VercelResponse } from "@vercel/node"
import { pick } from "lodash"
import { clientLite } from "../_lib/twitter"

export default function (req: VercelRequest, res: VercelResponse) {
  const {
    query: { id },
  } = req
  clientLite()
    .get("users/show", { screen_name: id })
    .then((user_data) => {
      res.json({
        data: pick(
          user_data,
          "id",
          "name",
          "screen_name",
          "profile_background_color",
          "profile_image_url_https",
          "profile_banner_url"
        ),
      })
    })
    .catch((error) => {
      res.status(400).send(error)
    })
}
