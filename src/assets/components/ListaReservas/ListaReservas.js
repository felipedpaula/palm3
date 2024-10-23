import React, { useEffect, useState } from 'react';
import { getProxReservas } from '../../../db/db'; // Função para buscar os jogadores de reservas
import './ListaReservas.css'; 

const ListaReservas = () => {
    const [reservas, setReservas] = useState([]);

    // Buscar os jogadores de reserva no IndexedDB
    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const reservasDB = await getProxReservas(); // Pega os jogadores de reserva do IndexedDB
                setReservas(reservasDB); // Atualiza o estado com as reservas
            } catch (error) {
                console.error('Erro ao buscar os jogadores reservas:', error);
            }
        };
        fetchReservas();
    }, []);

    return (
        <>
            <label className="label-app">| Próximo time</label>
            <div className="proximo-time-area">
                <div className="proximo-time">
                    {reservas.map(jogador => (
                        <div key={jogador.id} className="proximo-time-jogador">
                            {jogador.nome} {/* Exibir o nome do jogador */}
                        </div>
                    ))}
                </div>
            </div>  
        </>
    );
};

export default ListaReservas;
