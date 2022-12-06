import { useState, useEffect, useRef } from 'react'
import { Button, Link } from '@mui/material'
import './App.css'
import ReactorCard from './components/ReactorCard'

function App() {
  const [powerPlantName, setPowerPlantName] = useState('Set Power Plant Name')
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
            <Button variant="contained">Change Name</Button>
            <input type="text" placeholder={powerPlantName}></input>
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
          <ReactorCard />
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
          <Link href="https://www.freepik.com/free-vector/nuclear-energy-icons-yellow-background_3977300.htm#query=reactors&position=28&from_view=search&track=sph%22%3EImage" underline="hover" color="inherit">
            {'Reactor Image by macrovector on Freepik'}
          </Link>
        </section>
      </footer>
    </>
  )
}

export default App
