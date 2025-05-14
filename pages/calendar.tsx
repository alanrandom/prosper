import dynamic from 'next/dynamic'

const BigCalendar = dynamic(() => import('../components/BigCalendar'), { ssr: false })

export default function CalendarPage() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>My Calendar (therapist scheduling tool)</h1>
      <BigCalendar />
    </div>
  )
}
