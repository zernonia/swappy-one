import Twitter from "twitter-lite"

export const clientLite = (access_token_key?: string) =>
  new Twitter({
    consumer_key: process.env.VITE_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.VITE_TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.VITE_TWITTER_BEARER_TOKEN,
    access_token_key,
  })

import { TwitterClient } from "twitter-api-client"

export const client = (accessToken?: string, accessTokenSecret?: string) =>
  new TwitterClient({
    apiKey: process.env.VITE_TWITTER_CONSUMER_KEY,
    apiSecret: process.env.VITE_TWITTER_CONSUMER_SECRET,
    accessToken,
    accessTokenSecret,
  })
