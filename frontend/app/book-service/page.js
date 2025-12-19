import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BookServicePage from '../../components/BookServicePage'
import { createMetadata } from '../../lib/metadata'
import { getCompanyInfo, getSiteSettings } from '../../lib/sanity'
import { companyInfo as mockCompanyInfo } from '../../lib/mockData'

export const metadata = createMetadata({
  title: 'Book HVAC Service | DFW HVAC | Dallas-Fort Worth',
  description: 'Schedule professional HVAC service with Dallas-Fort Worth\'s most trusted heating and cooling experts. Fast, reliable service.',
  keywords: 'book hvac service, schedule ac repair, dallas hvac appointment, fort worth heating service',
})

export default async function BookService() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <BookServicePage />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}