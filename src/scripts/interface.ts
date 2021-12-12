export interface UserImage {
  id: string
  user_id: string
  update_on: string
  old_image_key: string
  new_image_key: string
  changed_back: boolean
}

export interface Logo {
  ref: string
  name: string
  shortname: string
}
