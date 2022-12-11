import { Card, CardContent, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material"
import { Link, Router, useParams } from "react-router-dom"
import SafeReactor from '../assets/SafeReactor.svg'
import { useEffect, useState } from 'react'
import '../App.css'

const Reactor = () => {
    const [hotStuff, setHotStuff] = useState("")
    const [hotStuffRendering, setHotStuffRendering] = useState(true)

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
    }

    useEffect(() => {
        const idTimer = setInterval(interval, 1000)

        return () => {
            clearInterval(idTimer)
        }
    }, [])

    return (
        <div className="Reactor">
            <div className="ReactorNameButtons">
                <h1>{hotStuff.name ?? "..."}</h1>
                <Button variant="contained">Disable Coolant</Button>
                <Button variant="contained">Controlled Shutdown</Button>
                <Button variant="contained">Refuel</Button>
                <Button variant="contained" color="error">Emergency Shutdown</Button>
            </div>
        </div >

    )
}

export default Reactor