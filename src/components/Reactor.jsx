import { Button, Typography, Switch, TextField } from "@mui/material"
import { Link, Router, useParams } from "react-router-dom"
import SafeReactor from '../assets/SafeReactor.svg'
import { useEffect, useState, useRef } from 'react'
import '../App.css'
import ReactorChart from './ReactorChart'

const Reactor = () => {
    const [hotStuff, setHotStuff] = useState("")
    const [temperature, setTemperature] = useState([])
    const [reactorInput, setReactorInput] = useState("")

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

        setTemperature(prevTemperature => [...prevTemperature, jsonData.temperature.amount].slice(-300))
        setHotStuff(jsonData)
        console.log("jsonData:")
        console.log(jsonData)
    }

    const handleReactorInput = async () => {
        console.log(reactorInput)
        await fetch(`https://nuclear.dacoder.io/reactors/set-reactor-name/${id}?apiKey=1ca0a1826e8c6b39`, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: "PUT",
            body: JSON.stringify({ name: reactorInput }),
        }).then(data => (!data.ok) ? console.log(data) : null)
        setReactorInput("")
    }

    const interval = () => {
        fetchAll()
    }

    useEffect(() => {
        const idTimer = setInterval(interval, 1000)

        return () => {
            clearInterval(idTimer)
        }
    }, [])

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
            await fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=1ca0a1826e8c6b39`, {
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
            await fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=1ca0a1826e8c6b39`, {
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
        } else if (call == "temperature") {
            if (hotStuff.temperature.unit == "fahrenheit") {
                await fetch(`https://nuclear.dacoder.io/reactors/temperature/?apiKey=1ca0a1826e8c6b39`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "unit": "celsius"
                    })
                })
                    .then(data => (!data.ok) ? console.log(data) : null)
            } else {
                await fetch(`https://nuclear.dacoder.io/reactors/temperature/?apiKey=1ca0a1826e8c6b39`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "unit": "fahrenheit"
                    })
                })
            }
        } else {
            await fetch(`https://nuclear.dacoder.io/reactors/${call}/${id}?apiKey=1ca0a1826e8c6b39`, {
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
                <div className="ReactorName">
                    {
                        (hotStuff != "") ?
                            <TextField
                                label="Reactor Name"
                                id="standard-size-normal"
                                variant="standard"
                                defaultValue={(reactorInput == "") ? hotStuff.name : reactorInput}
                                placeholder={hotStuff.name}
                                onChange={(event) => setReactorInput(event.target.value)}
                            />
                            /* <input type="text" value={reactorInput} placeholder={hotStuff.name} onChange={(event) => setReactorInput(event.target.value)}></input> */
                            : "..."
                    }
                    <Button variant="contained" onClick={handleReactorInput}>Change Name</Button>
                </div>
                <div className="ReactorButtons">
                    <Button variant="contained" onClick={() => { postCall("coolant off") }}>Disable Coolant</Button>
                    <Button variant="contained" onClick={() => { postCall("coolant on") }}>Enable Coolant</Button>
                    <Button variant="contained" onClick={() => { postCall("controlled-shutdown") }}>Controlled Shutdown</Button>
                    <Button variant="contained" onClick={() => { postCall("refuel") }}>Refuel</Button>
                    <Button variant="contained" onClick={() => { postCall("start-reactor") }}>Start Reactor</Button>
                    <Button variant="contained" onClick={() => { postCall("emergency-shutdown") }} color="error">Emergency Shutdown</Button>
                </div>
                <div className="back">
                    <Link to="/">
                        <div className="backButton">
                            <Button variant="contained" color="info" size="small">Go Back</Button>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="ReactorChart">
                <div className="graphReactor">
                    <ReactorChart temperature={temperature} name={"Temperature the Last 5 Minutes"} />
                </div>
                <div className="reactorInfo">
                    <p className="info">
                        Temperature: {(parseFloat(hotStuff.temperature?.amount).toFixed(2) ?? "...") +
                            ((hotStuff.temperature?.unit == "celsius") ? "\xB0 C" : "\xB0 F")}</p>
                    <p className="info">
                        Temperature Level: {hotStuff.temperature?.status ?? "..."}
                    </p>
                    <p className="info">
                        Output: {(parseFloat(hotStuff.output?.amount).toFixed(2) ?? "...") +
                            ((hotStuff.output?.unit == "Megawatt (MW)") ? " MW" : "GW")}
                    </p>
                    <p className="info">
                        Reactor State: {hotStuff.state ?? "..."}
                    </p>
                    <p className="info">
                        Coolant State: {hotStuff.coolant ?? "..."}
                    </p>
                    <p className="info">
                        Fuel: {parseFloat(hotStuff.fuel?.percentage).toFixed(2) + "%" ?? "..."}
                    </p>
                </div>
                <div className="switchRods">
                    <div className="switch">
                        <Typography>{hotStuff.temperature?.unit ?? "..."}</Typography>
                        <Switch onClick={() => { postCall("temperature") }} />
                    </div>
                    <div className="rods">
                        <Button variant="contained" onClick={() => { postCall("drop-rod") }}>Drop Rod</Button>
                        <Button variant="contained" onClick={() => { postCall("raise-rod") }}>Raise Rod</Button>
                        <Typography>Rods in: {hotStuff.control_rods?.in ?? "..."}</Typography>
                        <Typography>Rods out: {hotStuff.control_rods?.out ?? "..."}</Typography>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Reactor