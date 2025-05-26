import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Avatar,
  Chip,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material'
import { 
  Assessment as ChartIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = 'http://127.0.0.1:8000/api'

function SalesChart() {
  const [salesTrend, setSalesTrend] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSalesTrend()
  }, [])
  const fetchSalesTrend = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE}/sales-trend`)
      setSalesTrend(response.data)
    } catch (error) {
      console.error('Error fetching sales trend:', error)
      toast.error('Failed to fetch sales trend data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const totalRevenue = salesTrend.reduce((sum, item) => sum + parseFloat(item.total_sales), 0)
  const totalOrders = salesTrend.reduce((sum, item) => sum + parseInt(item.total_orders), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const chartData = salesTrend.map(item => ({
    date: formatDate(item.date),
    sales: parseFloat(item.total_sales),
    orders: parseInt(item.total_orders),
    fullDate: item.date
  }))

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Analytics & Reports
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSalesTrend}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {salesTrend.length}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Days with Sales
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <AnalyticsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Total Revenue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalOrders}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Total Orders
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <ReceiptIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(avgOrderValue)}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Avg Order Value
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {salesTrend.length === 0 ? (
        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
              <ChartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No sales data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some sales records to see the trend charts.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Sales Trend Line Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sales Trend Over Time
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'sales' ? formatCurrency(value) : value,
                          name === 'sales' ? 'Sales' : 'Orders'
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#1976d2" 
                        strokeWidth={3}
                        name="Daily Sales"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Orders Bar Chart */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Daily Orders
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#2e7d32" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Detailed Summary
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Peak Sales Day
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {salesTrend.length > 0 ? 
                          formatCurrency(Math.max(...salesTrend.map(item => parseFloat(item.total_sales)))) : 
                          '$0.00'
                        }
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Peak Orders Day
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {salesTrend.length > 0 ? 
                          Math.max(...salesTrend.map(item => parseInt(item.total_orders))) : 
                          0
                        }
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Avg Daily Sales
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {formatCurrency(salesTrend.length > 0 ? totalRevenue / salesTrend.length : 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Avg Daily Orders
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {(salesTrend.length > 0 ? totalOrders / salesTrend.length : 0).toFixed(1)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default SalesChart
