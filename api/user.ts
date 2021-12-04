import { VercelRequest, VercelResponse } from "@vercel/node"
import { client } from "./_lib/twitter"

export default function (req: VercelRequest, res: VercelResponse) {
  client
    .get("search/tweets", { q: "node.js" })
    .then((tweet) => {
      res.json({ tweet })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}
