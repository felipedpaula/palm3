import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
// import Jogo from '../../../models/Jogo';
import { getDadosJogo, getJogadores, saveTime1, saveTime2, saveProxReservas, clearProxReservas, clearTime1, clearTime2 } from '../../../db/db';
import './PreJogo.css'; 
import { useNavigate } from 'react-router-dom';

const PreJogo = () => {

    const [jogo, setJogo] = useState([]);
    const [jogadores, setJogadores] = useState([]);
    const [time1, setTime1] = useState([]);
    const [time2, setTime2] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchJogo = async () => {
            try {
                const dadosJogo = await getDadosJogo();
                if (dadosJogo.length > 0) {
                    setJogo(dadosJogo[0]); // Como sempre será 1 jogo, pegamos o primeiro (ou único)
                } else {
                    console.log('Nenhum jogo encontrado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar o jogo:', error);
            }
        };    
        const fetchJogadores = async () => {
            const jogadoresDB = await getJogadores();
            if (jogadoresDB.length > 0) {
                setJogadores(jogadoresDB);
            }
        };
        fetchJogo();
        fetchJogadores();
    }, []);

    const criarTimesPorChegada = () => {
        const time1 = [];
        const time2 = [];
        const qtdPorTime = jogo?.jogadoresPorTime || 5; // Obtemos a quantidade de jogadores por time do objeto jogo, com um valor padrão de 5
    
        // Alterna os jogadores entre time1 e time2, respeitando o limite de jogadores por time
        jogadores.forEach((jogador, index) => {
            if (index % 2 === 0 && time1.length < qtdPorTime) {
                time1.push(jogador); // Jogadores em índices pares vão para o Time 1
            } else if (time2.length < qtdPorTime) {
                time2.push(jogador); // Jogadores em índices ímpares vão para o Time 2
            }
        });
    
        // Atualiza os times no estado
        setTime1(time1);
        setTime2(time2);
    };

    const criarTimesAleatorios = () => {
        const time1 = [];
        const time2 = [];
        const qtdPorTime = jogo?.jogadoresPorTime || 5; // Obtemos a quantidade de jogadores por time do objeto jogo, com um valor padrão de 5
    
        // Faz uma cópia do array de jogadores para embaralhar
        const jogadoresEmbaralhados = [...jogadores];
    
        // Algoritmo de Fisher-Yates para embaralhar o array
        for (let i = jogadoresEmbaralhados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [jogadoresEmbaralhados[i], jogadoresEmbaralhados[j]] = [jogadoresEmbaralhados[j], jogadoresEmbaralhados[i]];
        }
    
        // Distribui os jogadores embaralhados alternadamente entre time1 e time2, respeitando o limite de jogadores por time
        jogadoresEmbaralhados.forEach((jogador, index) => {
            if (time1.length < qtdPorTime) {
                time1.push(jogador);
            } else if (time2.length < qtdPorTime) {
                time2.push(jogador);
            }
        });
    
        // Atualiza os times no estado
        setTime1(time1);
        setTime2(time2);
    };

    const iniciarJogo = async () => {
        try {
            const jogadoresTime1 = [...time1]; 
            const jogadoresTime2 = [...time2];
    
            // Filtra os jogadores que não estão nem no Time 1 nem no Time 2 para definir as reservas
            const proxReservas = jogadores.filter(jogador => 
                !jogadoresTime1.some(t => t.id === jogador.id) && !jogadoresTime2.some(t => t.id === jogador.id)
            );
    
            // Limpa os stores antes de salvar os novos dados
            await clearTime1();
            await clearTime2();
            await clearProxReservas();
    
            // Salva os novos jogadores individualmente em cada store
            await saveTime1(jogadoresTime1);
            await saveTime2(jogadoresTime2);
            await saveProxReservas(proxReservas);
    
            // Redireciona para a página 'jogo-em-andamento'
            navigate('/novo-amistoso/jogo-em-andamento');
        } catch (error) {
            console.error('Erro ao iniciar o jogo:', error);
        }
    };

    return (
        <>
            <Header/>
            
            <div className='body'>
                <div className='center'>
                    <div className='body-content card'>
                        <div className='topo-page'>
                            <strong># Pré Jogo | Seleção de times</strong>                        
                        </div>

                        <div className="area-novo-jogo">
                            <label className="label-app" htmlFor="ordenacao">ORDENACAO</label>
                            <div className="area-ordenacao">
                                <button onClick={criarTimesPorChegada} id="ordem-chegada">CHEGADA</button>
                                <button onClick={criarTimesAleatorios} id="ordem-aleatoria">ALEATÓRIA</button>
                            </div>

                            <div className="area-pre-times">
                                <div className="pre-time-1">
                                    <label className="label-app">TIME 1</label>
                                    <div className="lista-pre-jogadores">
                                    {time1.map((jogador, index) => (
                                        <div key={jogador.id} className="pre-jogador-item">{jogador.nome}</div>
                                    ))}
                                    </div>
                                </div>
                                <div className="pre-time-2">
                                    <label className="label-app" htmlFor="pontos-fim">TIME 2</label>
                                    <div className="lista-pre-jogadores">
                                    {time2.map((jogador, index) => (
                                        <div key={jogador.id} className="pre-jogador-item">{jogador.nome}</div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                
                            <div className="area-pre-reservas">
                                <label className="label-app" htmlFor="pontos-fim">Jogadores</label>
                                <div className="lista-pre-reservas">
                                { jogadores.length > 0 && <>
                                    {jogadores.map((jogador, index) => (
                                        <div key={jogador.id} className="item-pre-reserva"><span>{jogador.nome}</span></div>
                                    ))}
                                </>}
                                </div>
                            </div>

                            <button id="novo-jogo" className="btn-app" onClick={iniciarJogo}>
                                Iniciar jogo
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PreJogo;
