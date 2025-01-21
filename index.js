//importar arrays (buses, rutas, horaSalida) de data.js
const { buses, rutas, HoraSalida, sesiones, ubicaciones } = require("./data");
const express = require("express");
// importar cors
const cors = require("cors");
const app = express();
//const port = 3000;
const PORT = process.env.PORT || 3000; // Puerto dinámico

app.use(express.json());
// usar cors permitiendo todos los origenes
app.use(cors());

app.get("/", (req, res) => {
  res.send("APIs que puedes usar:/api/buses,/api/buses/:id, post_location");
});
//Trae info de los buses 
app.get("/api/buses", (req, res) => {
  res.json(buses);
});
//Trae las rutas
app.get("/api/rutas", (req, res) => {
  res.json(rutas);
});
//trae las horas de salida
app.get("/api/HoraSalida", (req, res) => {
  res.json(HoraSalida);
});
//Trae info de un bus en específico
app.get("/api/buses/:id", (req, res) => {
  const id = req.params.id;
  const bus = buses.find((bus) => bus.id == id);
  res.json(bus);
});




//Trae info de la ubicación en tiempo real de la última actualización 
app.post("/api/post_location", (req, res) => {
  console.log(req.body);
  const { idTelegram, latitud, longitud } = req.body;

  let sesion = sesiones.find(
    (sesion) => sesion.idTelegram == idTelegram && sesion.estado == "activo"
  );

  if (!sesion) {
    // Si no encuentra una sesión activa, responde con un error
    return res
      .status(404)
      .json({ error: "Sesión no encontrada para este usuario" });
  }

  // Agregar la ubicación a la lista de ubicaciones
  ubicaciones.push({
    id: ubicaciones.length + 1,
    idSesion: sesion.id,
    latitud,
    longitud,
    timestamp: new Date().toISOString(),
  });

  res.json({ message: "Ubicación guardada",latitud,longitud });
  
});

// Actualizar o crear una nueva sesión con información específica del bus, ruta, y hora
app.post("/api/sesiones", (req, res) => {
  const { idTelegram, idBus, idRuta, idHoraSalida } = req.body;

  // Verificar si ya existe una sesión activa para este idTelegram
  let sesion = sesiones.find(
    (sesion) => sesion.idTelegram == idTelegram && sesion.estado == "activo"
  );

  if (sesion) {
    // Si ya existe, actualiza la información
    sesion.idBus = idBus ? parseInt(idBus) : null;
    sesion.idRuta = idRuta ? parseInt(idRuta) : null;
    sesion.idHoraSalida = idHoraSalida ? parseInt(idHoraSalida) : null;
  } else {
    // Si no existe, crea una nueva sesión
    sesion = {
      id: sesiones.length + 1,
      idTelegram: idTelegram,
      estado: "activo",
      idBus: idBus ? parseInt(idBus) : null,
      idRuta: idRuta ? parseInt(idRuta) : null,
      idHoraSalida: idHoraSalida ? parseInt(idHoraSalida) : null,
    };
    sesiones.push(sesion);
  }

  res.json(sesion);
});
//trae la info solo de los buses que si están activos 
app.get("/api/sesionesActivas", (req, res) => {
  const sesionesActivas = sesiones.filter(
    (sesion) => sesion.estado === "activo"
  );

  // Obtener la última ubicación de cada sesión activa
  sesionesActivas.forEach((sesion) => {
    // Filtrar y ordenar las ubicaciones asociadas a la sesión
    const ubicacionesSesion = ubicaciones
      .filter((ubicacion) => ubicacion.idSesion === sesion.id)
      .sort((a, b) => b.id - a.id); // Orden descendente por id

    // Obtener la última ubicación si existe
    if (ubicacionesSesion.length > 0) {
      sesion.ultimaUbicacion = ubicacionesSesion[0];
    } else {
      sesion.ultimaUbicacion = null; // Manejar casos donde no haya ubicaciones
    }

    // Obtener detalles del bus, ruta y hora de salida
    const bus = sesion.idBus ? buses.find((bus) => bus.id === sesion.idBus) : null;
    const ruta = sesion.idRuta ? rutas.find((ruta) => ruta.id === sesion.idRuta) : null;
    const horaSalida = sesion.idHoraSalida
      ? HoraSalida.find((hora) => hora.id === sesion.idHoraSalida)
      : null;

    sesion.detalles = {
      bus: bus ? { id: bus.id, placa: bus.placa, estado: bus.estado } : null,
      ruta: ruta ? { id: ruta.id, nombre: ruta.nombre } : null,
      horaSalida: horaSalida ? { id: horaSalida.id, hora: horaSalida.hora } : null,
    };
  });

  res.json(sesionesActivas);
});

app.post("/api/sesiones/desactivar", (req, res) => {
  const { idTelegram } = req.body;

  // Buscar la sesión activa del usuario
  const sesion = sesiones.find(
    (sesion) => sesion.idTelegram === idTelegram && sesion.estado === "activo"
  );

  if (!sesion) {
    return res.status(404).json({ error: "Sesión no encontrada o ya desactivada." });
  }

  // Cambiar el estado de la sesión a inactivo
  sesion.estado = "Desactivado";

  res.json({ message: "Sesión desactivada con éxito.", sesion });
});



app.get("/api/sesiones/:id/ultimaUbicacion", (req, res) => {
  const id = req.params.id;
  const ubicacionesSesion = ubicaciones.filter(
    (ubicacion) => ubicacion.idSesion == id
  );
  //ordena las ubicaciones de mayor a menor por el id
  ubicacionesSesion.sort((a, b) => b.id - a.id);
  //retorna la primera ubicacion
  res.json(ubicacionesSesion[0]);
});

// Nuevo endpoint para obtener todos los detalles de una sesión específica
app.get("/api/sesiones/:id/detalles", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sesion = sesiones.find((sesion) => sesion.id === id);
    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    // Obtener la última ubicación de la sesión
    const ubicacionesSesion = ubicaciones.filter(
      (ubicacion) => ubicacion.idSesion === sesionId
    );
    if (ubicacionesSesion.length === 0) {
      return res.status(404).json({ error: "No se encontraron ubicaciones para la sesión dada" });
    }
    ubicacionesSesion.sort((a, b) => b.id - a.id);
    const ultimaUbicacion = ubicacionesSesion[0];

    // Obtener información del bus, ruta y hora de salida usando los IDs almacenados en la sesión
    const bus = sesion.idBus
      ? buses.find((bus) => bus.id === sesion.idBus)
      : null;
    const ruta = sesion.idRuta
      ? rutas.find((ruta) => ruta.id === sesion.idRuta)
      : null;
    const HoraSalida = sesion.idHoraSalida
      ? HoraSalida.find((hora) => hora.id === sesion.idHoraSalida)
      : null;

    // Construir la respuesta con todos los detalles
    const detallesSesion = {
      sesionId: sesion.id,
      idTelegram: sesion.idTelegram,
      estado: sesion.estado,
      bus: bus ? { id: bus.id, placa: bus.placa, estado: bus.estado } : null,
      ruta: ruta ? { id: ruta.id, nombre: ruta.nombre } : null,
      HoraSalida: HoraSalida
        ? { id: HoraSalida.id, hora: HoraSalida.hora }
        : null,
      ultimaUbicacion: {
        latitud: ultimaUbicacion.latitud,
        longitud: ultimaUbicacion.longitud,
        timestamp: ultimaUbicacion.timestamp,
      },
    };

    res.json(detallesSesion);
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});