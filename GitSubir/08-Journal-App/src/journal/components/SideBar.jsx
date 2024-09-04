import { TurnedInNot } from '@mui/icons-material';
import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

export const SideBar = ({ drawerWidth = 240 }) => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/datoshistorial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Email: localStorage.getItem('loggedInEmail')
          })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Datos recibidos de la API:', data); // Aquí imprimes los datos recibidos
        setHistorial(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (primaryData) => {
    localStorage.setItem('Aspectos', primaryData);
  };

  return (
    <Box
      component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant='permanent'  //temporary
        open
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            {localStorage.getItem('loggedInEmail')}
          </Typography>
        </Toolbar>
        <Divider />

        <List>
          {historial.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleItemClick(item[4])}>
                <ListItemIcon>
                  <TurnedInNot />
                </ListItemIcon>
                <Grid container>
                  <ListItemText primary={item[4]} />
                  <ListItemText secondary={item[5]} />
                </Grid>
              </ListItemButton>
            </ListItem>
          ))}
        </List>


      </Drawer>

    </Box>
  );
};
