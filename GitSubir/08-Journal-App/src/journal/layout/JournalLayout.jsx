import { Box } from '@mui/material'
import React from 'react'
import { NavBar, SideBar } from '../components';


const drawerWidth = 300;

export const JournalLayout = ({ children }) => {
  return (
    <Box sx={{display: 'flex'}}>

        
        {/* NavBar drawerWidth */}
        <NavBar drawerWidth={ drawerWidth } />

        {/* SideBar drawerWidth */}

        <SideBar drawerWidth={ drawerWidth }/>

        <Box
         component={'main'}
         sx={{ flexGrow: 5, p: 5, mt: 3}}
         >

            {/* Toolbar */}

            { children }

        </Box>
        
        
    </Box>
  )
}
