import { UserForm } from '../../../../../types';

export const JOB_DATA = [
  { value: 'Ingeniería Agronómica', abrv: 'ING' },
  { value: 'Ingeniería Agroindustrial', abrv: 'ING' },
  { value: 'Ingeniería Topográfica y Agrimensura', abrv: 'ING' },
  { value: 'Ingeniería Civil', abrv: 'ING' },
  { value: 'Arquitectura y Urbanismo', abrv: 'ARQ' },
  { value: 'Ingeniería Económica', abrv: 'ING' },
  { value: 'Ingeniería Estadística e Informática', abrv: 'ING' },
  { value: 'Ingeniería Geológica', abrv: 'ING' },
  { value: 'Ingeniería Metalúrgica', abrv: 'ING' },
  { value: 'Ingeniería Electrónica', abrv: 'ING' },
  { value: 'Ingeniería Mecánica Eléctrica', abrv: 'ING' },
  { value: 'Ingeniería de Sistemas', abrv: 'ING' },
  { value: 'Ingenieria de Minas', abrv: 'ING' },
  { value: 'Ingeniería Química', abrv: 'ING' },
  { value: 'Ingeniería Sanitaria y Ambiental', abrv: 'ING' },
  { value: 'Ciencias Biológicas', abrv: 'LIC' },
  { value: 'Ciencias Biológicas: Pesquería', abrv: 'LIC' },
  { value: 'Ciencias Biológicas: Microbiología', abrv: 'LIC' },
  { value: 'Nutrición Humana', abrv: 'LIC' },
  { value: 'Odontología', abrv: 'LIC' },
  { value: 'Enfermería', abrv: 'LIC' },
  { value: 'Medicina Humana', abrv: 'LIC' },
  { value: 'Medicina Veterinaria y Zootecnia', abrv: 'LIC' },
  { value: 'Ciencias Contables', abrv: 'LIC' },
  { value: 'Administración', abrv: 'LIC' },
  { value: 'Gestión Pública y Desarrollo Social', abrv: 'LIC' },
  { value: 'Física', abrv: 'LIC' },
  { value: 'Inicial', abrv: 'LIC' },
  { value: 'Primaria', abrv: 'LIC' },
  { value: 'Secundaria', abrv: 'LIC' },
  { value: 'Derecho', abrv: 'LIC' },
  { value: 'Antropología', abrv: 'LIC' },
  { value: 'Arte', abrv: 'LIC' },
  { value: 'Ciencias de la Comunicación Social', abrv: 'LIC' },
  { value: 'Sociología', abrv: 'LIC' },
  { value: 'Turismo', abrv: 'LIC' },
  { value: 'Trabajo Social', abrv: 'LIC' },
];
const professionalCost = {
  1: 2500,
  2: 3250,
  3: 4000,
};

export const DEGREE_DATA = [
  {
    id: 0,
    value: 'Practicante',
    abrv: 'Prac',
    title: 'Practicante',
    cost: {
      1: 900,
      2: 1350,
      3: 2100,
    },
  },
  {
    id: 1,
    value: 'Egresado',
    abrv: 'Egre',
    title: 'Asistente',
    cost: {
      1: 1200,
      2: 1950,
      3: 2700,
    },
  },
  {
    id: 2,
    value: 'Bachiller',
    abrv: 'Bac',
    title: 'Asistente',
    cost: {
      1: 1800,
      2: 2550,
      3: 3300,
    },
  },
  {
    id: 3,
    value: 'Titulado',
    abrv: 'Tit',
    title: 'Profesional',
    cost: professionalCost,
  },
  {
    id: 4,
    value: 'Magister',
    abrv: 'Prac',
    title: 'Profesional',
    cost: professionalCost,
  },
  {
    id: 5,
    value: 'Doctorado',
    abrv: 'Prac',
    title: 'Profesional',
    cost: professionalCost,
  },
];

export const PROFESSIONAL_SERVICE_LEVEL_DATA = [
  { id: 1, value: 'Nivel 1' },
  { id: 2, value: 'Nivel 2' },
  { id: 3, value: 'Nivel 3' },
];

export const INITIAL_VALUES_USER: UserForm = {
  id: 0,
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  degree: '',
  address: '',
  ruc: '',
  job: '',
  cv: null,
  declaration: null,
  department: '',
  province: '',
  district: '',
  firstNameRef: '',
  lastNameRef: '',
  phoneRef: '',
  addressRef: '',
  roleId: null,
  room: '',
  userPc: '',
  role: null,
};
