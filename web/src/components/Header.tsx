import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-[#6B2337] text-white border-b border-[#5a1e2f]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                <span className="text-white text-sm">🏠</span>
              </div>
              <span className="text-sm opacity-80">Interface</span>
              <span className="text-sm">더부동산 임시매물장</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/property/new" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-sm">
              매물 등록
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
