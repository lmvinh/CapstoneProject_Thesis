import { Box } from "@mui/material";
import Header from "../../components/header";
const DashBoard = () => {
    
    return <Box m = '20px'>
        <Box display = 'flex' justifyContent = 'space-between' alignItem = "center">
            <Header title="DASHBOARD" subtitle = "Welcome to our DashBoard"/>
        </Box>

    </Box>
}
export default DashBoard;
