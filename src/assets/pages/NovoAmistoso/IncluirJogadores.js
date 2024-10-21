import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import './IncluirJogadores.css'; 
import { getDadosJogo, addJogador, getJogadores, removeJogador  } from '../../../db/db';


const IncluirJogadores = () => {

    const [nomeJogador, setNomeJogador] = useState('');
    const [jogadores, setJogadores] = useState([]);
    const [nextId, setNextId] = useState(1);

    useEffect(() => {
        const fetchJogo = async () => {
            try {
                const jogos = await getDadosJogo(); // Recupera todos os jogos
                if (jogos.length > 0) {
                    console.log('Jogo Criado:', jogos[jogos.length - 1]); // Mostra o último jogo criado
                } else {
                    console.log('Nenhum jogo encontrado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar o jogo:', error);
            }
        };

        fetchJogo();
    }, []);

    useEffect(() => {
        const fetchJogadores = async () => {
            const jogadoresDB = await getJogadores();
            if (jogadoresDB.length > 0) {
                setJogadores(jogadoresDB);
                setNextId(jogadoresDB.length + 1);
            }
        };
        fetchJogadores();
    }, []);

    // Função para adicionar jogador
    const handleAddJogador = async () => {
        if (!nomeJogador) {
            alert('Digite o nome do jogador');
            return;
        }

        const jogador = { id: nextId, nome: nomeJogador, gols: 0 };
        await addJogador(jogador); // Salva no IndexedDB

        // Atualiza a lista localmente
        setJogadores([...jogadores, jogador]);
        setNomeJogador(''); // Limpa o campo de input
        setNextId(nextId + 1); // Incrementa o próximo ID
    };

    // Função para remover jogador
    const handleRemoveJogador = async (id) => {
        await removeJogador(id); // Remove do IndexedDB
        setJogadores(jogadores.filter(jogador => jogador.id !== id)); // Atualiza a lista localmente
    };

    return (
        <>
            <Header/>
            
            <div className='body'>
                <div className='center'>
                    <div className='body-content card'>
                        <div className='topo-page'>
                            <strong># Novo Amistoso | Incluir Jogadores</strong>                        
                        </div>

                        <div className="area-novo-jogo">
                            <label className="label-app" htmlFor="nome-jogador">| Nome jogador:</label>
                            <div className="input-area">
                                <input
                                    className="input-app"
                                    type="text"
                                    name="nome-jogador"
                                    id="nome-jogador"
                                    value={nomeJogador}
                                    onChange={(e) => setNomeJogador(e.target.value)}
                                />
                                <button className="add" onClick={handleAddJogador}>+</button>
                            </div>

                            { jogadores.length > 0 && <>
                            <div className="lista-jogadores">
                                {jogadores.map((jogador, index) => (
                                <div key={jogador.id} className="jogador-item">
                                    <div className="ordem-jogador">{index + 1}.</div>
                                    <span>{jogador.nome}</span>
                                    <button className="remove-jogador" onClick={() => handleRemoveJogador(jogador.id)}>-</button>
                                </div>
                                ))}

                            </div>
                            <button
                                id="novo-jogo"
                                className="btn-default"
                                // onClick={handleAvancar}
                            >
                                AVANÇAR
                            </button>
                            </>}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IncluirJogadores;
