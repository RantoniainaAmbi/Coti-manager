import MemberCard from "./MemberCard"

type Props = {
  paid: number
  pending: number
  expenses: number 
  balance: number
}

export default function MemberStats({ paid, pending, expenses, balance }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <MemberCard 
        title="Payé" 
        value={paid} 
        color="green" 
      />

      <MemberCard 
        title="En attente" 
        value={pending} 
        color="yellow" 
      />

      <MemberCard 
        title="Dépenses" 
        value={expenses} 
        color="red"
      />

      <div className="sm:col-span-2 lg:col-span-1">
        <MemberCard
          title="Solde"
          value={balance}
          color={balance >= 0 ? "green" : "red"}
        />
      </div>
      
    </div>
  )
}