import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import './MenuManager.css'
import toast from 'react-hot-toast'

function MenuManager() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ menu_name: '', menu_price: '' })
  const [editingMenu, setEditingMenu] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://127.0.0.1:8000/api/menus')
      setMenus(response.data)
    } catch (error) {
      console.error('Error fetching menus:', error)
      toast.error('Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.menu_name.trim()) {
      toast.error('Menu name is required')
      return
    }
    
    if (!formData.menu_price || parseFloat(formData.menu_price) <= 0) {
      toast.error('Valid price is required')
      return
    }

    try {
      setLoading(true)
      
      if (editingMenu) {
        await axios.put(`http://127.0.0.1:8000/api/menus/${editingMenu.menu_id}`, formData)
        toast.success('Menu item updated successfully!')
      } else {
        await axios.post('http://127.0.0.1:8000/api/menus', formData)
        toast.success('Menu item added successfully!')
      }
      
      resetForm()
      fetchMenus()
      setOpenDialog(false)
    } catch (error) {
      console.error('Error saving menu:', error)
      toast.error('Failed to save menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (menu) => {
    setEditingMenu(menu)
    setFormData({ menu_name: menu.menu_name, menu_price: menu.menu_price })
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    if (!menuToDelete) return

    try {
      setLoading(true)
      await axios.delete(`http://127.0.0.1:8000/api/menus/${menuToDelete.menu_id}`)
      toast.success('Menu item deleted successfully!')
      fetchMenus()
      setDeleteDialogOpen(false)
      setMenuToDelete(null)
    } catch (error) {
      console.error('Error deleting menu:', error)
      toast.error('Failed to delete menu item')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ menu_name: '', menu_price: '' })
    setEditingMenu(null)
  }

  const openAddDialog = () => {
    resetForm()
    setOpenDialog(true)
  }

  const openDeleteDialog = (menu) => {
    setMenuToDelete(menu)
    setDeleteDialogOpen(true)
  }

  const filteredMenus = menus.filter(menu =>
    menu.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const columns = [
    {
      field: 'menu_id',
      headerName: 'ID',
      width: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'menu_name',
      headerName: 'Menu Item',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <RestaurantIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'menu_price',
      headerName: 'Price',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={formatCurrency(params.value)} 
          color="success" 
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            onClick={() => handleEdit(params.row)} 
            color="primary" 
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={() => openDeleteDialog(params.row)} 
            color="error" 
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Menu Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMenus}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {menus.length}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Total Items
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <RestaurantIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(menus.reduce((sum, menu) => sum + parseFloat(menu.menu_price || 0), 0) / (menus.length || 1))}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Avg Price
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {Math.max(...menus.map(menu => parseFloat(menu.menu_price || 0))) > 0 ? 
                      formatCurrency(Math.max(...menus.map(menu => parseFloat(menu.menu_price || 0)))) : 
                      '$0.00'
                    }
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Highest Price
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <TextField
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              size="large"
            >
              Add Menu Item
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredMenus}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              getRowId={(row) => row.menu_id}
              loading={loading}
              disableSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f8f9fa',
                  borderBottom: '2px solid #e0e0e0',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Menu Name"
              value={formData.menu_name}
              onChange={(e) => setFormData({...formData, menu_name: e.target.value})}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RestaurantIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.menu_price}
              onChange={(e) => setFormData({...formData, menu_price: e.target.value})}
              margin="normal"
              required
              inputProps={{ step: "0.01", min: "0" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (editingMenu ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete "{menuToDelete?.menu_name}"? This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MenuManager
