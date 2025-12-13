import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BookServicePage from '../../components/BookServicePage'
import { createMetadata } from '../../lib/metadata'

export const metadata = createMetadata({
  title: 'Book HVAC Service | DFW HVAC | Dallas-Fort Worth',
  description: 'Schedule professional HVAC service with Dallas-Fort Worth\'s most trusted heating and cooling experts. Fast, reliable service.',
  keywords: 'book hvac service, schedule ac repair, dallas hvac appointment, fort worth heating service',
})

export default function BookService() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BookServicePage />
      </main>
      <Footer />
    </div>
  )
}