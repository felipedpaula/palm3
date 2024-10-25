import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import Cronometro from '../../components/Cronometro/Cronometro';
import { getDadosJogo, vitoriaTime1, vitoriaTime2, atualizarTimeComReservas, getJogadoresTime1, getJogadoresTime2, getJogadoresProxReservas } from '../../../db/db';
import TimesEmCampo from '../../components/TimesEmCampo/TimesEmCampo';
import ListaReservas from '../../components/ListaReservas/ListaReservas';
import './JogoEmAndamento.css'; 

const JogoEmAndamento = () => {
    const [jogo, setJogo] = useState([]);
    const [time1, setTime1] = useState([]);
    const [time2, setTime2] = useState([]);
    const [proxReservas, setProxReservas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const dadosJogo = await getDadosJogo();
                const reservasIniciais = await getJogadoresProxReservas(); // Busca inicial dos reservas

                if (dadosJogo.length > 0) {
                    setJogo(dadosJogo[0]);
                } else {
                    console.log('Nenhum jogo encontrado.');
                }

                setProxReservas(reservasIniciais); // Configura os reservas na inicialização
            } catch (error) {
                console.error('Erro ao recuperar os dados iniciais:', error);
            }
        };    
        fetchInitialData();
    }, []);

    const handleTime1Vencedor = async () => {
        try {
            await vitoriaTime1(); // Primeiro, move o time 2 para as reservas
            await atualizarTimeComReservas('time2' ,jogo.jogadoresPorTime); // Atualiza o time 2 com os novos jogadores da reserva
            await atualizarDadosDosTimes(); // Atualiza os componentes visualmente após as operações
            setIsModalOpen(false); // Fecha o modal após a operação
        } catch (error) {
            console.error('Erro ao atualizar as reservas e o time 2:', error);
        }
    };

    const handleTime2Vencedor = async () => {
        try {
            await vitoriaTime2(); // Função que registra a vitória do time 2 e move o time 1 para as reservas
            await atualizarTimeComReservas('time1', jogo.jogadoresPorTime); // Atualiza o time 1 com os novos jogadores da reserva
            await atualizarDadosDosTimes(); // Atualiza os componentes visualmente após as operações
            setIsModalOpen(false); // Fecha o modal após a operação
        } catch (error) {
            console.error('Erro ao atualizar as reservas e o time 1:', error);
        }
    };    

    const handleEmpate = async () => {
        // Escolhe aleatoriamente o time que será inserido primeiro nos reservas
        const ordemAleatoria = Math.random();
        if (ordemAleatoria < 0.5) {
            await vitoriaTime2();
            await atualizarTimeComReservas('time1', jogo.jogadoresPorTime);
            await vitoriaTime1();
            await atualizarTimeComReservas('time2', jogo.jogadoresPorTime);
        } else {
            await vitoriaTime1();
            await atualizarTimeComReservas('time2', jogo.jogadoresPorTime);
            await vitoriaTime2();
            await atualizarTimeComReservas('time1', jogo.jogadoresPorTime);
        };
        await atualizarDadosDosTimes();
        setIsModalOpen(false);
    };
    
    const atualizarDadosDosTimes = async () => {
        try {
            // Busca os jogadores dos dois times e a lista de reservas atualizada
            const novoTime1 = await getJogadoresTime1(); // Função que busca os jogadores do time 1 atualizados
            const novoTime2 = await getJogadoresTime2(); // Função que busca os jogadores do time 2 atualizados
            const novosReservas = await getJogadoresProxReservas(); // Busca a lista de proximosReservas atualizada
            
            // Atualiza os estados dos dois times e da lista de reservas
            setTime1(novoTime1); // Atualiza o estado de Time 1
            setTime2(novoTime2); // Atualiza o estado de Time 2
            setProxReservas(novosReservas); // Atualiza o estado de proxReservas
        } catch (error) {
            console.error('Erro ao atualizar os dados dos times:', error);
        }
    };

    // Função para atualizar reservas do IndexedDB
    const atualizarReservas = async () => {
        const reservasAtualizadas = await getJogadoresProxReservas();
        setProxReservas(reservasAtualizadas);
    };

    useEffect(() => {
        atualizarReservas();
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
                            <Cronometro/>
                            <TimesEmCampo time1Atualizado={time1} time2Atualizado={time2} />

                            {/* Botão para abrir o modal */}
                            <button className="btn-app" onClick={() => setIsModalOpen(true)}>
                                Finalizar JOGO
                            </button>

                            <ListaReservas reservasAtualizados={proxReservas} onReservasAtualizadas={atualizarReservas}  />

                            {/* Modal customizado */}
                            {isModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h2>Quem VENCEU a partida?</h2>
                                        <div className="modal-actions">
                                            <button onClick={handleTime1Vencedor} className="modal-confirm">Time 1</button>
                                            <button onClick={() => handleTime2Vencedor()} className="modal-confirm">Time 2</button>
                                            <button onClick={() => handleEmpate()} className="modal-empate">Empate</button>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="modal-cancel">Cancelar</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JogoEmAndamento;
