import { useState, useEffect, useRef } from 'react'
import { Button, Link } from '@mui/material'
import './App.css'
import ReactorCard from './components/ReactorCard'
import { } from 'notistack';
import ReactorChart from './components/ReactorChart'
import PowerPlantName from './components/PowerPlantName'

function App() {
    const [powerPlantInput, setPowerPlantInput] = useState("")
    const [allAverTemp, setAllAverTemp] = useState([])
    const [logs, setLogs] = useState([])
    const [hotStuff, setHotStuff] = useState({
        plant_name: "",
        reactors: []
    })
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
        setPowerPlantInput(jsonData.plant_name)
        setAllAverTemp(prevAllAverTemp => [
            ...prevAllAverTemp,
            jsonData.reactors.reduce((acc, reactor) => {
                return acc + reactor.temperature.amount
            }, 0) / jsonData.reactors.length
        ].slice(-300))
        console.log(jsonData)
        setHotStuff(jsonData)
        setHotStuffRendering(false)
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
    }

    const handleGlobalControlledShutdown = () => {
        hotStuff.reactors.map(async reactor => {
            await fetch(`https://nuclear.dacoder.io/reactors/controlled-shutdown/${reactor.id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(data => (!data.ok) ? console.log(data) : null)
        }
        )
    }

    const globalEmergencyShutdown = () => {
        hotStuff.reactors.map(async reactor => {
            await fetch(`https://nuclear.dacoder.io/reactors/emergency-shutdown/${reactor.id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(data => (!data.ok) ? console.log(data) : null)
        }
        )
    }


    const globalDisableCoolant = () => {
        hotStuff.reactors.map(async reactor => {
            await fetch(`https://nuclear.dacoder.io/reactors/coolant/${reactor.id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "coolant": "off"
                }),
            }).then(data => (!data.ok) ? console.log(data) : null)
        })
    }

    const globalEnableCoolant = () => {
        hotStuff.reactors.map(async reactor => {
            await fetch(`https://nuclear.dacoder.io/reactors/coolant/${reactor.id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "coolant": "on"
                }),
            }).then(data => (!data.ok) ? console.log(data) : null)
        })
    }

    const globalReset = async () => {
        await fetch(`https://nuclear.dacoder.io/reactors/reset?apiKey=1ca0a1826e8c6b39`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        ).then(data => (!data.ok) ? console.log(data) : null)
    }


    const interval = () => {
        fetchLogData()
        fetchAll()
    }

    useEffect(() => {
        const idTimer = setInterval(interval, 1000)
        // const dashTemp = setInterval(tempArray, 1000)

        return () => {
            clearInterval(idTimer)
            // clearInterval(dashTemp)
        }

    }, [])

<<<<<<< HEAD

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 300 },
                (_, index) => index + 1),
                datasets: [{
                    label: "Total Average Temperature",
                    data: allAverTemp,
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
    }, [allAverTemp])

=======
>>>>>>> c807c437322b984888fc7aff8572be4b190b856e
    return (
        <div className="body">
            <div className="powerPlant">
                <section className="dashboard">
                    <PowerPlantName powerPlantName={powerPlantInput} />
                    <div className="graphAllReactors">
                        <ReactorChart temperature={allAverTemp} name={"Average Temperature the Last 5 Minutes"} />
                    </div>
                    <div className="totalOutput">
                        <h2>Average Temperature: {parseFloat(allAverTemp.slice(-1)).toFixed(2)}</h2>
                        <h2>Total Output:
                            {" " + (parseFloat(
                                hotStuff.reactors.reduce((acc, reactor) => {
                                    return acc + reactor.output.amount
                                }, 0)
                            ).toFixed(2) + ((hotStuff.output?.unit == "Megawatt (MW)") ? " MW" : "GW")) ?? "..."
                            }</h2>
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
                    <Button variant="contained" onClick={globalEnableCoolant}>Enable Coolants on all Reactors</Button>
                    <Button variant="contained" onClick={globalDisableCoolant}>Disable Coolants on all Reactors</Button>
                    <Button variant="contained" onClick={handleGlobalControlledShutdown}>Global Controlled Shutdown</Button>
                    <Button variant="contained" color="error" onClick={globalReset}>Global Reset</Button>
                </section>
                <section className="reactorsFooter">
                    <Button variant="contained" color="error" onClick={globalEmergencyShutdown}>Global Emergency Shutdown</Button>
                    <Link href="https://www.freepik.com/free-vector/nuclear-energy-icons-yellow-background_3977300.htm#query=reactors&position=28&from_view=search&track=sph%22%3EImage" underline="hover" color="inherit">
                        {'Reactor Image by macrovector on Freepik'}
                    </Link>
                </section>
            </footer>
        </div>
    )
}

export default App
