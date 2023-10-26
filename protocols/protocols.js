const formularioTrazabilidad = {
  etapas: [
    {
      nombre: "Producción Primaria",
      campos: [
        {
          nombre: "Fecha de Siembra",
          tipo: "fecha",
          requerido: true,
        },
        {
          nombre: "Ubicación",
          tipo: "texto",
          requerido: true,
        },
        {
          nombre: "Uso de Productos Químicos",
          tipo: "opciones",
          opciones: ["Sí", "No"],
          requerido: false,
        },
      ],
    },
    {
      nombre: "Cosecha o Sacrificio",
      campos: [
        {
          nombre: "Fecha de Cosecha o Sacrificio",
          tipo: "fecha",
          requerido: true,
        },
        {
          nombre: "Ubicación",
          tipo: "texto",
          requerido: true,
        },
        {
          nombre: "Registro de Lote",
          tipo: "texto",
          requerido: false,
        },
      ],
    },
    // Puedes agregar más etapas aquí
  ],
};

export default formularioTrazabilidad;
