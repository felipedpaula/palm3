import React, { useEffect, useState } from 'react';
import { getJogadoresTime1, getJogadoresTime2 } from '../../../db/db'; // Importar as funções corretas
import './TimesEmCampo.css'; 

const TimesEmCampo = ({ time1Atualizado, time2Atualizado }) => {
    const [time1, setTime1] = useState([]);
    const [time2, setTime2] = useState([]);
    const [golsTime1, setGolsTime1] = useState(0); // Estado para o placar do Time 1
    const [golsTime2, setGolsTime2] = useState(0); // Estado para o placar do Time 2

    // Atualiza time1 e time2 quando forem alterados nas props
    useEffect(() => {
        if (time1Atualizado.length > 0) {
            setTime1(time1Atualizado);
        }
    }, [time1Atualizado]);

    useEffect(() => {
        if (time2Atualizado.length > 0) {
            setTime2(time2Atualizado);
        }
    }, [time2Atualizado]);

    // Buscar os jogadores do IndexedDB (chama-se no carregamento inicial)
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const time1Jogadores = await getJogadoresTime1(); // Pega os jogadores do time 1
                const time2Jogadores = await getJogadoresTime2(); // Pega os jogadores do time 2

                setTime1(time1Jogadores); // Atualiza o estado de time 1
                setTime2(time2Jogadores); // Atualiza o estado de time 2
            } catch (error) {
                console.error('Erro ao buscar os jogadores dos times:', error);
            }
        };
        fetchTimes();
    }, []);

    // Funções para incrementar e decrementar o placar
    const adicionarGolTime1 = () => setGolsTime1(golsTime1 + 1);
    const removerGolTime1 = () => {
        if (golsTime1 > 0) setGolsTime1(golsTime1 - 1); // Não permitir valores negativos
    };

    const adicionarGolTime2 = () => setGolsTime2(golsTime2 + 1);
    const removerGolTime2 = () => {
        if (golsTime2 > 0) setGolsTime2(golsTime2 - 1); // Não permitir valores negativos
    };

    return (
        <div className="topo-times">
            <div className="topo-time-1">
                <label className="label-app">TIME 1</label>
                <div className="gols-time-1">
                    <div className="add" id="add-gol-1" onClick={adicionarGolTime1}>+</div>
                    <span className="gols-1">{golsTime1}</span>
                    <div className="remove" id="remove-gol-1" onClick={removerGolTime1}>-</div>
                </div>
                <div className="lista-jogadores-time-1">
                    {time1.map(jogador => (
                        <div key={jogador.id} className="jogador-time-1">
                            {jogador.nome} {/* Exibir o nome do jogador */}
                        </div>
                    ))}
                </div>
            </div>
            <span className="versus">X</span>
            <div className="topo-time-2">
                <label className="label-app">TIME 2</label>
                <div className="gols-time-2">
                    <div className="add" id="add-gol-2" onClick={adicionarGolTime2}>+</div>
                    <span className="gols-2">{golsTime2}</span>
                    <div className="remove" id="remove-gol-2" onClick={removerGolTime2}>-</div>
                </div>
                <div className="lista-jogadores-time-2">
                    {time2.map(jogador => (
                        <div key={jogador.id} className="jogador-time-2">
                            {jogador.nome} {/* Exibir o nome do jogador */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimesEmCampo;