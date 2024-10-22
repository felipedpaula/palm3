import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import './JogoEmAndamento.css'; 
import { getDadosJogo, getJogadores } from '../../../db/db';

const JogoEmAndamento = () => {

    const [jogo, setJogo] = useState([]);
    const [jogadores, setJogadores] = useState([]);

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

    return (
        <>
            <Header/>
            
            <div className='body'>
                <div className='center'>
                    <div className='body-content card'>
                        <div className='topo-page'>
                            <strong># Amistoso | {jogo.nome}</strong>                        
                        </div>

                        <div className="area-jogo">
                            <div className="topo-jogo">
                                <div className="status-jogo">
                                    <label className="label-app">| Status JOGO:</label>
                                    <div className="sinal parado">
                                        Pausado
                                    </div>
                                </div>
                                <div class="tempo-jogo">
                                    <label class="label-app">| TEMPO:</label>
                                    <div class="timer-jogo">
                                        <div class="controles-jogo">
                                            <div class="btn-controll play">
                                                <img width="25px" src="/images/play.png" alt="Play"/>
                                            </div>
                                            <div class="btn-controll pause">
                                                <img width="25px" src="/images/pause.png" alt="Pause"/>
                                            </div>
                                            <div class="btn-controll stop">
                                                <img width="25px" src="/images/stop.png" alt="Stop"/>
                                            </div>
                                        </div>
                                        <div class="cronometro">
                                            <span class="tempo-restante"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JogoEmAndamento;
