import { useState, useEffect, useRef } from 'react'
import { Button, Link } from '@mui/material'
import './App.css'
import ReactorCard from './components/ReactorCard'
import { json } from 'react-router-dom'

function App() {
    const [powerPlantName, setPowerPlantName] = useState('Set Power Plant Name')
    const [logs, setLogs] = useState([])
    const [hotStuff, setHotStuff] = useState("")
    const [hotStuffRendering, setHotStuffRendering] = useState(true)
    const canvasRef = useRef(null)

    useEffect(() => {
        (async () => {
            const rawData = await fetch("https://nuclear.dacoder.io/reactors?apiKey=1ca0a1826e8c6b39")
            const jsonData = await rawData.json()
            setHotStuff(jsonData)
            setHotStuffRendering(false)
        })()
    }, [])

    useEffect(() => {
        if (!hotStuffRendering) {
            (async () => {
                console.log(hotStuff)
                for (var i = 0; i < hotStuff.reactors.length; i++) {
                    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/temperature/${hotStuff.reactors[i].id}?apiKey=1ca0a1826e8c6b39`)
                    const jsonData = await rawData.json()
                    var newHotStuff = hotStuff
                    newHotStuff.reactors[i].temperature = {
                        "amount": jsonData.temperature.amount,
                        "unit": jsonData.temperature.unit,
                        "status": jsonData.temperature.status
                    }
                    setHotStuff(newHotStuff)
                }
                console.log("Finished hotStuff:")
                console.log(hotStuff)
            })()
        }
    }, [hotStuffRendering])

    useEffect(() => {
        if (!hotStuffRendering) {
            (async () => {
                console.log(hotStuff)
                for (var i = 0; i < hotStuff.reactors.length; i++) {
                    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/output/${hotStuff.reactors[i].id}?apiKey=1ca0a1826e8c6b39`)
                    const jsonData = await rawData.json()
                    var newHotStuff = hotStuff
                    newHotStuff.reactors[i].output = {
                        "amount": jsonData.output.amount,
                        "unit": jsonData.output.unit,
                    }
                    setHotStuff(newHotStuff)
                }
                console.log("Finished hotStuff:")
                console.log(hotStuff)
            })()
        }
    }, [hotStuffRendering])

    useEffect(() => {
        if (!hotStuffRendering) {
            (async () => {
                console.log(hotStuff)
                for (var i = 0; i < hotStuff.reactors.length; i++) {
                    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/coolant/${hotStuff.reactors[i].id}?apiKey=1ca0a1826e8c6b39`)
                    const jsonData = await rawData.json()
                    var newHotStuff = hotStuff
                    newHotStuff.reactors[i].coolant = jsonData.coolant
                    setHotStuff(newHotStuff)
                }
                console.log("Finished hotStuff:")
                console.log(hotStuff)
            })()
        }
    }, [hotStuffRendering])

    useEffect(() => {
        if (!hotStuffRendering) {
            (async () => {
                console.log(hotStuff)
                for (var i = 0; i < hotStuff.reactors.length; i++) {
                    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/fuel-level/${hotStuff.reactors[i].id}?apiKey=1ca0a1826e8c6b39`)
                    const jsonData = await rawData.json()
                    var newHotStuff = hotStuff
                    newHotStuff.reactors[i].fuel = jsonData.fuel.percentage
                    setHotStuff(newHotStuff)
                }
                console.log("Finished hotStuff:")
                console.log(hotStuff)
            })()
        }
    }, [hotStuffRendering])

    useEffect(() => {
        if (!hotStuffRendering) {
            (async () => {
                console.log(hotStuff)
                for (var i = 0; i < hotStuff.reactors.length; i++) {
                    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/reactor-state/${hotStuff.reactors[i].id}?apiKey=1ca0a1826e8c6b39`)
                    const jsonData = await rawData.json()
                    var newHotStuff = hotStuff
                    newHotStuff.reactors[i].state = jsonData.state
                    setHotStuff(newHotStuff)
                }
                console.log("Finished hotStuff:")
                console.log(hotStuff)
            })()
        }
    }, [hotStuffRendering])

    useEffect(() => {
        if (!hotStuffRendering) {
            (async () => {
                console.log(hotStuff)
                for (var i = 0; i < hotStuff.reactors.length; i++) {
                    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/rod-state/${hotStuff.reactors[i].id}?apiKey=1ca0a1826e8c6b39`)
                    const jsonData = await rawData.json()
                    var newHotStuff = hotStuff
                    newHotStuff.reactors[i].control_rods = {
                        "in": jsonData.control_rods.in,
                        "out": jsonData.control_rods.out
                    }
                    setHotStuff(newHotStuff)
                }
                console.log("Finished hotStuff:")
                console.log(hotStuff)
            })()
        }
    }, [hotStuffRendering])

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

    useEffect(() => {
        const idTimer = setInterval(fetchLogData, 1000)

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
                        <Button variant="contained">Change Name</Button>
                        <input type="text" placeholder={hotStuff["plant_name"]}></input>
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
                        hotStuff === "" ? "loading" : hotStuff["reactors"].map(reactor => (
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
