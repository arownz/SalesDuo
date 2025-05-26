import { useState, useEffect } from 'react'
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Divider
} from '@mui/material'
import { 
  TrendingUp, 
  Restaurant, 
  AttachMoney, 
  ShoppingCart,
  Schedule,
  Star
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import axios from 'axios'
import toast from 'react-hot-toast'

const COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0', '#f57c00']

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalMenuItems: 0,
    avgOrderValue: 0,
    recentSales: [],
    topSellingItems: [],
    salesTrend: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all required data
      const [salesResponse, menuResponse, trendResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/sales'),
        axios.get('http://127.0.0.1:8000/api/menus'),
        axios.get('http://127.0.0.1:8000/api/sales-trend')
      ])

      const sales = salesResponse.data
      const menus = menuResponse.data
      const trend = trendResponse.data

      // Calculate dashboard metrics
      const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0)
      const totalOrders = sales.length
      const totalMenuItems = menus.length
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

      // Get recent sales (last 5)
      const recentSales = sales.slice(-5).reverse()

      // Calculate top selling items
      const itemSales = {}
      sales.forEach(sale => {
        const menuName = sale.menu_name
        if (!itemSales[menuName]) {
          itemSales[menuName] = { name: menuName, quantity: 0, revenue: 0 }
        }
        itemSales[menuName].quantity += sale.quantity
        itemSales[menuName].revenue += parseFloat(sale.total_price)
      })

      const topSellingItems = Object.values(itemSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 6)

      // Prepare trend data for chart
      const salesTrend = trend.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        sales: parseFloat(item.total_sales),
        orders: parseInt(item.total_orders)
      }))

      setDashboardData({
        totalSales,
        totalOrders,
        totalMenuItems,
        avgOrderValue,
        recentSales,
        topSellingItems,
        salesTrend
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(dashboardData.totalSales)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Total Sales
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AttachMoney fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData.totalOrders}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Total Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ShoppingCart fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData.totalMenuItems}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Menu Items
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Restaurant fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(dashboardData.avgOrderValue)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Avg Order Value
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Sales Trend
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dashboardData.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? formatCurrency(value) : value,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    dot={{ fill: '#1976d2', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Sales */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Sales
              </Typography>
              <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                {dashboardData.recentSales.map((sale, index) => (
                  <Box key={sale.sales_id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {sale.menu_name}
                            </Typography>
                            <Chip 
                              label={formatCurrency(sale.total_price)} 
                              color="primary" 
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {sale.quantity} × {formatCurrency(sale.menu_price)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(sale.created_at)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < dashboardData.recentSales.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Top Selling Items
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.topSellingItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value) : value,
                        name === 'revenue' ? 'Revenue' : 'Quantity Sold'
                      ]}
                    />
                    <Bar dataKey="quantity" fill="#1976d2" name="quantity" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
