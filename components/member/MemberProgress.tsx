
type Props = {
  progress: number
  pending: number
}

export default function MemberProgress({ progress, pending }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Progression</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {pending > 0 && (
        <p className="text-xs text-yellow-400">
          ⚠️ {pending.toLocaleString()} Ar restant
        </p>
      )}
    </div>
  )
}