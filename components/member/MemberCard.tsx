
type Props = {
  title: string
  value: number
  color?: "green" | "red" | "yellow"
}

export default function MemberCard({ title, value, color }: Props) {
  const colors = {
    green: "text-green-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-400">{title}</p>
      <p className={`text-xl font-semibold mt-1 ${colors[color ?? "green"]}`}>
        {value.toLocaleString()} Ar
      </p>
    </div>
  )
}