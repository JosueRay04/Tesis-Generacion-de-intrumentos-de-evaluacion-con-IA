import { SaveOutlined } from '@mui/icons-material';
import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import './loading.css';
import * as XLSX from 'xlsx';
import Mammoth from 'mammoth';


export const NoteView = () => {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [instrumento, setInstrumento] = useState('');
  const [gradoEscolar, setGradoEscolar] = useState('');
  const [materia, setMateria] = useState('');
  const [numAspectos, setNumAspectos] = useState('');
  const [numCriterios, setNumCriterios] = useState('');
  const [aspectosEvaluar, setAspectosEvaluar] = useState('');
  const [tablaHtml, setTablaHtml] = useState('');

  const handleExportToExcel = () => {
    const table = document.getElementById('tabla-html');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla');
    XLSX.writeFile(wb, 'tablaexcel.xlsx');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const aspectosLocalStorage = localStorage.getItem('Aspectos');
      if (aspectosLocalStorage) {
        console.log("La variable localStorage 'Aspectos' no está vacía:", aspectosLocalStorage);
        fetch('http://localhost:5000/api/datoshistorialAspectos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Aspectos: aspectosLocalStorage })
        })
          .then(response => response.ok ? response.json() : Promise.reject('Error al realizar la consulta'))
          .then(data => {
            document.getElementById('instrumento').value = data.results[0][5];
            document.getElementById('Grado_Escolar').value = data.results[0][0];
            document.getElementById('Materia').value = data.results[0][1];
            document.getElementById('Numero_Aspectos').value = data.results[0][2];
            document.getElementById('Numero_Criterios').value = data.results[0][3];
            document.getElementById('Aspectos_Evaluar').value = data.results[0][4];
          })
          .catch(error => console.error('Error al procesar la consulta:', error));
        localStorage.removeItem('Aspectos');
      } else {
        console.log("La variable localStorage 'Aspectos' está vacía");
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleConsultar = async () => {

    const data = {
      instrumento,
      Grado_Escolar: gradoEscolar,
      Materia: materia,
      Numero_Aspectos: numAspectos,
      Numero_Criterios: numCriterios,
      Aspectos_Evaluar: aspectosEvaluar,
      email: localStorage.getItem('loggedInEmail'),
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setResponseText(responseData);
        // Aquí generamos la tabla a partir del responseText
        generateTable(responseData);
      } else {
        console.error('Error al enviar la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    } finally {
      setLoading(false);
    }

    try {
      const response = await fetch('http://localhost:5000/api/historial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
      } else {
        console.error('Error al enviar la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  const generateTable = (responseText) => {
    const instrumentotabla = instrumento;
    const Columntabla = numAspectos;

    if (instrumentotabla === "rubrica" && Columntabla === '3') {
      
        const criterios = responseText.split('\n\n').slice(1); // Ignorar el título del criterio
        const aspectos = Columntabla === 4 ? ['Mal', 'Regular', 'Bien', 'Excelente'] : ['Mal', 'Regular', 'Excelente'];

        const rows = [];
        let previousCriterioName = ''; // Almacenar el nombre del criterio de la fila anterior
        
        criterios.forEach((criterio, index) => {
            const lines = criterio.split('\n');
            const criterioNameLine = lines.find(line => line.startsWith('**Criterio '));
            const criterioName = criterioNameLine ? criterioNameLine.split(': ')[1].replace('**', '').trim() : ''; // Extraer el nombre del criterio
            const values = aspectos.map(aspecto => {
                const regex = new RegExp(`\\* \\*\\*${aspecto}:\\*\\* (.*)`);
                const match = lines.find(line => regex.test(line));
                return match ? match.replace(regex, '$1') : '';
            });
            
            const rowData = [criterioName, ...values]; // Array que contiene el nombre del criterio y sus valores
            
            // Insertar el nombre del criterio de la fila anterior en la primera celda de esta fila
            if (index > 0) {
                rowData[0] = previousCriterioName;
            }
            
            rows.push(rowData); // Agregar la fila al array de filas
            previousCriterioName = criterioName; // Actualizar el nombre del criterio para la próxima iteración
        });

        // Filtrar filas que tienen al menos dos datos
        const filteredRows = rows.filter(rowData => rowData.filter(data => data).length > 1);

        const tableHtml = (
            <table id="tabla-html" border="1">
                <thead>
                    <tr>
                        <th>CRITERIOS</th>
                        {aspectos.map((aspecto, i) => <th key={`header-${i}`}>{aspecto}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.map((rowData, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {rowData.map((data, cellIndex) => (
                                <td key={`cell-${rowIndex}-${cellIndex}`}>{data}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );

        setTablaHtml(tableHtml);

      } else if (instrumentotabla === "rubrica" && Columntabla === '4') {

        const criterios = responseText.split('\n\n').slice(1); // Ignorar el título del criterio
        const aspectos = ['Mal', 'Regular', 'Bien', 'Excelente'];

        const rows = [];
        let previousCriterioName = ''; // Almacenar el nombre del criterio de la fila anterior
        
        criterios.forEach((criterio, index) => {
            const lines = criterio.split('\n');
            const criterioNameLine = lines.find(line => line.startsWith('**Criterio '));
            const criterioName = criterioNameLine ? criterioNameLine.split(': ')[1].replace('**', '').trim() : ''; // Extraer el nombre del criterio
            const values = aspectos.map(aspecto => {
                const regex = new RegExp(`\\* \\*\\*${aspecto}:\\*\\* (.*)`);
                const match = lines.find(line => regex.test(line));
                return match ? match.replace(regex, '$1') : '';
            });
            
            const rowData = [criterioName, ...values]; // Array que contiene el nombre del criterio y sus valores
            
            // Insertar el nombre del criterio de la fila anterior en la primera celda de esta fila
            if (index > 0) {
                rowData[0] = previousCriterioName;
            }
            
            rows.push(rowData); // Agregar la fila al array de filas
            previousCriterioName = criterioName; // Actualizar el nombre del criterio para la próxima iteración
        });

        // Filtrar filas que tienen al menos dos datos
        const filteredRows = rows.filter(rowData => rowData.filter(data => data).length > 1);

        const tableHtml = (
            <table id="tabla-html" border="1">
                <thead>
                    <tr>
                        <th>CRITERIOS</th>
                        {aspectos.map((aspecto, i) => <th key={`header-${i}`}>{aspecto}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.map((rowData, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {rowData.map((data, cellIndex) => (
                                <td key={`cell-${rowIndex}-${cellIndex}`}>{data}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );

        setTablaHtml(tableHtml);
    
    } else if (instrumentotabla === "lista de cotejo") {
        
      const criterios = responseText.split('\n\n'); // Separar los criterios
        
        const rows = criterios.map(criterio => {
            const lines = criterio.split('\n');
            const criterioNameLine = lines.find(line => line.startsWith('**Criterio '));
            const criterioName = criterioNameLine ? criterioNameLine.split(': ')[1].replace('**', '').trim() : ''; // Extraer el nombre del criterio
            const descripcionLine = lines.find(line => line.startsWith('**Descripción:**'));
            const descripcion = descripcionLine ? descripcionLine.replace('**Descripción:**', '').trim() : ''; // Extraer la descripción del criterio

            const criterioCompleto = `${criterioName}: ${descripcion}`; // Concatenar nombre del criterio y descripción
            
            return (
                <tr key={criterioCompleto}>
                    <td>{criterioCompleto}</td>
                    <td></td>
                    <td></td>
                </tr>
            );
        });

        const tableHtml = (
            <table id="tabla-html" border="1">
                <thead>
                    <tr>
                        <th>CRITERIO</th>
                        <th>Si</th>
                        <th>No</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );

        setTablaHtml(tableHtml);
    }

};
  return (
    <Grid container direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
      <Grid item>
        <Typography fontSize={39} fontWeight='light'></Typography>
      </Grid>

      <Grid container>

        <TextField
          label="Instrumento de evaluacion:"
          id="instrumento"
          type='text'
          variant='filled'
          multiline
          fullWidth
          placeholder='Instrumento'
          minRows={1}
          value={instrumento}
          onChange={(e) => setInstrumento(e.target.value)}
        />

        <TextField
          label="Grado Escolar"
          id="Grado_Escolar"
          type='text'
          variant='filled'
          multiline
          fullWidth
          placeholder='Grado escolar'
          minRows={1}
          value={gradoEscolar}
          onChange={(e) => setGradoEscolar(e.target.value)}
        />

        <TextField
          label="Materia"
          id="Materia"
          type='text'
          variant='filled'
          multiline
          fullWidth
          placeholder='Materia'
          minRows={1}
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
        />

        <TextField
          label="Numero de aspectos"
          id="Numero_Aspectos"
          type='text'
          variant='filled'
          multiline
          fullWidth
          placeholder='Numero de Aspectos'
          minRows={1}
          value={numAspectos}
          onChange={(e) => setNumAspectos(e.target.value)}
        />

        <TextField
          label="Numero de Criterios"
          id="Numero_Criterios"
          type='text'
          variant='filled'
          multiline
          fullWidth
          placeholder='Numero de Criterios'
          minRows={1}
          value={numCriterios}
          onChange={(e) => setNumCriterios(e.target.value)}
        />

        <TextField
          label="Aspectos a Evaluar"
          id="Aspectos_Evaluar"
          type='text'
          variant='filled'
          multiline
          fullWidth
          placeholder='Aspectos a evaluar '
          minRows={5}
          value={aspectosEvaluar}
          onChange={(e) => setAspectosEvaluar(e.target.value)}
        />

        <Button onClick={handleConsultar}>
          Consultar
        </Button>

        <TextField
          id="response-text"
          label="Resultado de la consulta"
          value={responseText}
          fullWidth
          multiline
          variant="filled"
          sx={{ mt: 2 }}
        />

        {loading && <div className="loading">Cargando...</div>}

        <div>
          {tablaHtml}
        </div>

        <Button onClick={handleExportToExcel}>Exportar a Excel</Button> 
        <Button>Exportar a Word</Button> 

      </Grid>
    </Grid>
  );
};
