import { Navigate, Link as RouterLink} from 'react-router-dom'
import { Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from '../layout/AuthLayout'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RegisterPage = () => {

  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    Email: '',
    contrasena: ''
  });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      if (response.ok) {
        // Si el registro es exitoso, redirige al usuario a la página de inicio de sesión
        console.log('Registro exitoso');
        window.alert('¡Registro exitoso!');
        window.location.href = 'http://localhost:5173/auth/login';
      } else {
        console.error('Error al registrar usuario');
        window.alert('Error al registrar verifique los datos introducidos');
      } 
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  return (
    <AuthLayout title='Crear cuenta'>

        <form onSubmit={handleRegisterSubmit}>
          <Grid container>
          <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
              label="Nombres" 
              type="text" 
              placeholder="Nombre Completo"
              fullWidth
              value={registerData.nombre}
              onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Apellido"
              type="text"
              placeholder="Apellido"
              fullWidth
              value={registerData.apellido}
              onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
            />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
              label="Correo" 
              type="email" 
              placeholder="correo@google.com"
              fullWidth
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, Email: e.target.value })}
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
              label="Contraseña" 
              type="password" 
              placeholder="Contraseña"
              fullWidth
              value={registerData.contrasena}
              onChange={(e) => setRegisterData({ ...registerData, contrasena: e.target.value })}
              />
            </Grid>

            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 }>
                <Button variant="contained" fullWidth type="submit">
                  Crear Cuenta
                </Button>
              </Grid>
              

            </Grid>



            <Grid container direction="row" justifyContent="end">
              <Typography sx={{ mr: 1}}>¿tienes cuenta?</Typography>
              <Link component={ RouterLink } color="inherit" to="/auth/login">
                Ingresar
              
              </Link>
              
            </Grid>

          </Grid>

        </form>
    </AuthLayout>
  )
}

