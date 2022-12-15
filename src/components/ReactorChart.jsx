import { Card, CardContent, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Switch } from "@mui/material"
import { Link, Router, useParams } from "react-router-dom"
import SafeReactor from '../assets/SafeReactor.svg'
import { useEffect, useState, useRef } from 'react'
import '../App.css'

const ReactorChart = (props) => {
    const { temperature, name } = props
    const canvasRef = useRef(null)

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels:  [...Array(temperature.length).keys()],
                datasets: [{
                    label: name,
                    data: temperature, //hello
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

    return (
        <div className="graphReactor">
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}

export default ReactorChart