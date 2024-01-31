export const agroalimentario = {
  productImage: '',
  additionalFields: [],
  protocolName: 'agroalimentario',
  name: '',
  company: '',
  ownerUid: '',
  status: '',
  trazability: [
    {
      path: 'production',
      line: [
        { name: 'Origen de la producción', milestones: [] },
        { name: 'Características fenológicas / ciclos', milestones: [] },
        { name: 'Métodos de cultivo / cría', milestones: [] },
        { name: 'Registros fitosanitarios / sanidad', milestones: [] },
        { name: 'Caracteristicas adicionales', milestones: [] },
      ],
      name: 'Producción',
    },
    {
      path: 'elaboration',
      line: [
        { name: 'Procesos de elaboración', milestones: [] },
        { name: 'Etiquetado y empaque', milestones: [] },
        { name: 'Normativa aplicable', milestones: [] },
        { name: 'Capacitación del personal', milestones: [] },
        { name: 'Auditorías y verificaciones', milestones: [] },
        { name: 'Caracteristicas adicionales', milestones: [] },
      ],
      name: 'Elaboración / Procesamiento',
    },
    {
      path: 'distribution',
      line: [
        { name: 'Transporte', milestones: [] },
        { name: 'Almacenamiento', milestones: [] },
        { name: 'Caracteristicas adicionales', milestones: [] },
      ],
      name: 'Despacho / Distribución',
    },
    {
      path: 'comercialization',
      line: [
        { name: 'Trazabilidad del producto', milestones: [] },
        { name: 'Caracteristicas adicionales', milestones: [] },
      ],
      name: 'Comercialización',
    },
  ],
};

export const vitivinicola = {
  productImage: '',
  additionalFields: [],
  protocolName: 'Vitivinícola',
  name: '',
  company: '',
  ownerUid: '',
  status: '',
  trazability: [
    {
      path: 'production',
      line: [
        { name: 'Características del terreno', milestones: [] },
        { name: 'Plantación de la vid', milestones: [] },
        { name: 'Sistema de riego', milestones: [] },
        { name: 'Tratamientos agrícolas', milestones: [] },
        { name: 'Registro fenológico', milestones: [] },
        { name: 'Cosecha', milestones: [] },
      ],
      name: 'Producción en finca',
    },
    {
      path: 'elaboration',
      line: [
        { name: 'Recepción de la uva', milestones: [] },
        { name: 'Obtención del mosto', milestones: [] },
        { name: 'Fermentación', milestones: [] },
        { name: 'Crianza', milestones: [] },
      ],
      name: 'Elaboración',
    },
    {
      path: 'distribution',
      line: [
        { name: 'Envasado', milestones: [] },
        { name: 'Almacenamiento', milestones: [] },
        { name: 'Transporte', milestones: [] },
      ],
      name: 'Distribución',
    },
    {
      path: 'comercialization',
      line: [
        { name: 'Venta', milestones: [] },
        { name: 'Distribución al consumidor', milestones: [] },
      ],
      name: 'Comercialización',
    },
  ],
};

