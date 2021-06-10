export interface Post {
  _id?: string,
  post: string,
  created?: {
    user: string,
    when: Date,
  },
  updated?: {
    user: string,
    when: Date,
  },
  deleted?: {
    user: string,
    when: Date,
  },
  editable?: boolean,
  __v?: number
}