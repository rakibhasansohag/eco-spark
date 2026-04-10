import { PageHeader } from "@/components/shared/PageHeader"
import MyWatchlistContent from "@/components/modules/Member/Watchlist/MyWatchlistContent"

export default function MyWatchlistPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="My Saved Ideas"
        description="Ideas you have bookmarked for later reference."
      />
      <MyWatchlistContent />
    </section>
  )
}
