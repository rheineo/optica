// Datos de departamentos y municipios de Colombia
export interface DepartamentoData {
  nombre: string;
  municipios: string[];
}

export const COLOMBIA_DATA: DepartamentoData[] = [
  {
    nombre: 'Amazonas',
    municipios: ['Leticia', 'El Encanto', 'La Chorrera', 'La Pedrera', 'La Victoria', 'Puerto Alegría', 'Puerto Arica', 'Puerto Nariño', 'Puerto Santander', 'Tarapacá']
  },
  {
    nombre: 'Antioquia',
    municipios: ['Medellín', 'Abejorral', 'Amagá', 'Amalfi', 'Andes', 'Apartadó', 'Arboletes', 'Barbosa', 'Bello', 'Caldas', 'Caracolí', 'Carepa', 'Caucasia', 'Chigorodó', 'Cisneros', 'Cocorná', 'Copacabana', 'Donmatías', 'Envigado', 'Fredonia', 'Girardota', 'Guarne', 'Itagüí', 'Jardín', 'Jericó', 'La Ceja', 'La Estrella', 'La Unión', 'Marinilla', 'Medellín', 'Necoclí', 'Puerto Berrío', 'Rionegro', 'Sabaneta', 'San Pedro', 'Santa Fe de Antioquia', 'Santa Rosa de Osos', 'Segovia', 'Sonsón', 'Turbo', 'Urrao', 'Yarumal']
  },
  {
    nombre: 'Arauca',
    municipios: ['Arauca', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Tame']
  },
  {
    nombre: 'Atlántico',
    municipios: ['Barranquilla', 'Baranoa', 'Campo de la Cruz', 'Candelaria', 'Galapa', 'Juan de Acosta', 'Luruaco', 'Malambo', 'Manatí', 'Palmar de Varela', 'Piojó', 'Polonuevo', 'Ponedera', 'Puerto Colombia', 'Repelón', 'Sabanagrande', 'Sabanalarga', 'Santa Lucía', 'Santo Tomás', 'Soledad', 'Suan', 'Tubará', 'Usiacurí']
  },
  {
    nombre: 'Bogotá D.C.',
    municipios: ['Bogotá D.C.']
  },
  {
    nombre: 'Bolívar',
    municipios: ['Cartagena de Indias', 'Achí', 'Arjona', 'Calamar', 'Cantagallo', 'Clemencia', 'El Carmen de Bolívar', 'Magangué', 'Mahates', 'María la Baja', 'Mompós', 'Morales', 'San Jacinto', 'San Juan Nepomuceno', 'San Pablo', 'Santa Rosa', 'Simití', 'Turbaco', 'Turbaná', 'Villanueva', 'Zambrano']
  },
  {
    nombre: 'Boyacá',
    municipios: ['Tunja', 'Aquitania', 'Chiquinquirá', 'Duitama', 'Garagoa', 'Guateque', 'Moniquirá', 'Muzo', 'Nobsa', 'Paipa', 'Puerto Boyacá', 'Ramiriquí', 'Samacá', 'Santa Rosa de Viterbo', 'Sogamoso', 'Soatá', 'Tibasosa', 'Villa de Leyva']
  },
  {
    nombre: 'Caldas',
    municipios: ['Manizales', 'Aguadas', 'Anserma', 'Aranzazu', 'Chinchiná', 'Filadelfia', 'La Dorada', 'Manzanares', 'Marmato', 'Neira', 'Pácora', 'Palestina', 'Pensilvania', 'Riosucio', 'Risaralda', 'Salamina', 'Samaná', 'Supía', 'Victoria', 'Villamaría', 'Viterbo']
  },
  {
    nombre: 'Caquetá',
    municipios: ['Florencia', 'Albania', 'Belén de los Andaquíes', 'Cartagena del Chairá', 'Curillo', 'El Doncello', 'El Paujil', 'La Montañita', 'Milán', 'Morelia', 'Puerto Rico', 'San José del Fragua', 'San Vicente del Caguán', 'Solano', 'Solita', 'Valparaíso']
  },
  {
    nombre: 'Casanare',
    municipios: ['Yopal', 'Aguazul', 'Chámeza', 'Hato Corozal', 'La Salina', 'Maní', 'Monterrey', 'Nunchía', 'Orocué', 'Paz de Ariporo', 'Pore', 'Recetor', 'Sabanalarga', 'Sácama', 'San Luis de Palenque', 'Támara', 'Tauramena', 'Trinidad', 'Villanueva']
  },
  {
    nombre: 'Cauca',
    municipios: ['Popayán', 'Almaguer', 'Argelia', 'Balboa', 'Bolívar', 'Buenos Aires', 'Cajibío', 'Caldono', 'Caloto', 'Corinto', 'El Tambo', 'Guapí', 'Inzá', 'La Sierra', 'La Vega', 'Mercaderes', 'Miranda', 'Morales', 'Padilla', 'Páez', 'Patía', 'Piendamó', 'Puerto Tejada', 'Puracé', 'Rosas', 'San Sebastián', 'Santander de Quilichao', 'Silvia', 'Sotará', 'Suárez', 'Sucre', 'Timbío', 'Timbiquí', 'Toribío', 'Totoró', 'Villa Rica']
  },
  {
    nombre: 'Cesar',
    municipios: ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Astrea', 'Becerril', 'Bosconia', 'Chimichagua', 'Chiriguaná', 'Curumaní', 'El Copey', 'El Paso', 'Gamarra', 'González', 'La Gloria', 'La Jagua de Ibirico', 'La Paz', 'Manaure', 'Pailitas', 'Pelaya', 'Pueblo Bello', 'Río de Oro', 'San Alberto', 'San Diego', 'San Martín', 'Tamalameque']
  },
  {
    nombre: 'Chocó',
    municipios: ['Quibdó', 'Acandí', 'Alto Baudó', 'Atrato', 'Bagadó', 'Bahía Solano', 'Bajo Baudó', 'Bojayá', 'Condoto', 'El Carmen de Atrato', 'Istmina', 'Juradó', 'Lloró', 'Medio Atrato', 'Medio Baudó', 'Nóvita', 'Nuquí', 'Riosucio', 'San José del Palmar', 'Sipí', 'Tadó', 'Unguía']
  },
  {
    nombre: 'Córdoba',
    municipios: ['Montería', 'Ayapel', 'Buenavista', 'Canalete', 'Cereté', 'Chimá', 'Chinú', 'Ciénaga de Oro', 'Cotorra', 'La Apartada', 'Lorica', 'Los Córdobas', 'Momil', 'Montelíbano', 'Moñitos', 'Planeta Rica', 'Pueblo Nuevo', 'Puerto Escondido', 'Puerto Libertador', 'Purísima', 'Sahagún', 'San Andrés de Sotavento', 'San Antero', 'San Bernardo del Viento', 'San Carlos', 'San Pelayo', 'Tierralta', 'Tuchín', 'Valencia']
  },
  {
    nombre: 'Cundinamarca',
    municipios: ['Agua de Dios', 'Albán', 'Anapoima', 'Anolaima', 'Arbeláez', 'Bojacá', 'Cabrera', 'Cachipay', 'Cajicá', 'Cáqueza', 'Chía', 'Chipaque', 'Choachí', 'Chocontá', 'Cogua', 'Cota', 'El Colegio', 'El Rosal', 'Facatativá', 'Funza', 'Fusagasugá', 'Gachancipá', 'Girardot', 'Granada', 'Guaduas', 'Guasca', 'Guatavita', 'La Calera', 'La Mesa', 'La Vega', 'Madrid', 'Medina', 'Mosquera', 'Nemocón', 'Pacho', 'Puerto Salgar', 'Ricaurte', 'San Antonio del Tequendama', 'Sesquilé', 'Sibaté', 'Silvania', 'Simijaca', 'Soacha', 'Sopó', 'Subachoque', 'Suesca', 'Tabio', 'Tenjo', 'Tocaima', 'Tocancipá', 'Ubaté', 'Villeta', 'Zipacón', 'Zipaquirá']
  },
  {
    nombre: 'Guainía',
    municipios: ['Inírida', 'Barranco Minas', 'Cacahual', 'La Guadalupe', 'Mapiripana', 'Morichal', 'Pana Pana', 'Puerto Colombia', 'San Felipe']
  },
  {
    nombre: 'Guaviare',
    municipios: ['San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores']
  },
  {
    nombre: 'Huila',
    municipios: ['Neiva', 'Acevedo', 'Agrado', 'Aipe', 'Algeciras', 'Altamira', 'Baraya', 'Campoalegre', 'Colombia', 'Elías', 'Garzón', 'Gigante', 'Guadalupe', 'Hobo', 'Íquira', 'Isnos', 'La Argentina', 'La Plata', 'Nátaga', 'Oporapa', 'Paicol', 'Palermo', 'Palestina', 'Pital', 'Pitalito', 'Rivera', 'Saladoblanco', 'San Agustín', 'Santa María', 'Suaza', 'Tarqui', 'Tello', 'Teruel', 'Tesalia', 'Timaná', 'Villavieja', 'Yaguará']
  },
  {
    nombre: 'La Guajira',
    municipios: ['Riohacha', 'Albania', 'Barrancas', 'Dibulla', 'Distracción', 'El Molino', 'Fonseca', 'Hatonuevo', 'La Jagua del Pilar', 'Maicao', 'Manaure', 'San Juan del Cesar', 'Uribia', 'Urumita', 'Villanueva']
  },
  {
    nombre: 'Magdalena',
    municipios: ['Santa Marta', 'Algarrobo', 'Aracataca', 'Ariguaní', 'Cerro de San Antonio', 'Chibolo', 'Ciénaga', 'Concordia', 'El Banco', 'El Piñón', 'El Retén', 'Fundación', 'Guamal', 'Nueva Granada', 'Pedraza', 'Pijiño del Carmen', 'Pivijay', 'Plato', 'Puebloviejo', 'Remolino', 'Salamina', 'San Sebastián de Buenavista', 'San Zenón', 'Santa Ana', 'Santa Bárbara de Pinto', 'Sitionuevo', 'Tenerife', 'Zapayán', 'Zona Bananera']
  },
  {
    nombre: 'Meta',
    municipios: ['Villavicencio', 'Acacías', 'Barranca de Upía', 'Cabuyaro', 'Castilla la Nueva', 'Cubarral', 'Cumaral', 'El Calvario', 'El Castillo', 'El Dorado', 'Fuente de Oro', 'Granada', 'Guamal', 'La Macarena', 'Lejanías', 'Mapiripán', 'Mesetas', 'Puerto Concordia', 'Puerto Gaitán', 'Puerto Lleras', 'Puerto López', 'Puerto Rico', 'Restrepo', 'San Carlos de Guaroa', 'San Juan de Arama', 'San Juanito', 'San Martín', 'Uribe', 'Vistahermosa']
  },
  {
    nombre: 'Nariño',
    municipios: ['Pasto', 'Albán', 'Aldana', 'Ancuyá', 'Barbacoas', 'Belén', 'Buesaco', 'Chachagüí', 'Colón', 'Consacá', 'Contadero', 'Córdoba', 'Cuaspud', 'Cumbal', 'Cumbitara', 'El Charco', 'El Peñol', 'El Rosario', 'El Tablón de Gómez', 'El Tambo', 'Francisco Pizarro', 'Funes', 'Guachucal', 'Guaitarilla', 'Gualmatán', 'Iles', 'Imués', 'Ipiales', 'La Cruz', 'La Florida', 'La Llanada', 'La Tola', 'La Unión', 'Leiva', 'Linares', 'Los Andes', 'Magüí', 'Mallama', 'Mosquera', 'Nariño', 'Olaya Herrera', 'Ospina', 'Policarpa', 'Potosí', 'Providencia', 'Puerres', 'Pupiales', 'Ricaurte', 'Roberto Payán', 'Samaniego', 'San Bernardo', 'San Lorenzo', 'San Pablo', 'San Pedro de Cartago', 'Sandoná', 'Santa Bárbara', 'Santacruz', 'Sapuyes', 'Taminango', 'Tangua', 'Tumaco', 'Túquerres', 'Yacuanquer']
  },
  {
    nombre: 'Norte de Santander',
    municipios: ['Cúcuta', 'Ábrego', 'Arboledas', 'Bochalema', 'Bucarasica', 'Cáchira', 'Cácota', 'Chinácota', 'Chitagá', 'Convención', 'Cucutilla', 'Durania', 'El Carmen', 'El Tarra', 'El Zulia', 'Gramalote', 'Hacarí', 'Herrán', 'La Esperanza', 'La Playa de Belén', 'Labateca', 'Los Patios', 'Lourdes', 'Mutiscua', 'Ocaña', 'Pamplona', 'Pamplonita', 'Puerto Santander', 'Ragonvalia', 'Salazar de las Palmas', 'San Calixto', 'San Cayetano', 'Santiago', 'Sardinata', 'Silos', 'Teorama', 'Tibú', 'Toledo', 'Villa Caro', 'Villa del Rosario']
  },
  {
    nombre: 'Putumayo',
    municipios: ['Mocoa', 'Colón', 'Orito', 'Puerto Asís', 'Puerto Caicedo', 'Puerto Guzmán', 'Puerto Leguízamo', 'San Francisco', 'San Miguel', 'Santiago', 'Sibundoy', 'Valle del Guamuez', 'Villagarzón']
  },
  {
    nombre: 'Quindío',
    municipios: ['Armenia', 'Buenavista', 'Calarcá', 'Circasia', 'Córdoba', 'Filandia', 'Génova', 'La Tebaida', 'Montenegro', 'Pijao', 'Quimbaya', 'Salento']
  },
  {
    nombre: 'Risaralda',
    municipios: ['Pereira', 'Apía', 'Balboa', 'Belén de Umbría', 'Dosquebradas', 'Guática', 'La Celia', 'La Virginia', 'Marsella', 'Mistrató', 'Pueblo Rico', 'Quinchía', 'Santa Rosa de Cabal', 'Santuario']
  },
  {
    nombre: 'San Andrés y Providencia',
    municipios: ['San Andrés', 'Providencia']
  },
  {
    nombre: 'Santander',
    municipios: ['Bucaramanga', 'Aguada', 'Albania', 'Aratoca', 'Barbosa', 'Barichara', 'Barrancabermeja', 'Betulia', 'Bolívar', 'Cabrera', 'California', 'Capitanejo', 'Carcasí', 'Cepitá', 'Cerrito', 'Charalá', 'Charta', 'Chima', 'Chipatá', 'Cimitarra', 'Concepción', 'Confines', 'Contratación', 'Coromoro', 'Curití', 'El Carmen de Chucurí', 'El Guacamayo', 'El Peñón', 'El Playón', 'Encino', 'Enciso', 'Florián', 'Floridablanca', 'Galán', 'Gámbita', 'Girón', 'Guaca', 'Guadalupe', 'Guapotá', 'Guavatá', 'Güepsa', 'Hato', 'Jesús María', 'Jordán', 'La Belleza', 'La Paz', 'Landázuri', 'Lebrija', 'Los Santos', 'Macaravita', 'Málaga', 'Matanza', 'Mogotes', 'Molagavita', 'Ocamonte', 'Oiba', 'Onzaga', 'Palmar', 'Palmas del Socorro', 'Páramo', 'Piedecuesta', 'Pinchote', 'Puente Nacional', 'Puerto Parra', 'Puerto Wilches', 'Rionegro', 'Sabana de Torres', 'San Andrés', 'San Benito', 'San Gil', 'San Joaquín', 'San José de Miranda', 'San Miguel', 'San Vicente de Chucurí', 'Santa Bárbara', 'Santa Helena del Opón', 'Simacota', 'Socorro', 'Suaita', 'Sucre', 'Suratá', 'Tona', 'Valle de San José', 'Vélez', 'Vetas', 'Villanueva', 'Zapatoca']
  },
  {
    nombre: 'Sucre',
    municipios: ['Sincelejo', 'Buenavista', 'Caimito', 'Chalán', 'Colosó', 'Corozal', 'Coveñas', 'El Roble', 'Galeras', 'Guaranda', 'La Unión', 'Los Palmitos', 'Majagual', 'Morroa', 'Ovejas', 'Palmito', 'Sampués', 'San Benito Abad', 'San Juan de Betulia', 'San Marcos', 'San Onofre', 'San Pedro', 'Santiago de Tolú', 'Sincé', 'Sucre', 'Tolú Viejo']
  },
  {
    nombre: 'Tolima',
    municipios: ['Ibagué', 'Alpujarra', 'Alvarado', 'Ambalema', 'Anzoátegui', 'Armero', 'Ataco', 'Cajamarca', 'Carmen de Apicalá', 'Casabianca', 'Chaparral', 'Coello', 'Coyaima', 'Cunday', 'Dolores', 'Espinal', 'Falan', 'Flandes', 'Fresno', 'Guamo', 'Herveo', 'Honda', 'Icononzo', 'Lérida', 'Líbano', 'Mariquita', 'Melgar', 'Murillo', 'Natagaima', 'Ortega', 'Palocabildo', 'Piedras', 'Planadas', 'Prado', 'Purificación', 'Rioblanco', 'Roncesvalles', 'Rovira', 'Saldaña', 'San Antonio', 'San Luis', 'Santa Isabel', 'Suárez', 'Valle de San Juan', 'Venadillo', 'Villahermosa', 'Villarrica']
  },
  {
    nombre: 'Valle del Cauca',
    municipios: ['Cali', 'Alcalá', 'Andalucía', 'Ansermanuevo', 'Argelia', 'Bolívar', 'Buenaventura', 'Buga', 'Bugalagrande', 'Caicedonia', 'Calima', 'Candelaria', 'Cartago', 'Dagua', 'El Águila', 'El Cairo', 'El Cerrito', 'El Dovio', 'Florida', 'Ginebra', 'Guacarí', 'Guadalajara de Buga', 'Jamundí', 'La Cumbre', 'La Unión', 'La Victoria', 'Obando', 'Palmira', 'Pradera', 'Restrepo', 'Riofrío', 'Roldanillo', 'San Pedro', 'Sevilla', 'Toro', 'Trujillo', 'Tuluá', 'Ulloa', 'Versalles', 'Vijes', 'Yotoco', 'Yumbo', 'Zarzal']
  },
  {
    nombre: 'Vaupés',
    municipios: ['Mitú', 'Carurú', 'Pacoa', 'Papunaua', 'Taraira', 'Yavaraté']
  },
  {
    nombre: 'Vichada',
    municipios: ['Puerto Carreño', 'Cumaribo', 'La Primavera', 'Santa Rosalía']
  }
];

// Función helper para obtener municipios por departamento
export const getMunicipiosByDepartamento = (departamento: string): string[] => {
  const dep = COLOMBIA_DATA.find(d => d.nombre === departamento);
  return dep ? dep.municipios : [];
};

// Función helper para obtener lista de departamentos
export const getDepartamentos = (): string[] => {
  return COLOMBIA_DATA.map(d => d.nombre);
};
