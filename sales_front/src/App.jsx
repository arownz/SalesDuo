import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Box, 
  Breadcrumbs, 
  Link,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { 
  Restaurant as MenuIcon, 
  PointOfSale as SalesIcon, 
  Analytics as AnalyticsIcon, 
  Assessment as ChartIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Menu as MenuHamburgerIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { Toaster } from 'react-hot-toast'
import { theme as customTheme } from './theme'
import './App.css'
import MenuManager from './components/MenuManager'
import SalesManager from './components/SalesManager'
import SalesDisplay from './components/SalesDisplay'
import SalesChart from './components/SalesChart'
import Dashboard from './components/Dashboard'

const drawerWidth = 280

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, component: <Dashboard /> },
    { id: 'menu', label: 'Menu Management', icon: <MenuIcon />, component: <MenuManager /> },
    { id: 'sales', label: 'Sales Entry', icon: <SalesIcon />, component: <SalesManager /> },
    { id: 'display', label: 'Sales Records', icon: <AnalyticsIcon />, component: <SalesDisplay /> },
    { id: 'chart', label: 'Analytics & Reports', icon: <ChartIcon />, component: <SalesChart /> }
  ]

  const activeMenuItem = menuItems.find(item => item.id === activeTab)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const drawerContent = (
    <Box sx={{ overflow: 'auto', pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => handleMenuItemClick(item.id)}
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
  )

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        width: '100%'
      }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#1976d2',
            boxShadow: 1,
            borderRadius: 0
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuHamburgerIcon />}
              </IconButton>
            )}
            <StoreIcon sx={{ mr: 2, fontSize: { xs: 24, sm: 32 } }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1" sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                SalesDuo
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                ml: 0, 
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' },
                fontSize: '0.875rem'
              }}>
                Sales Management System
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Navigation */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                borderRight: '1px solid #e0e0e0',
              },
            }}
          >
            <Toolbar />
            {drawerContent}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                borderRight: '1px solid #e0e0e0',
              },
            }}
            open
          >
            <Toolbar />
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            overflow: 'auto'
          }}
        >
          <Toolbar />
          
          {/* Breadcrumbs */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link 
                underline="hover" 
                color="inherit" 
                onClick={() => handleMenuItemClick('dashboard')}
                sx={{ 
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit'
                }}
              >
                Dashboard
              </Link>
              {activeTab !== 'dashboard' && (
                <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                  {activeMenuItem?.label}
                </Typography>
              )}
            </Breadcrumbs>
          </Box>

          {/* Page Content */}
          <Box sx={{ 
            width: '100%', 
            maxWidth: 'none',
            overflow: 'visible'
          }}>
            {activeMenuItem?.component}
          </Box>
        </Box>

        {/* Toast Notifications */}
        <Toaster 
          position={isMobile ? "top-center" : "top-right"}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              fontSize: isMobile ? '14px' : '16px',
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
