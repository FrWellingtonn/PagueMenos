export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  conditions: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  priority: 'normal' | 'urgent';
  pharmacist: string;
  notes: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  duration: string;
  prescribedBy: string;
  prescriptionType: 'medical' | 'pharmacy'; // medical = prescrito por médico, pharmacy = orientação farmacêutica
  status: 'active' | 'inactive';
  interactions?: string;
  notes?: string;
}

export interface Teleconsultation {
  id: string;
  patientId: string;
  date: string;
  time: string;
  doctorName: string;
  doctorCRM: string;
  reason: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  diagnosis?: string;
  prescription?: string[];
  notes?: string;
}

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Maria Santos Silva',
    age: 65,
    gender: 'Feminino',
    cpf: '123.456.789-00',
    phone: '(85) 98765-4321',
    email: 'maria.santos@email.com',
    address: 'Rua das Flores, 123, Centro, Fortaleza-CE',
    allergies: ['Penicilina', 'Dipirona'],
    conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Dislipidemia'],
  },
  {
    id: '2',
    name: 'João Silva Oliveira',
    age: 58,
    gender: 'Masculino',
    cpf: '234.567.890-11',
    phone: '(85) 98876-5432',
    email: 'joao.silva@email.com',
    address: 'Av. Beira Mar, 456, Meireles, Fortaleza-CE',
    allergies: [],
    conditions: ['Hipertensão', 'Insuficiência Cardíaca'],
  },
  {
    id: '3',
    name: 'Ana Costa Ferreira',
    age: 42,
    gender: 'Feminino',
    cpf: '345.678.901-22',
    phone: '(85) 98987-6543',
    email: 'ana.costa@email.com',
    address: 'Rua Barão de Studart, 789, Aldeota, Fortaleza-CE',
    allergies: ['AAS'],
    conditions: ['Diabetes Tipo 2', 'Obesidade'],
  },
  {
    id: '4',
    name: 'Carlos Oliveira Lima',
    age: 71,
    gender: 'Masculino',
    cpf: '456.789.012-33',
    phone: '(85) 99098-7654',
    email: 'carlos.lima@email.com',
    address: 'Rua Major Facundo, 321, Centro, Fortaleza-CE',
    allergies: ['Sulfa'],
    conditions: ['Hipertensão', 'Diabetes Tipo 2', 'DPOC', 'Artrite'],
  },
  {
    id: '5',
    name: 'Beatriz Rocha Mendes',
    age: 35,
    gender: 'Feminino',
    cpf: '567.890.123-44',
    phone: '(85) 99109-8765',
    email: 'beatriz.rocha@email.com',
    address: 'Av. Santos Dumont, 654, Papicu, Fortaleza-CE',
    allergies: [],
    conditions: ['Asma'],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    date: '2025-10-18',
    time: '09:00',
    type: 'Consulta Farmacêutica',
    priority: 'normal',
    pharmacist: 'Dr. Fernando Martins',
    notes: 'Paciente apresenta boa adesão ao tratamento anti-hipertensivo. Orientada sobre importância da dieta hipossódica. Pressão arterial controlada (125/82 mmHg).',
  },
  {
    id: '2',
    patientId: '2',
    date: '2025-10-18',
    time: '10:00',
    type: 'Aferição de Pressão',
    priority: 'normal',
    pharmacist: 'Dr. Fernando Martins',
    notes: 'PA: 138/88 mmHg. Paciente relata esquecimento de doses de Losartana. Reforçada importância da adesão.',
  },
  {
    id: '3',
    patientId: '3',
    date: '2025-10-18',
    time: '11:00',
    type: 'Teste de Glicemia',
    priority: 'urgent',
    pharmacist: 'Dr. Fernando Martins',
    notes: 'Glicemia: 245 mg/dL (em jejum). Paciente com baixa adesão à Metformina. Encaminhada para médico endocrinologista.',
  },
  {
    id: '4',
    patientId: '1',
    date: '2025-10-15',
    time: '14:30',
    type: 'Revisão de Medicamentos',
    priority: 'normal',
    pharmacist: 'Dra. Paula Oliveira',
    notes: 'Revisão farmacoterapêutica completa. Identificada possível interação entre Warfarina e AAS. Sugerido ao médico ajuste de dose.',
  },
  {
    id: '5',
    patientId: '4',
    date: '2025-10-14',
    time: '15:00',
    type: 'Consulta Farmacêutica',
    priority: 'urgent',
    pharmacist: 'Dr. Fernando Martins',
    notes: 'Paciente em polifarmácia (8 medicamentos). Realizada conciliação medicamentosa. Identificados problemas de adesão e possíveis duplicidades.',
  },
  {
    id: '6',
    patientId: '5',
    date: '2025-10-18',
    time: '16:00',
    type: 'Orientação Farmacêutica',
    priority: 'normal',
    pharmacist: 'Dra. Paula Oliveira',
    notes: 'Paciente com dúvidas sobre uso correto de inalador. Demonstrada técnica inalatória correta. Fornecido material educativo sobre asma.',
  },
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    patientId: '1',
    name: 'Losartana Potássica',
    dosage: '50mg',
    frequency: '1x ao dia',
    startDate: '2024-03-15',
    duration: 'Contínuo',
    prescribedBy: 'Dr. Roberto Carvalho - CRM 12345/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '2',
    patientId: '1',
    name: 'Metformina',
    dosage: '850mg',
    frequency: '2x ao dia',
    startDate: '2024-03-15',
    duration: 'Contínuo',
    prescribedBy: 'Dr. Roberto Carvalho - CRM 12345/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '3',
    patientId: '1',
    name: 'Sinvastatina',
    dosage: '20mg',
    frequency: '1x ao dia (noite)',
    startDate: '2024-03-15',
    duration: 'Contínuo',
    prescribedBy: 'Dr. Roberto Carvalho - CRM 12345/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '4',
    patientId: '1',
    name: 'Warfarina',
    dosage: '5mg',
    frequency: '1x ao dia',
    startDate: '2024-06-10',
    duration: 'Contínuo',
    prescribedBy: 'Dr. Ricardo Mendes - CRM 12345/CE (Teleconsulta)',
    prescriptionType: 'medical',
    status: 'active',
    interactions: 'Possível interação com AAS e Sinvastatina. Monitorar INR regularmente.',
  },
  {
    id: '5',
    patientId: '2',
    name: 'Losartana Potássica',
    dosage: '100mg',
    frequency: '1x ao dia',
    startDate: '2024-01-20',
    duration: 'Contínuo',
    prescribedBy: 'Dra. Fernanda Lima - CRM 23456/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '6',
    patientId: '2',
    name: 'Carvedilol',
    dosage: '25mg',
    frequency: '2x ao dia',
    startDate: '2024-01-20',
    duration: 'Contínuo',
    prescribedBy: 'Dra. Fernanda Lima - CRM 23456/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '7',
    patientId: '2',
    name: 'Furosemida',
    dosage: '40mg',
    frequency: '1x ao dia',
    startDate: '2024-01-20',
    duration: 'Contínuo',
    prescribedBy: 'Dra. Fernanda Lima - CRM 23456/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '8',
    patientId: '3',
    name: 'Metformina',
    dosage: '1000mg',
    frequency: '2x ao dia',
    startDate: '2024-05-10',
    duration: 'Contínuo',
    prescribedBy: 'Dr. Paulo Castro - CRM 34567/CE (Teleconsulta)',
    prescriptionType: 'medical',
    status: 'active',
    notes: 'Paciente com baixa adesão (45%). Necessário acompanhamento intensivo.',
  },
  {
    id: '9',
    patientId: '4',
    name: 'Enalapril',
    dosage: '20mg',
    frequency: '2x ao dia',
    startDate: '2023-08-15',
    duration: 'Contínuo',
    prescribedBy: 'Dra. Ana Beatriz - CRM 45678/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '10',
    patientId: '4',
    name: 'Metformina',
    dosage: '850mg',
    frequency: '3x ao dia',
    startDate: '2023-08-15',
    duration: 'Contínuo',
    prescribedBy: 'Dra. Ana Beatriz - CRM 45678/CE',
    prescriptionType: 'medical',
    status: 'active',
  },
  {
    id: '11',
    patientId: '5',
    name: 'Budesonida + Formoterol',
    dosage: '200/6mcg',
    frequency: '2 inalações 2x ao dia',
    startDate: '2024-07-01',
    duration: 'Contínuo',
    prescribedBy: 'Dr. Ricardo Mendes - CRM 12345/CE (Teleconsulta)',
    prescriptionType: 'medical',
    status: 'active',
    notes: 'Técnica inalatória corrigida em 18/10/2025.',
  },
];

