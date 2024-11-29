const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configurar middleware
app.use(cors());
app.use(express.json());

// Ruta para obtener las asistencias
app.get('/api/asistencias', (req, res) => {
  fs.readFile('assets/asistencias.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(500).send('Error al leer el archivo de asistencias');
    }
    const asistencias = JSON.parse(data).asistencias;
    res.json(asistencias);
  });
});

// Ruta para actualizar las asistencias
app.put('/api/asistencias', (req, res) => {
  const nuevasAsistencias = req.body.asistencias;
  console.log("Nuevas asistencias recibidas:", nuevasAsistencias);

  fs.readFile('assets/asistencias.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(500).json({ error: 'Error al leer el archivo de asistencias' });
    }

    console.log('Archivo leído correctamente:', data);

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error al parsear el archivo:', parseErr);
      return res.status(500).json({ error: 'Error al parsear el archivo de asistencias' });
    }

    jsonData.asistencias = nuevasAsistencias;

    fs.writeFile('assets/asistencias.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        return res.status(500).json({ error: 'Error al actualizar el archivo de asistencias' });
      }

      console.log('Archivo actualizado exitosamente');
      res.status(200).json({ message: 'Asistencias actualizadas exitosamente', asistencias: nuevasAsistencias });
    });
  });
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
