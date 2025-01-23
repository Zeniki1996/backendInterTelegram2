buses = [
  {
    id: 1,
    placa: "PCP 6994",
    estado: "activo",
  },
  {
    id: 2,
    placa: "PCP 5860",
    estado: "activo",
  },
  {
    id: 3,
    placa: "PFE 8891",
    estado: "activo",
  },
  {
    id: 4,
    placa: "PFE 8887",
    estado: "activo",
  },
  {
    id: 5,
    placa: "PFE 8888",
    estado: "activo",
  },
  {
    id: 6,
    placa: "UBA 4756",
    estado: "activo",
  }
];

HoraSalida = [
  {
    id: 1,
    hora: "10:00",
  },
  {
    id: 2,
    hora: "10:10",
  },
  {
    id: 3,
    hora: "10:20",
  },
  {
    id: 4,
    hora: "10:30",
  },
  {
    id: 5,
    hora: "10:40",
  },
  {
    id: 6,
    hora: "10:50",
  },
  {
    id: 7,
    hora: "11:00",
  },
  {
    id: 8,
    hora: "11:20",
  },
  {
    id: 9,
    hora: "11:40",
  },
  {
    id: 10,
    hora: "12:00",
  },
  {
    id: 11,
    hora: "12:20",
  },
  {
    id: 12,
    hora: "12:40",
  },
  {
    id:13,
    hora:"13:00",
  },
  {
    id:14,
    hora:"13:20",
  },
  {
    id:15,
    hora:"13:40",
  },
  {
    id:16,
    hora:"14:00",
  },
  {
    id:17,
    hora:"14:20",
  },
  {
    id:18,
    hora:"14:40",
  },
  {
    id:19,
    hora:"15:00",
  }
];

rutas = [
  {
    id: 1,
    nombre: "Jipijapa - Campito",
  },
  {
    id: 2,
    nombre: "Campito - Arena",
  },
  {
    id: 3,
    nombre: "Arena - Campito",
  },
  {
    id: 4,
    nombre: "Granados -Campito",
  },
  {
    id: 5,
    nombre: "Campito - Granados",
  },
];

sesiones = [
  {
    id: 1,
    idBus: 1,
    idRuta: 1,
    idHoraSalida: 1,
    idTelegram: 1,
    estado: "Desactivado",
  },
];

ubicaciones = [
  {
    id: 1,
    idSesion: 1,
    latitud: -1.0,
    longitud: -1.0,
    timestampUnix: 0,
  },
];

module.exports = { buses, rutas, HoraSalida, sesiones, ubicaciones };
