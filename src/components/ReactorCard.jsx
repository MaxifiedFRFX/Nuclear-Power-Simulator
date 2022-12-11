import { Card, CardContent, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material"
import { Link } from "react-router-dom"
import SafeReactor from '../assets/SafeReactor.svg'

const ReactorCard = (props) => {
    const { reactor} = props;

    const rows = { temp: "79\xB0", tempLevel: "safe", status: "Online", output: "4239 MW" }

    return (
        <div>
            <Card className="reactorCard" sx={{
                width: "355px",
                height: "230px",
                background: "#BFD7EA",
                boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: "4px",
                backgroundImage: `url(${SafeReactor})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom right -35px",
                backgroundHeight: "10px",
                backgroundSize: "150px"
            }}>
                <Card className="ReactorInnerCard" sx={{
                    position: "relative",
                    top: "20px",
                    left: "15px",
                    width: "230px", height: "181px",
                    background: "#FFFDF2",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "3px",
                }}>
                    <CardContent>
                        <Typography>{reactor.name}</Typography>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableBody>
                                    <TableRow
                                        key={0}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontSize: "12px" }}>
                                            Temperature:
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "12px" }}>{(parseFloat(reactor.temperature?.amount).toFixed(2) ?? "...") +
                                            ((reactor.temperature?.unit == "celsius") ? "\xB0 C" : "\xB0 F")}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontSize: "8px" }}>
                                            Temperature Level:
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "12px" }}>{reactor.temperature?.status ?? "..."}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={2}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontSize: "12px" }}>
                                            Status:
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "12px" }}>{reactor.state ?? "..."}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={3}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontSize: "12px" }}>
                                            Output:
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "10px" }}>{(parseFloat(reactor.output?.amount).toFixed(2) ?? "...") +
                                            ((reactor.output?.unit == "Megawatt (MW)") ? " MW" : "GW")}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                <Link to={reactor.id}>
                    <Button variant="contained" color="info" size="small" sx={{ position: "relative", left: "10px", bottom: "-5px", fontSize: "10px", }}>More Details</Button>
                </Link>
                <Button variant="contained" color="error" size="small" sx={{ position: "relative", left: "80px", bottom: "-5px", fontSize: "10px", }}>Emergency Shutdown</Button>
            </Card>
        </div >

    )
}

export default ReactorCard