import Header from '../components/Header'
import Footer from '../components/Footer'
import HomePage from '../components/HomePage'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}