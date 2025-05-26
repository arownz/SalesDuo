import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material'
import { 
  PointOfSale as SalesIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = 'http://127.0.0.1:8000/api'

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
      toast.error('Failed to fetch menu items')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post(`${API_BASE}/sales`, formData)
      toast.success('Sale recorded successfully!')
      setFormData({ menu_id: '', quantity: '' })
    } catch (error) {
      console.error('Error recording sale:', error)
      toast.error('Failed to record sale')
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          color: 'text.primary',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}>
          Sales Entry
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Sales Form */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}>
                  <SalesIcon />
                </Avatar>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  New Sale Entry
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select Menu Item</InputLabel>
                      <Select
                        name="menu_id"
                        value={formData.menu_id}
                        onChange={handleChange}
                        label="Select Menu Item"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                      >
                        {menus.map((menu) => (
                          <MenuItem key={menu.menu_id} value={menu.menu_id}>
                            <Box display="flex" alignItems="center" gap={2} width="100%">
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                <RestaurantIcon fontSize="small" />
                              </Avatar>
                              <Box flexGrow={1}>
                                <Typography variant="body2" fontWeight={500}>
                                  {menu.menu_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatCurrency(menu.menu_price)}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      inputProps={{ min: "1", step: "1" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CartIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {selectedMenu && formData.quantity && (
                    <Grid item xs={12}>
                      <Paper sx={{ 
                        p: { xs: 2, sm: 3 }, 
                        bgcolor: 'grey.50', 
                        border: '2px dashed', 
                        borderColor: 'primary.main' 
                      }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          color: 'primary.main', 
                          fontWeight: 600,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          Order Preview
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={6}>
                            <Typography variant="body2" color="text.secondary">Item:</Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {selectedMenu.menu_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Typography variant="body2" color="text.secondary">Unit Price:</Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {formatCurrency(selectedMenu.menu_price)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Typography variant="body2" color="text.secondary">Quantity:</Typography>
                            <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {formData.quantity}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Typography variant="body2" color="text.secondary">Total:</Typography>
                            <Chip 
                              label={formatCurrency(totalPrice)} 
                              color="success" 
                              sx={{ 
                                fontWeight: 700, 
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      disabled={isLoading || !formData.menu_id || !formData.quantity}
                      startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
                      fullWidth
                      sx={{ 
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {isLoading ? 'Recording Sale...' : 'Record Sale'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={{ xs: 2, sm: 3 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}>
                      {menus.length}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      opacity: 0.9,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                      Available Items
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 40, sm: 48 }
                  }}>
                    <RestaurantIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}>
                      {selectedMenu && formData.quantity ? formatCurrency(totalPrice) : '$0.00'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      opacity: 0.9,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                      Current Order
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 40, sm: 48 }
                  }}>
                    <MoneyIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>

            {selectedMenu && (
              <Card>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Selected Item Details
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                      <RestaurantIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {selectedMenu.menu_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {formatCurrency(selectedMenu.menu_price)} per item
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SalesManager
