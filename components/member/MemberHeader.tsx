
import SignOutButton from "@/app/dashboard/SignOutButton"

type Props = {
  name: string
  pseudo: string
}

export default function MemberHeader({ name, pseudo }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-sm text-gray-400">@{pseudo}</p>
      </div>
      <SignOutButton />
    </div>
  )
}