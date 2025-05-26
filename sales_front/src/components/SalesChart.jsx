import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import './SalesChart.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const API_BASE = 'http://localhost:8000/api'

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
      alert('Error fetching sales trend data')
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = {
    labels: salesTrend.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: salesTrend.map(item => parseFloat(item.total_sales)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Number of Orders',
        data: salesTrend.map(item => item.total_orders),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Trend Over Time',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales Amount ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Number of Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  if (isLoading) {
    return <div className="loading">Loading sales chart...</div>
  }

  return (
    <div className="sales-chart">
      <h2>Sales Chart</h2>
      
      {salesTrend.length === 0 ? (
        <div className="no-data">
          <p>No sales data available for chart display.</p>
          <p>Add some sales records to see the trend chart.</p>
        </div>
      ) : (
        <>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
          
          <div className="chart-summary">
            <h3>Sales Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Days with Sales:</span>
                <span className="stat-value">{salesTrend.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Revenue:</span>
                <span className="stat-value">
                  ${salesTrend.reduce((sum, item) => sum + parseFloat(item.total_sales), 0).toFixed(2)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Orders:</span>
                <span className="stat-value">
                  {salesTrend.reduce((sum, item) => sum + parseInt(item.total_orders), 0)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="refresh-container">
        <button onClick={fetchSalesTrend} className="refresh-btn">
          Refresh Chart
        </button>
      </div>
    </div>
  )
}

export default SalesChart
