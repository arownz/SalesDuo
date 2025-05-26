import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Analytics as AnalyticsIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = 'http://127.0.0.1:8000/api'

function SalesDisplay() {
  const [sales, setSales] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [saleToDelete, setSaleToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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
      toast.error('Failed to fetch sales data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!saleToDelete) return

    try {
      setIsLoading(true)
      await axios.delete(`${API_BASE}/sales/${saleToDelete.sales_id}`)
      toast.success('Sale deleted successfully!')
      fetchSales()
      setDeleteDialogOpen(false)
      setSaleToDelete(null)
    } catch (error) {
      console.error('Error deleting sale:', error)
      toast.error('Failed to delete sale')
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (sale) => {
    setSaleToDelete(sale)
    setDeleteDialogOpen(true)
  }

  const filteredSales = sales.filter(sale =>
    sale.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  const columns = [
    {
      field: 'sales_id',
      headerName: 'ID',
      width: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'menu_name',
      headerName: 'Menu Item',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 }, bgcolor: 'primary.main' }}>
            <RestaurantIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'menu_price',
      headerName: 'Price',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={formatCurrency(params.value)} 
          color="info" 
          variant="outlined"
          size="small"
          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
        />
      ),
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'total_price',
      headerName: 'Total',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={formatCurrency(params.value)} 
          color="success" 
          variant="filled"
          size="small"
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '0.625rem', sm: '0.75rem' }
          }}
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Date',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <IconButton 
          onClick={() => openDeleteDialog(params.row)} 
          color="error" 
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          color: 'text.primary',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}>
          Sales Records
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSales}
            disabled={isLoading}
            size={window.innerWidth < 600 ? "small" : "medium"}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '2rem', md: '2.125rem' }
                  }}>
                    {sales.length}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }}>
                    Total Sales
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: { xs: 32, sm: 48 }, 
                  height: { xs: 32, sm: 48 }
                }}>
                  <ReceiptIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '2rem', md: '2.125rem' }
                  }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }}>
                    Total Revenue
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: { xs: 32, sm: 48 }, 
                  height: { xs: 32, sm: 48 }
                }}>
                  <MoneyIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)', color: 'white' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', sm: '2rem', md: '2.125rem' }
                  }}>
                    {sales.length > 0 ? formatCurrency(totalRevenue / sales.length) : '$0.00'}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }}>
                    Avg Sale Value
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: { xs: 32, sm: 48 }, 
                  height: { xs: 32, sm: 48 }
                }}>
                  <TrendingUpIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '2rem', md: '2.125rem' }
                  }}>
                    {sales.reduce((sum, sale) => sum + sale.quantity, 0)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }}>
                    Items Sold
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: { xs: 32, sm: 48 }, 
                  height: { xs: 32, sm: 48 }
                }}>
                  <AnalyticsIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextField
            placeholder="Search sales records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: { xs: '100%', sm: 300 },
              '& .MuiInputBase-input': {
                fontSize: { xs: '16px', sm: '1rem' } // Prevent zoom on iOS
              }
            }}
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: { xs: 400, sm: 600 }, width: '100%' }}>
            {filteredSales.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" p={3}>
                <ReceiptIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  No sales records found
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start recording sales to see them here'}
                </Typography>
              </Box>
            ) : (
              <DataGrid
                rows={filteredSales}
                columns={columns}
                pageSize={window.innerWidth < 600 ? 5 : 10}
                rowsPerPageOptions={window.innerWidth < 600 ? [5, 10] : [10, 25, 50]}
                getRowId={(row) => row.sales_id}
                loading={isLoading}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '4px 8px', sm: '8px 16px' },
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8f9fa',
                    borderBottom: '2px solid #e0e0e0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  },
                  '& .MuiDataGrid-columnHeader': {
                    padding: { xs: '4px 8px', sm: '8px 16px' },
                  },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

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
            Are you sure you want to delete this sale record? This action cannot be undone.
          </Alert>
          {saleToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Sale ID: {saleToDelete.sales_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Item: {saleToDelete.menu_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {formatCurrency(saleToDelete.total_price)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SalesDisplay
