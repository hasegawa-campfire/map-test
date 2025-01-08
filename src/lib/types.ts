export type Project = {
  id: string
  coords: {
    lng: number
    lat: number
  }
  name: string
  imageUrl: string
  category: string
  amount: number
  rate: number
  backers: number
  left: number
}
