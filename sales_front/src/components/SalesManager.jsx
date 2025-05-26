import { useState, useEffect } from 'react'
import axios from 'axios'
import './SalesManager.css'

const API_BASE = 'http://localhost:8000/api'

function SalesManager() {
  const [menus, setMenus] = useState([])
  const [formData, setFormData] = useState({
    menu_id: '',
    quantity: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/menus`)
      setMenus(response.data)
    } catch (error) {
      console.error('Error fetching menus:', error)
      alert('Error fetching menus')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post(`${API_BASE}/sales`, formData)
      alert('Sale recorded successfully!')
      setFormData({ menu_id: '', quantity: '' })
    } catch (error) {
      console.error('Error recording sale:', error)
      alert('Error recording sale')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const selectedMenu = menus.find(menu => menu.menu_id == formData.menu_id)
  const totalPrice = selectedMenu && formData.quantity ? 
    (selectedMenu.menu_price * formData.quantity).toFixed(2) : '0.00'

  return (
    <div className="sales-manager">
      <h2>Sales Entry</h2>
      
      <div className="sales-form-container">
        <form onSubmit={handleSubmit} className="sales-form">
          <div className="form-group">
            <label htmlFor="menu_id">Select Menu Item:</label>
            <select
              id="menu_id"
              name="menu_id"
              value={formData.menu_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a menu item --</option>
              {menus.map((menu) => (
                <option key={menu.menu_id} value={menu.menu_id}>
                  {menu.menu_name} - ${menu.menu_price}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter quantity"
            />
          </div>

          {selectedMenu && formData.quantity && (
            <div className="price-preview">
              <h4>Order Summary:</h4>
              <p><strong>Item:</strong> {selectedMenu.menu_name}</p>
              <p><strong>Unit Price:</strong> ${selectedMenu.menu_price}</p>
              <p><strong>Quantity:</strong> {formData.quantity}</p>
              <p><strong>Total Price:</strong> ${totalPrice}</p>
            </div>
          )}
          
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Recording Sale...' : 'Record Sale'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SalesManager
