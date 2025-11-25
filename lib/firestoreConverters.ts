import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';
import { Projeto, Funcionalidade } from '../types';

export const projetoConverter: FirestoreDataConverter<Projeto> = {
  toFirestore(projeto: Projeto): DocumentData {
    return {
      usuario_id: projeto.usuario_id,
      nome_projeto: projeto.nome_projeto,
      descricao_problema: projeto.descricao_problema,
      data_criacao: projeto.data_criacao,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Projeto {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      usuario_id: data.usuario_id,
      nome_projeto: data.nome_projeto,
      descricao_problema: data.descricao_problema,
      data_criacao: data.data_criacao as Timestamp,
    };
  },
};

export const funcionalidadeConverter: FirestoreDataConverter<Funcionalidade> = {
  toFirestore(funcionalidade: Funcionalidade): DocumentData {
    return {
      projeto_id: funcionalidade.projeto_id,
      titulo: funcionalidade.titulo,
      descricao: funcionalidade.descricao,
      tamanho_camiseta: funcionalidade.tamanho_camiseta,
      risco: funcionalidade.risco,
      valor_negocio: funcionalidade.valor_negocio,
      fator_uau: funcionalidade.fator_uau,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Funcionalidade {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      projeto_id: data.projeto_id,
      titulo: data.titulo,
      descricao: data.descricao,
      tamanho_camiseta: data.tamanho_camiseta,
      risco: data.risco,
      valor_negocio: data.valor_negocio,
      fator_uau: data.fator_uau,
    };
  },
};
