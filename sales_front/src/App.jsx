import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Box, Container, Breadcrumbs, Link, Divider } from '@mui/material'
import { 
  Restaurant as MenuIcon, 
  PointOfSale as SalesIcon, 
  Analytics as AnalyticsIcon, 
  Assessment as ChartIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon
} from '@mui/icons-material'
import { Toaster } from 'react-hot-toast'
import { theme } from './theme'
import './App.css'
import MenuManager from './components/MenuManager'
import SalesManager from './components/SalesManager'
import SalesDisplay from './components/SalesDisplay'
import SalesChart from './components/SalesChart'
import Dashboard from './components/Dashboard'

const drawerWidth = 280

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, component: <Dashboard /> },
    { id: 'menu', label: 'Menu Management', icon: <MenuIcon />, component: <MenuManager /> },
    { id: 'sales', label: 'Sales Entry', icon: <SalesIcon />, component: <SalesManager /> },
    { id: 'display', label: 'Sales Records', icon: <AnalyticsIcon />, component: <SalesDisplay /> },
    { id: 'chart', label: 'Analytics & Reports', icon: <ChartIcon />, component: <SalesChart /> }
  ]

  const activeMenuItem = menuItems.find(item => item.id === activeTab)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
          }}
        >
          <Toolbar>
            <StoreIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              SalesDuo
            </Typography>
            <Typography variant="subtitle1" sx={{ ml: 2, opacity: 0.9 }}>
              Sales Management System
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Navigation */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', pt: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 1, px: 2 }}>
                  <ListItemButton
                    selected={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: activeTab === item.id ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          
          {/* Breadcrumbs */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                {activeMenuItem?.label}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Page Content */}
          <Container maxWidth={false} sx={{ px: 0 }}>
            {activeMenuItem?.component}
          </Container>
        </Box>

        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />
      </Box>
    </ThemeProvider>
  )
}

export default App
