<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/zernonia/swappy-one">
    <img src="public/favicon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Swappy.one</h3>

  <p align="center">
  Simple & Fun project for <strong><a href="https://supabase.io/">Supabase</a> Holiday Hackdays!</strong>
    <br />
    Swap your Twitter image based on interest/season temporarily or forever!
    <br />
    <br />
    <a href="https://swappy.one">View Demo</a>
    ·
    <a href="https://github.com/zernonia/swappy-one/issues">Report Bug</a>
    ·
    <a href="https://github.com/zernonia/swappy-one/issues">Request Feature</a>
  </p>
</p>

![Swappy.one](public/og.png)

## 🚀 Features

- 🎉 Add badges/frame to your Twitter profile
- 🤩 Share templates with your friends to enjoy this festive season
- 🔒 Only update your profile image
- 🤚 Customize the placement of element yourself

## 📇 About The Project

This project is inspired by Facebook's Temporary Profile Picture, as well as the Twitter Space's logo when someone is joining a Space. Thus, I've created this apps to swap your plain Twitter picture to fit the **season/event/anything** that you want your follower to notice!

After a certain amount of period (you can configure on the app), it will automatically **swap back** (hence, Swappy) to your original image. And you can revisit the app when you feel like putting on another badges in the future.

`Author: @zernonia`

### 🔨 Built With

- [Supabase](https://supabase.com/)
- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [WindiCSS](https://windicss.org/)

### ⚡ Supabase Service

- Supabase Database
- Supabase Auth (Twitter)
- Supabase Storage
- Postgres Function

### Postgres SQL

1. Store user's history

   ```sql
   create or replace function public.handle_new_user_image()
   returns trigger as $$
   begin
     insert into public.user_history (user_id, template, new_image_key)
     values (new.id, new.template, new.new_image_key);
     return new;
   end;
   $$ language plpgsql security definer;

   create trigger on_new_user_image
     after insert or update of update_on on public.user
     for each row execute procedure public.handle_new_user_image();
   ```

2. Invoke Vercel serverless function

   ```sql
   create or replace function change_back_image_vercel_webhook (input_id uuid)
     returns integer
     language plpgsql
     as
     $$
       begin
         return (select
           net.http_post(
               url:='https://swappy.one/api/user/change_back_image',
               body:=(
                 select json_build_object(
                   'id', a.id,
                   'old_image_key', a.old_image_key,
                   'token', a.oauth_token,
                   'secret', a.oauth_token_secret
                   ) as body
                 from (select a.id, a.old_image_key, b.oauth_token , b.oauth_token_secret
                   from public.user a inner join public.user_token b on a.id = b.user_id where a.id = input_id) a
               )::jsonb
           ) as request_id);
       end;
     $$
   ```

3. Function to query all the rows that need to change back their image, and loop through each row and call the `change_back_image_vercel_webhook`

   ```sql
   create or replace function check_date_and_change_back()
     returns table (request_id int)
     language plpgsql
     as
     $$
       declare
         r record;
       begin
         for r in (
           select * from public.user
           where now() > change_back_date and changed_back = false
         ) loop
             request_id := change_back_image_vercel_webhook(r.id);
             return next;
           end loop;
       end;
     $$;
   ```

4. CRON job to start the function #3 every hour.

   ```sql
   create extension if not exists pg_cron;
   grant usage on schema cron to postgres;
   grant all privileges on all tables in schema cron to postgres;

   select
     cron.schedule(
       'change_back_user_old_image',
       '0 */1 * * *', -- “At minute 0 past every 1th hour.”  https://crontab.guru/#0_*/1_*_*_*
       $$
         select check_date_and_change_back()
       $$
     );
   ```

## 🌎 Local Development

### Prerequisites

Yarn

```sh
npm install --global yarn
```

### Development

1. Clone the repo
   ```sh
   git clone https://github.com/zernonia/swappy-one.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Create `.env`

   ```bash
    VITE_SUPABASE_URL=
    VITE_SUPABASE_ANON_KEY=
    VITE_SUPABASE_SERVICE_KEY=
    VITE_TWITTER_CONSUMER_KEY=
    VITE_TWITTER_CONSUMER_SECRET=
    TWITTER_ACCESS_TOKEN_KEY=
    TWITTER_ACCESS_TOKEN_SECRET=
    VITE_TWITTER_BEARER_TOKEN=
   ```

4. Run Development instance
   ```sh
   vercel dev
   ```

## ➕ Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgement

1. Fundamental for this Visualization ([Generate database types from OpenAPI specification](https://supabase.io/docs/reference/javascript/generating-types#generate-database-types-from-openapi-specification))
2. Guide to Construct Dynamic SVG Connector ([Connecting Table using SVG](https://codepen.io/alojzije/pen/ndfrI))
3. [Icones - icon gallery](https://icones.js.org/)

## 📜 License

Not Associated with Supabase.

Distributed under the MIT License. See `LICENSE` for more information.

# 📧 Contact

Zernonia - [@zernonia](https://twitter.com/zernonia) - zernonia@gmail.com

Also, if you like my work, please buy me a coffee ☕😳

<a href="https://www.buymeacoffee.com/zernonia" target="_blank">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Logo" >
  </a>
