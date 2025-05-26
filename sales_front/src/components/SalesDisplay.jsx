import { useState, useEffect } from 'react'
import axios from 'axios'
import './SalesDisplay.css'

const API_BASE = 'http://localhost:8000/api'

function SalesDisplay() {
  const [sales, setSales] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE}/sales`)
      setSales(response.data)
      
      // Calculate total revenue
      const revenue = response.data.reduce((sum, sale) => sum + sale.total_price, 0)
      setTotalRevenue(revenue)
    } catch (error) {
      console.error('Error fetching sales:', error)
      alert('Error fetching sales data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      try {
        await axios.delete(`${API_BASE}/sales/${id}`)
        alert('Sale deleted successfully!')
        fetchSales()
      } catch (error) {
        console.error('Error deleting sale:', error)
        alert('Error deleting sale')
      }
    }
  }

  if (isLoading) {
    return <div className="loading">Loading sales data...</div>
  }

  return (
    <div className="sales-display">
      <h2>Sales Display</h2>
      
      <div className="sales-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p className="summary-number">{sales.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="summary-number">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="sales-table-container">
        <h3>Sales Records</h3>
        {sales.length === 0 ? (
          <p>No sales records found.</p>
        ) : (
          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Menu Item</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.sales_id}>
                    <td>{sale.sales_id}</td>
                    <td>{sale.menu_name}</td>
                    <td>${sale.menu_price}</td>
                    <td>{sale.quantity}</td>
                    <td className="total-price">${sale.total_price.toFixed(2)}</td>
                    <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(sale.sales_id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="refresh-container">
        <button onClick={fetchSales} className="refresh-btn">
          Refresh Data
        </button>
      </div>
    </div>
  )
}

export default SalesDisplay
