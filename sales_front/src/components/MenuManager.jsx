import { useState, useEffect } from 'react'
import axios from 'axios'
import './MenuManager.css'

const API_BASE = 'http://localhost:8000/api'

function MenuManager() {
  const [menus, setMenus] = useState([])
  const [formData, setFormData] = useState({
    menu_name: '',
    menu_price: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

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
      if (editingId) {
        await axios.put(`${API_BASE}/menus/${editingId}`, formData)
        alert('Menu updated successfully!')
      } else {
        await axios.post(`${API_BASE}/menus`, formData)
        alert('Menu added successfully!')
      }
      
      setFormData({ menu_name: '', menu_price: '' })
      setEditingId(null)
      fetchMenus()
    } catch (error) {
      console.error('Error saving menu:', error)
      alert('Error saving menu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (menu) => {
    setFormData({
      menu_name: menu.menu_name,
      menu_price: menu.menu_price
    })
    setEditingId(menu.menu_id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`${API_BASE}/menus/${id}`)
        alert('Menu deleted successfully!')
        fetchMenus()
      } catch (error) {
        console.error('Error deleting menu:', error)
        alert('Error deleting menu')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const cancelEdit = () => {
    setFormData({ menu_name: '', menu_price: '' })
    setEditingId(null)
  }

  return (
    <div className="menu-manager">
      <h2>Menu Management</h2>
      
      <div className="menu-form-container">
        <h3>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-group">
            <label htmlFor="menu_name">Menu Name:</label>
            <input
              type="text"
              id="menu_name"
              name="menu_name"
              value={formData.menu_name}
              onChange={handleChange}
              required
              placeholder="Enter menu name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="menu_price">Price ($):</label>
            <input
              type="number"
              id="menu_price"
              name="menu_price"
              value={formData.menu_price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (editingId ? 'Update Menu' : 'Add Menu')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="menu-list-container">
        <h3>Menu Items</h3>
        {menus.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          <div className="menu-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.menu_id}>
                    <td>{menu.menu_id}</td>
                    <td>{menu.menu_name}</td>
                    <td>${menu.menu_price}</td>
                    <td>{new Date(menu.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(menu)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(menu.menu_id)}
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
    </div>
  )
}

export default MenuManager
