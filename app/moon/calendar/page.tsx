import { redirect } from 'next/navigation'

// Redirect legacy /moon/calendar URL to the merged phases + calendar page
export default function LunarCalendarRedirect() {
  redirect('/moon/phases')
}
