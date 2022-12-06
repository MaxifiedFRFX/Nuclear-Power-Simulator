import { useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'sdf', 'sdf', 'erqqwer'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3, 1, 5, 6],
          borderWidth: 1
        }]
      },
      options: {
        animation: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    return () => {
      myChart.destroy()
    }
  }, [])

  return (
    <>
      <div className="powerPlant">
        <section className="dashboard">
          <div className="plantName">
            <button>Change Name</button>
            <h1>Power Plant</h1>
          </div>
          <div className="graphAllReactors">
              <canvas ref={canvasRef}></canvas>
          </div>
          <div className="totalOutput">
            <h2>Average Temperature: 1234</h2>
            <h2>Total Output: 1234 GW</h2>
          </div>
          <div className="systemLogs"></div>
        </section>
        <section className="reactorsDisplay">
          <h1>Reactors</h1>
        </section>
      </div>
      <footer>
        <section className="dashboardFooter">
          <Button variant="contained">Enable Coolants on all Reactors</Button>
          <Button variant="contained">Disable Coolants on all Reactors</Button>
          <Button variant="contained">Global Controlled Shutdown</Button>
          <Button variant="contained" color="error">Global Reset</Button>
        </section>
        <section className="reactorsFooter">
          <Button variant="contained" color="error">Global Emergency Shutdown</Button>
        </section>
      </footer>
    </>
  )
}

export default App