export const mockTeleconsultations: Teleconsultation[] = [
  {
    id: '1',
    patientId: '1',
    date: '2025-10-18',
    time: '14:00',
    doctorName: 'Ricardo Mendes',
    doctorCRM: '12345/CE',
    reason: 'Acompanhamento de hipertensão e diabetes. Paciente relata tonturas ocasionais.',
    status: 'scheduled',
  },
  {
    id: '2',
    patientId: '3',
    date: '2025-10-18',
    time: '15:30',
    doctorName: 'Paulo Castro',
    doctorCRM: '34567/CE',
    reason: 'Ajuste de medicação para diabetes. Glicemia descompensada.',
    status: 'scheduled',
  },
  {
    id: '3',
    patientId: '5',
    date: '2025-10-19',
    time: '10:00',
    doctorName: 'Ricardo Mendes',
    doctorCRM: '12345/CE',
    reason: 'Crise de asma. Necessita ajuste de tratamento.',
    status: 'scheduled',
  },
  {
    id: '4',
    patientId: '2',
    date: '2025-10-15',
    time: '16:00',
    doctorName: 'Fernanda Lima',
    doctorCRM: '23456/CE',
    reason: 'Revisão de medicação para insuficiência cardíaca.',
    status: 'completed',
    diagnosis: 'Insuficiência cardíaca controlada. Manutenção do tratamento atual.',
    prescription: [
      'Carvedilol 25mg - 1 cp 12/12h - Uso contínuo',
      'Furosemida 40mg - 1 cp pela manhã - Uso contínuo',
      'Losartana 100mg - 1 cp ao dia - Uso contínuo',
    ],
    notes: 'Paciente apresenta melhora significativa. Orientado sobre dieta hipossódica e controle hídrico.',
  },
  {
    id: '5',
    patientId: '1',
    date: '2025-10-12',
    time: '11:00',
    doctorName: 'Ricardo Mendes',
    doctorCRM: '12345/CE',
    reason: 'Consulta de rotina para controle de doenças crônicas.',
    status: 'completed',
    diagnosis: 'Hipertensão e Diabetes Tipo 2 controladas.',
    prescription: [
      'Warfarina 5mg - 1 cp ao dia - Uso contínuo (Monitorar INR)',
      'Vitamina D3 2000UI - 1 cp ao dia',
    ],
    notes: 'Paciente aderente ao tratamento. Pressão arterial e glicemia dentro das metas. Solicitado exames de controle.',
  },
  {
    id: '6',
    patientId: '3',
    date: '2025-10-08',
    time: '14:30',
    doctorName: 'Paulo Castro',
    doctorCRM: '34567/CE',
    reason: 'Primeira consulta para diabetes descompensada.',
    status: 'completed',
    diagnosis: 'Diabetes Tipo 2 descompensada. HbA1c: 9.2%',
    prescription: [
      'Metformina 1000mg - 1 cp 12/12h - Uso contínuo',
      'Glicazida 30mg - 1 cp antes do café da manhã',
    ],
    notes: 'Paciente com baixa adesão prévia. Reforçada orientação nutricional e importância do tratamento. Retorno em 30 dias.',
  },
  {
    id: '7',
    patientId: '5',
    date: '2025-10-05',
    time: '09:30',
    doctorName: 'Ricardo Mendes',
    doctorCRM: '12345/CE',
    reason: 'Asma não controlada. Crises frequentes.',
    status: 'completed',
    diagnosis: 'Asma parcialmente controlada.',
    prescription: [
      'Budesonida + Formoterol 200/6mcg - 2 inalações 12/12h',
      'Salbutamol 100mcg - 2 inalações SOS (até 4x ao dia)',
      'Montelucaste 10mg - 1 cp à noite',
    ],
    notes: 'Demonstrada técnica inalatória correta. Orientações sobre gatilhos e prevenção de crises. Retorno em 15 dias.',
  },
];
