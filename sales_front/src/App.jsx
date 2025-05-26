import { useState } from 'react'
import './App.css'
import MenuManager from './components/MenuManager'
import SalesManager from './components/SalesManager'
import SalesDisplay from './components/SalesDisplay'
import SalesChart from './components/SalesChart'

function App() {
  const [activeTab, setActiveTab] = useState('menu')

  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'menu':
        return <MenuManager />
      case 'sales':
        return <SalesManager />
      case 'display':
        return <SalesDisplay />
      case 'chart':
        return <SalesChart />
      default:
        return <MenuManager />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>SalesDuo - Sales Management System</h1>
        <nav className="navigation">
          <button 
            className={activeTab === 'menu' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
          <button 
            className={activeTab === 'sales' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('sales')}
          >
            Sales Entry
          </button>
          <button 
            className={activeTab === 'display' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('display')}
          >
            Sales Display
          </button>
          <button 
            className={activeTab === 'chart' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('chart')}
          >
            Sales Chart
          </button>
        </nav>
      </header>
      <main className="main-content">
        {renderActiveComponent()}
      </main>
    </div>
  )
}

export default App
