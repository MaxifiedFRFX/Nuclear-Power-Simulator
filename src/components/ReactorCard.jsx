import { Card, CardContent, CardHeader, Button } from "@mui/material"
import SafeReactor from '../assets/SafeReactor.svg'

const ReactorCard = (props) => {

    return (
        <div>
            <Card className="ReactorCard" sx={{
                width: "350px", height: "220px",
                background: "#BFD7EA",
                boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: "4px",
                backgroundImage: `url(${SafeReactor})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom right -30px",

            }}>
                <Card className="ReactorInnerCard" sx={{
                    position: "relative",
                    top: "20px",
                    left: "20px",
                    width: "200px", height: "181px",
                    background: "#FFFDF2",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "3px",
                }}>
                </Card>
                <Button variant="contained" color="info">More Details</Button>
                <Button variant="contained" color="error" sx={{ position: "relative", left: "150px", bottom: "10px", fontSize: "12px", }}>Emergency Shutdown</Button>
            </Card>
        </div >

    )
}

export default ReactorCard