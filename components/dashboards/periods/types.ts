export type Member = {
  id: string
  name: string
  pseudo: string
}

export type Contribution = {
  id: string
  status: "PAID" | "PENDING" | "LATE"
  memberId: string
  member: Member
}

export type Period = {
  id: string
  month: number
  year: number
  amount: number
  contributions: Contribution[]
}