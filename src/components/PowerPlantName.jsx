import { Button, TextField } from "@mui/material"
import { useState} from 'react'
import '../App.css'

const PowerPlantName = (props) => {
    const { powerPlantName } = props
    const [powerPlantInput, setPowerPlantInput] = useState("")

    const handleNewPlantName = async () => {
        await fetch("https://nuclear.dacoder.io/reactors/plant-name?apiKey=1ca0a1826e8c6b39", {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: "PUT",
            body: JSON.stringify({ name: powerPlantInput }),
        })
        setPowerPlantInput(powerPlantInput)
    }

    return (
        <div className="plantName">
            <input type="text" value={powerPlantName} 
            placeholder={powerPlantName} onChange={(event) => setPowerPlantInput(event.target.value)}></input>
            <Button variant="contained" onClick={handleNewPlantName}>Change Name</Button>
        </div>
    )
}

export default PowerPlantName