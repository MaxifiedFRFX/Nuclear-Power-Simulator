import { Card, CardContent, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material"
import { Link, Router, useParams } from "react-router-dom"
import SafeReactor from '../assets/SafeReactor.svg'
import { useEffect, useState, useRef } from 'react'
import '../App.css'

const Reactor = () => {
    const [hotStuff, setHotStuff] = useState("")
    const [hotStuffRendering, setHotStuffRendering] = useState(true)
    const [temperature, setTemperature] = useState([])
    const canvasRef = useRef(null)

    const { id } = useParams()

    const fetchAll = async () => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors?apiKey=1ca0a1826e8c6b39")
        let jsonData = await rawData.json()
        jsonData = jsonData.reactors.find(reactor => reactor.id == id)
        const rawDataTemperature = await fetch(`https://nuclear.dacoder.io/reactors/temperature/${id}?apiKey=1ca0a1826e8c6b39`)
        const jsonDataTemperature = await rawDataTemperature.json()

        const rawDataOutput = await fetch(`https://nuclear.dacoder.io/reactors/output/${id}?apiKey=1ca0a1826e8c6b39`)
        const jsonDataOutput = await rawDataOutput.json()

        const rawDataCoolant = await fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=1ca0a1826e8c6b39`)
        const jsonDataCoolant = await rawDataCoolant.json()

        const rawDataFuel = await fetch(`https://nuclear.dacoder.io/reactors/fuel-level/${id}?apiKey=1ca0a1826e8c6b39`)
        const jsonDataFuel = await rawDataFuel.json()

        const rawDataReactorState = await fetch(`https://nuclear.dacoder.io/reactors/reactor-state/${id}?apiKey=1ca0a1826e8c6b39`)
        const jsonDataReactorState = await rawDataReactorState.json()

        const rawDataRodState = await fetch(`https://nuclear.dacoder.io/reactors/rod-state/${id}?apiKey=1ca0a1826e8c6b39`)
        const jsonDataRodState = await rawDataRodState.json()

        jsonData.temperature = (await Promise.all([jsonDataTemperature.temperature]))[0]
        jsonData.output = (await Promise.all([jsonDataOutput.output]))[0]
        jsonData.coolant = (await Promise.all([jsonDataCoolant.coolant]))[0]
        jsonData.fuel = (await Promise.all([jsonDataFuel.fuel]))[0]
        jsonData.state = (await Promise.all([jsonDataReactorState.state]))[0]
        jsonData.control_rods = (await Promise.all([jsonDataRodState.control_rods]))[0]

        setHotStuff(jsonData)
        console.log("jsonData:")
        console.log(jsonData)
        setHotStuffRendering(false)
    }

    const interval = () => {
        fetchAll()
        console.log(hotStuff.temperature?.amount)
        const getTemperature = async () => {
            return (await Promise.all([hotStuff.temperature.amount]))[0]
        }
        setTemperature(prevTemperature => [...prevTemperature, getTemperature].slice(-200))
    }

    const getTemperatureState = async () => {
        return (await Promise.all([temperature]))
    }

    useEffect(() => {
        const idTimer = setInterval(interval, 1000)

        return () => {
            clearInterval(idTimer)
        }
    }, [])

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from(
                    { length: 300 },
                    (_, index) => index + 1
                ),
                datasets: [{
                    label: "Reactor Temperature at Every Second",
                    data: getTemperatureState(),
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
    }, [temperature])

    const postCall = async (call) => {
        console.log(call)
        if (call == "refuel") {
            await fetch(`https://nuclear.dacoder.io/reactors/maintenance/${id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(data => (!data.ok) ? console.log(data) : null)
        }
        if (call == "coolant off") {
            fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "coolant": "off"
                })
            })
            .then(data => (!data.ok) ? console.log(data) : null)
        } else if (call == "coolant on") {
            fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "coolant": "on"
                })
            })
            .then(data => (!data.ok) ? console.log(data) : null)
        } else {
            fetch(`https://nuclear.dacoder.io/reactors/${call}/${id}?apiKey=1ca0a1826e8c6b39`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(data => (!data.ok) ? console.log(data) : null)
        }
    }

    return (
        <div className="Reactor">
            <div className="ReactorNameButtons">
                <h1>{hotStuff.name ?? "..."}</h1>
                <Button variant="contained" onClick={ () => {postCall("coolant off")} }>Disable Coolant</Button>
                <Button variant="contained" onClick={ () => {postCall("coolant on")} }>Enable Coolant</Button>
                <Button variant="contained" onClick={ () => {postCall("controlled-shutdown")} }>Controlled Shutdown</Button>
                <Button variant="contained" onClick={ () => {postCall("refuel")} }>Refuel</Button>
                <Button variant="contained" onClick={ () => {postCall("start-reactor")} }>Start Reactor</Button>
                <Button variant="contained" onClick={ () => {postCall("emergency-shutdown")} } color="error">Emergency Shutdown</Button>
            </div>
            <div className="ReactorChart">
                <div className="graphReactor">
                    <canvas ref={canvasRef}></canvas>
                </div>
                <div className="reactorInfo">
                    <Typography className="info">
                        Temperature: {(parseFloat(hotStuff.temperature?.amount).toFixed(2) ?? "...") +
                        ((hotStuff.temperature?.unit == "celsius") ? "\xB0 C" : "\xB0 F") }</Typography>
                    <Typography className="info">
                        Temperature Level: {hotStuff.temperature?.status ?? "..."}
                    </Typography>
                    <Typography className="info">
                        Output: {(parseFloat(hotStuff.output?.amount).toFixed(2) ?? "...") +
                                            ((hotStuff.output?.unit == "Megawatt (MW)") ? " MW" : "GW")}
                    </Typography>
                    <Typography className="info">
                        Reactor State: {hotStuff.state ?? "..."}
                    </Typography>
                    <Typography className="info">
                        Coolant State: {hotStuff.coolant ?? "..."}
                    </Typography>
                    <Typography className="info">
                        Fuel: {parseFloat(hotStuff.fuel.percentage).toFixed(2) + "%" ?? "..."}
                    </Typography>
                </div>
            </div>
        </div >

    )
}

export default Reactor