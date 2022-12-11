import { useState, useEffect, useRef } from 'react'
import { Button, Link } from '@mui/material'
import './App.css'
import ReactorCard from './components/ReactorCard'
import { json } from 'react-router-dom'

function App() {
    const [powerPlantInput, setPowerPlantInput] = useState("")
    const [powerPlantName, setPowerPlantName] = useState('Set Power Plant Name')
    const [logs, setLogs] = useState([])
    const [hotStuff, setHotStuff] = useState("")
    const [hotStuffRendering, setHotStuffRendering] = useState(true)
    const canvasRef = useRef(null)

    const fetchAll = async () => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors?apiKey=1ca0a1826e8c6b39")
        const jsonData = await rawData.json()
        jsonData.reactors = await Promise.all(jsonData.reactors.map(async reactor => {
            const rawDataTemperature = await fetch(`https://nuclear.dacoder.io/reactors/temperature/${reactor.id}?apiKey=1ca0a1826e8c6b39`)
            const jsonDataTemperature = await rawDataTemperature.json()

            const rawDataOutput = await fetch(`https://nuclear.dacoder.io/reactors/output/${reactor.id}?apiKey=1ca0a1826e8c6b39`)
            const jsonDataOutput = await rawDataOutput.json()

            const rawDataCoolant = await fetch(`https://nuclear.dacoder.io/reactors/coolant/${reactor.id}?apiKey=1ca0a1826e8c6b39`)
            const jsonDataCoolant = await rawDataCoolant.json()

            const rawDataFuel = await fetch(`https://nuclear.dacoder.io/reactors/fuel-level/${reactor.id}?apiKey=1ca0a1826e8c6b39`)
            const jsonDataFuel = await rawDataFuel.json()

            const rawDataReactorState = await fetch(`https://nuclear.dacoder.io/reactors/reactor-state/${reactor.id}?apiKey=1ca0a1826e8c6b39`)
            const jsonDataReactorState = await rawDataReactorState.json()

            const rawDataRodState = await fetch(`https://nuclear.dacoder.io/reactors/rod-state/${reactor.id}?apiKey=1ca0a1826e8c6b39`)
            const jsonDataRodState = await rawDataRodState.json()

            return {
                ...reactor,
                temperature: jsonDataTemperature.temperature,
                output: jsonDataOutput.output,
                coolant: jsonDataCoolant.coolant,
                fuel: jsonDataFuel.fuel.percentage,
                state: jsonDataReactorState.state,
                control_rods: jsonDataRodState.control_rods,
            }
        }))
        setHotStuff(jsonData)
        setHotStuffRendering(false)
    }

    const handleNewPlantName = async (event) => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors/plant-name?apiKey=1ca0a1826e8c6b39", {
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
          method: "PUT",
          body: JSON.stringify({ name: powerPlantInput }),
        })
        const jsonData = await rawData.json()
      }

    const handleNewPlantName = async (event) => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors/plant-name?apiKey=1ca0a1826e8c6b39", {
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
          method: "PUT",
          body: JSON.stringify({ name: powerPlantInput }),
        })
        const jsonData = await rawData.json()
      }

    const fetchLogData = async () => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors/logs?apiKey=1ca0a1826e8c6b39")
        const jsonData = await rawData.json()

        // [{key: []}, {key: []}, {key: []}]
        // [[1, 2], [3, 4]] ==> [1, 2, 3, 4]
        const flattenedLogs = jsonData.flatMap(obj => {
            return Object.keys(obj).flatMap(key => {
                return obj[key]
            })
        })
        setLogs(flattenedLogs)
        console.log(flattenedLogs)
    }

    const interval = () => {
        fetchLogData()
        fetchAll()
    }

    useEffect(() => {
<<<<<<< Updated upstream
        const idTimer = setInterval(interval, 1000)

=======
        const idTimer = setInterval(fetchLogData, 1000)
        
>>>>>>> Stashed changes
        return () => {
            clearInterval(idTimer)
        }
    }, [])


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
        <div className="body">
            <div className="powerPlant">
                <section className="dashboard">
                    <div className="plantName">
                        <Button variant="contained" onClick={handleNewPlantName}>Change Name</Button>
                        <input type="text" value={powerPlantInput} placeholder={powerPlantName} onChange={(event) => setPowerPlantInput(event.target.value)}></input>
                    </div>
                    <div className="graphAllReactors">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                    <div className="totalOutput">
                        <h2>Average Temperature: 1234</h2>
                        <h2>Total Output: 1234 GW</h2>
                    </div>
                    <div className="systemLogs">
                        {
                            logs.map(log => {
                                return <p key={log}>{log}</p>
                            })
                        }
                    </div>
                </section>
                <section className="reactorsDisplay">
                    <h1>Reactors</h1>
                    {
                        hotStuffRendering ? "loading" : hotStuff.reactors.map(reactor => (
                            <div key={reactor.id}>
                                <ReactorCard reactor={reactor} hotStuffRendering={hotStuffRendering} />
                            </div>
                        ))
                    }
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
        </div>
    )
}

export default App