export const ambiental = {
  name: 'Protocolo Ambiental',
  trazability: [
    {
      path: 'location',
      line: [
        {
          name: 'Ubicación real',
          milestones: [],
        },
        {
          path: 'influenceAreas',
          name: 'Áreas de influencia',
          milestones: [],
        },
        {
          path: 'compensationAreas',
          name: 'Áreas para compensación',
          milestones: [],
        },
        {
          path: 'controlAreas',
          name: 'Áreas de control',
          milestones: [],
        },
      ],
      name: 'Localización Geográfica',
    },
    {
      path: 'habilitations',
      line: [
        {
          name: 'Declaración de Impacto Ambiental',
          milestones: [],
        },
        {
          name: 'Estudios específicos de impacto o de sensibilidad ambiental',
          milestones: [],
        },
        {
          name: 'Habilitaciones locales o regionales',
          milestones: [],
        },
      ],
      name: 'Requerimientos y Habilitaciones',
    },
    {
      path: 'requirements',
      line: [
        {
          name: 'Normas y otros requisitos',
          milestones: [],
        },
        {
          path: 'audit',
          name: 'Auditorías externas',
          milestones: [],
        },
      ],
      name: 'Normativa Ambiental',
    },
    {
      path: 'rawMaterials',
      line: [
        {
          name: 'Requisitos ambientales de compra o contratación',
          milestones: [],
        },
        {
          path: 'environmentAspects',
          name: 'Aspectos ambientales y sus impactos asociados',
          milestones: [],
        },
        {
          path: 'goodPractices',
          name: 'Buenas Prácticas Ambientales',
          milestones: [],
        },
        {
          path: 'abnormalConditions',
          name: 'Condiciones anormales o situaciones de emergencia previsibles',
          milestones: [],
        },
        {
          path: 'preventionPlans',
          name: 'Planes de prevención, contingencia y/o mitigación',
          milestones: [],
        },
      ],
      name: 'Recepción y Almacenamiento de Materias Primas e Insumos - Subcontratación de Servicios',
    },
    {
      path: 'storage',
      line: [
        {
          name: 'Aspectos ambientales y sus impactos asociados',
          milestones: [],
        },
        {
          path: 'goodPracticesEnv',
          name: 'Buenas Prácticas Ambientales',
          milestones: [],
        },
        {
          path: 'abnormalOrEmergency',
          name: 'Condiciones anormales o situaciones de emergencia previsibles',
          milestones: [],
        },
        {
          path: 'preventionContingencyMitigate',
          name: 'Planes de prevención, contingencia y/o mitigación',
          milestones: [],
        },
      ],
      name: 'Almacenamiento de Subproductos o Productos Finales',
    },
    {
      path: 'distribution',
      line: [
        {
          name: 'Requisitos ambientales de venta o transporte',
          milestones: [],
        },
        {
          path: 'environmentAspectsAndImpact',
          name: 'Aspectos ambientales y sus impactos asociados',
          milestones: [],
        },
        {
          path: 'goodPracticesDist',
          name: 'Buenas Prácticas Ambientales',
          milestones: [],
        },
        {
          path: 'abnormalOrEmergencyDist',
          name: 'Condiciones anormales o situaciones de emergencia previsibles',
          milestones: [],
        },
        {
          path: 'preventionPlanDist',
          name: 'Planes de prevención, contingencia y/o mitigación',
          milestones: [],
        },
      ],
      name: 'Despacho y Distribución de Subproductos o Productos Finales',
    },
    {
      path: 'commerce',
      line: [
        {
          name: 'Requisitos ambientales de comercialización',
          milestones: [],
        },
        {
          name: 'Aspectos ambientales y sus impactos asociados',
          milestones: [],
        },
        {
          name: 'Buenas Prácticas Ambientales',
          milestones: [],
        },
        {
          name: 'Condiciones anormales o situaciones de emergencia previsibles',
          milestones: [],
        },
        {
          name: 'Planes de prevención, contingencia y/o mitigación',
          milestones: [],
        },
      ],
      name: 'Comercialización de   Productos y/o Servicios',
    },
    {
      path: 'support',
      line: [
        {
          name: 'Aspectos ambientales y sus impactos asociados',
          milestones: [],
        },
        {
          name: 'Criterios de operación de los procesos',
          milestones: [],
        },
        {
          name: 'Procedimientos de control de los procesos',
          milestones: [],
        },
        {
          name: 'Buenas Prácticas Ambientales',
          milestones: [],
        },
        {
          name: 'Condiciones anormales o situaciones de emergencia previsibles',
          milestones: [],
        },
        {
          name: 'Planes de prevención, contingencia y/o mitigación',
          milestones: [],
        },
      ],
      name: 'Sistemas de Apoyo y Servicios Auxiliares',
    },
    {
      path: 'treatment',
      line: [
        {
          name: 'Aspectos ambientales y sus impactos asociados',
          milestones: [],
        },
        {
          name: 'Requisitos ambientales de los procesos e instalaciones',
          milestones: [],
        },
        {
          name: 'Buenas Prácticas Ambientales',
          milestones: [],
        },
        {
          name: 'Condiciones anormales o situaciones de emergencia previsibles',
          milestones: [],
        },
        {
          name: 'Planes de prevención, contingencia y/o mitigación',
          milestones: [],
        },
      ],
      name: 'Tratamiento, Transporte y/o Disposición Final de Residuos',
    },
    {
      path: 'performance',
      line: [
        {
          name: 'Estrategias y resultados',
          milestones: [],
        },
        {
          name: 'Auditorías ambientales internas',
          milestones: [],
        },
        {
          name: 'Personal afectado por la gestión ambiental',
          milestones: [],
        },
      ],
      name: 'Evaluación de Desempeño',
    },
    {
      path: 'kaizen',
      line: [
        {
          name: 'Plan de mejora continua',
          milestones: [],
        },
        {
          name: 'Concientización y/o capacitación del personal',
          milestones: [],
        },
        {
          name: 'Programas específicos de relacionamiento comunitario',
          milestones: [],
        },
      ],
      name: 'Mejora Continua',
    },
  ],
};
