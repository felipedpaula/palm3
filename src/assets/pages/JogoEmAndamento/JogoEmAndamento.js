import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import Cronometro from '../../components/Cronometro/Cronometro';
import { getDadosJogo, vitoriaTime1, atualizarTime2ComReservas, getJogadoresTime2, getJogadoresProxReservas } from '../../../db/db';
import TimesEmCampo from '../../components/TimesEmCampo/TimesEmCampo';
import ListaReservas from '../../components/ListaReservas/ListaReservas';
import './JogoEmAndamento.css'; 

const JogoEmAndamento = () => {
    const [jogo, setJogo] = useState([]);
    const [time2, setTime2] = useState([]);
    const [proxReservas, setProxReservas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla a abertura do modal

    const atualizarDadosDosTimes = async () => {
        try {
            const novosTime2 = await getJogadoresTime2(); // Busca os jogadores do time 2 atualizados
            const novasReservas = await getJogadoresProxReservas(); // Busca a lista de proximosReservas atualizada
            
            setTime2(novosTime2); // Atualiza o estado de Time 2
            setProxReservas(novasReservas); // Atualiza o estado de proximosReservas
        } catch (error) {
            console.error('Erro ao atualizar os dados dos times:', error);
        }
    };

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
        fetchJogo();
    }, []);

    const handleTime1Vencedor = async () => {
        try {
            await vitoriaTime1(); // Primeiro, move o time 2 para as reservas
            await atualizarTime2ComReservas(); // Atualiza o time 2 com os novos jogadores da reserva
            await atualizarDadosDosTimes(); // Atualiza os componentes visualmente após as operações
            setIsModalOpen(false); // Fecha o modal após a operação
        } catch (error) {
            console.error('Erro ao atualizar as reservas e o time 2:', error);
        }
    };
    

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
                            <TimesEmCampo time2Atualizado={time2} />

                            {/* Botão para abrir o modal */}
                            <button className="btn-app" onClick={() => setIsModalOpen(true)}>
                                Finalizar JOGO
                            </button>

                            <ListaReservas reservas={proxReservas} />

                            {/* Modal customizado */}
                            {isModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h2>Quem VENCEU a partida?</h2>
                                        <div className="modal-actions">
                                            <button onClick={handleTime1Vencedor} className="modal-confirm">Time 1</button>
                                            {/* <button onClick={() => handleTime2Vencedor()} className="modal-confirm">Time 2</button> */}
                                            {/* <button onClick={() => empate()} className="modal-empate">Empate</button> */}
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
