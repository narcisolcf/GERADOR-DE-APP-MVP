import { Feature } from './types';

export const MOCK_FEATURES: Feature[] = [
  {
    id: 'f1',
    name: 'Conectar Carteira (Metamask)',
    description: 'Permitir autenticação via Web3.',
    scores: { valuable: true, usable: true, feasible: 'High', wow: false },
    size: 'M',
    risk: 'Green',
    type: 'UI'
  },
  {
    id: 'f2',
    name: 'Galeria de NFTs',
    description: 'Listar NFTs disponíveis para compra.',
    scores: { valuable: true, usable: true, feasible: 'High', wow: true },
    size: 'M',
    risk: 'Green',
    type: 'UI'
  },
  {
    id: 'f3',
    name: 'Smart Contract de Leilão',
    description: 'Lógica de lances e expiração on-chain.',
    scores: { valuable: true, usable: false, feasible: 'Low', wow: true },
    size: 'G',
    risk: 'Red',
    type: 'Logic'
  }
];

export const ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'] as const;
export const IMAGE_SIZES = ['1K', '2K', '4K'] as const;