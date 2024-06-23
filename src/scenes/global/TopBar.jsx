import {Box,IconButton,colors,useTheme} from "@mui/material" 
import { useContext } from "react";
import { ColorModeContext,tokens } from "../../Theme";
import InputBase from "@mui/material";
import { LightModeOutlinedIcon } from "@mui/icons-material/LightModeOutlined";
import { DarkModeOutlinedIcon } from "@mui/icons-material/DarkModeOutlined";
import { NotificationsOutlinedIcon } from "@mui/icons-material/NotificationsOutlined";
import { SettingsOutlinedIcon } from "@mui/icons-material/SettingsOutlined";
import { PersonOutlinedIcon } from "@mui/icons-material/PersonOutlined";
import { SearchIcon } from "@mui/icons-material/Search";

const TopBar = () => {
    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    return <Box display="flex" justifyContent="space-between" p = {2}>
        <Box display = "flex"
            backgroundColor ={colors.primary[400]}
            borderRadius="3px">

        <InputBase sx ={{ml: 2 ,flex :1}} placeholder="Search"></InputBase>
        <IconButton type = " button" sx = {{p : 1}}>
            <SearchIcon/>
        </IconButton>
        </Box>
        <Box display="flex"> 
            <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ?(<DarkModeOutlinedIcon/>):(<LightModeOutlinedIcon/>)}
            </IconButton>
            <IconButton>

            </IconButton>

            <IconButton>

            </IconButton>
            <IconButton>

            </IconButton>
        </Box>
    </Box>
}
export default TopBar;