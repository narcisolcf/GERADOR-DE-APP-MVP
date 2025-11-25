import { Funcionalidade } from './types';

export const MOCK_FUNCIONALIDADES: Funcionalidade[] = [
  {
    id: 'f1',
    projeto_id: 'p1',
    titulo: 'Conectar Carteira (Web3)',
    descricao: 'Permitir que usuários se autentiquem usando suas carteiras digitais, como Metamask.',
    tamanho_camiseta: 'M',
    risco: 'Baixo',
    valor_negocio: 9,
    fator_uau: false,
  },
  {
    id: 'f2',
    projeto_id: 'p1',
    titulo: 'Galeria de Ativos Digitais',
    descricao: 'Exibir uma lista de todos os ativos (NFTs) disponíveis para negociação no marketplace.',
    tamanho_camiseta: 'M',
    risco: 'Baixo',
    valor_negocio: 10,
    fator_uau: true,
  },
  {
    id: 'f3',
    projeto_id: 'p1',
    titulo: 'Contrato Inteligente de Leilão',
    descricao: 'Implementar a lógica de lances, tempo de expiração e transferência do ativo on-chain.',
    tamanho_camiseta: 'G',
    risco: 'Alto',
    valor_negocio: 10,
    fator_uau: true,
  }
];

export const ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'] as const;
export const IMAGE_SIZES = ['1K', '2K', '4K'] as const;