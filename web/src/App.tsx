import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PropertyList from './components/PropertyList'
import PropertyDetail from './components/PropertyDetail'
import PropertyForm from './components/PropertyForm'
import Header from './components/Header'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<PropertyList />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/property/new" element={<PropertyForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
