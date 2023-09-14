export const STATUS_OPTIONS = [
  { label: 'Novo', value: 'new' },
  { label: 'Aguarda Visita', value: 'accepted' },
  { label: 'Recusado', value: 'declined' },
  { label: 'Ativo', value: 'active' },
  { label: 'Pagamento Pendente', value: 'pending_payment' },
  { label: 'Concluído', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
];

export const STATUS_OPTIONS_EXTERNAL = [
  { label: 'Ativo', value: 'active' },
  { label: 'Aguarda Visita', value: 'accepted' },
  { label: 'Pagamento Pendente', value: 'pending_payment' },
  { label: 'Concluído', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
];

export const ORIGIN_OPTIONS = [
  { label: 'Online', value: 'marketplace' },
  { label: 'Offline', value: 'external' },
];

export const RECURRENCY_OPTIONS = [
  { label: '', value: '' },
  { label: 'Único', value: 0 },
  { label: 'Semanal', value: 1 },
  { label: 'Quinzenal', value: 2 },
  { label: 'Mensal', value: 4 },
];

export const WEEK_DAYS_OPTIONS = [
  { label: 'Segunda-feira', value: 1 },
  { label: 'Terça-feira', value: 2 },
  { label: 'Quarta-feira', value: 3 },
  { label: 'Quinta-feira', value: 4 },
  { label: 'Sexta-feira', value: 5 },
  { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 7 },
];
