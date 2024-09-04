import { Link as RouterLink} from 'react-router-dom'
import { Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from '../layout/AuthLayout'
import { useState } from 'react';


export const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    Email: '',
    contrasena: ''
  });
  const [loggedInEmail, setLoggedInEmail] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      if (response.ok) {
        // Si el inicio de sesión es exitoso, redirige al usuario a otra página o realiza alguna acción deseada
        console.log('Inicio de sesión exitoso');
        setLoggedInEmail(loginData.Email); // Guardar el email en el estado local
        localStorage.setItem('loggedInEmail', loginData.Email); // Guardar el email en localStorage
        window.location.href = 'http://localhost:5173/';
      } else {
        console.error('Credenciales incorrectas');
        window.alert("Usuario o contraseña no coinciden");
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  return (
    <AuthLayout title='Login'>

        <form onSubmit={handleLoginSubmit}>
          <Grid container>
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
              label="Correo" 
              type="email" 
              placeholder="correo@google.com"
              fullWidth
              value={loginData.Email}
              onChange={(e) => setLoginData({ ...loginData, Email: e.target.value })}
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
              label="Contraseña" 
              type="password" 
              placeholder="Contraseña"
              fullWidth 
              value={loginData.contrasena}
              onChange={(e) => setLoginData({ ...loginData, contrasena: e.target.value })}
              />
            </Grid>

            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 } sm={ 12 }>
                <Button variant="contained" fullWidth type="submit">
                  Login
                </Button>
              </Grid>

            </Grid>

            <Grid container direction="row" justifyContent="end">
              <Link component={ RouterLink } color="inherit" to="/auth/register">
                Crear una cuenta
              
              </Link>
              
            </Grid>

          </Grid>

        </form>
    </AuthLayout>
  )
}
