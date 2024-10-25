import React, { useState } from 'react';
import { addJogador, addJogadorAosReservas, getProximoIdJogador } from '../../../db/db'; // Importa as funções
import './ListaReservas.css'; 

const ListaReservas = ({ reservasAtualizados, onReservasAtualizadas }) => {
    const [nomeJogador, setNomeJogador] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla a abertura do modal
    const [jogadorSelecionado, setJogadorSelecionado] = useState(null);

    // Função para adicionar jogador à lista de reservas
    const handleAddJogadorReserva = async () => {
        if (!nomeJogador.trim()) {
            alert('Digite o nome do jogador');
            return;
        }

        const novoId = await getProximoIdJogador(); // Obtém o próximo ID disponível
        const novoJogador = {
            id: novoId,
            nome: nomeJogador,
            gols: 0
        };

        // Adiciona o jogador no registro principal e na lista de reservas
        await addJogador(novoJogador);
        await addJogadorAosReservas(novoJogador);

        // Atualiza a lista de reservas no componente pai
        onReservasAtualizadas();

        // Limpa o campo de input após a adição
        setNomeJogador('');
    };

    const handleEditJogador = async (id) => {
        const jogador = reservasAtualizados.find(jogador => jogador.id === id);
        setJogadorSelecionado(jogador); // Define o jogador selecionado
        setIsModalOpen(true);
    }

    return (
        <>
            <label className="label-app">| Próximo time</label>
            <div className="proximo-time-area">
                <div className="proximo-time">
                    {reservasAtualizados.map(jogador => (
                        <div key={jogador.id} className="proximo-time-jogador">
                            <div>{jogador.nome}</div>
                            <button onClick={() => handleEditJogador(jogador.id)}>editar</button>
                        </div>
                    ))}
                </div>
            </div>  
            
            <label className="label-app">| Adicionar jogador</label>
            <div className="input-area">
                <input
                    className="input-app"
                    type="text"
                    name="nome-jogador"
                    id="nome-jogador"
                    value={nomeJogador}
                    onChange={(e) => setNomeJogador(e.target.value)}
                />
                <button id="add-jogador" onClick={handleAddJogadorReserva}>+</button>
            </div>   

            {/* Modal de edição Jogador */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className='modal-content-top'>
                            <strong>Editar Jogador</strong>
                            <button className='modal-cancel' onClick={() => setIsModalOpen(false)}>X</button>
                        </div>
                        <div className='modal-content-body'>
                            <p><strong>Nome jogador:</strong> {jogadorSelecionado.nome}</p>
                            <p><strong>Gols:</strong> {jogadorSelecionado.gols}</p>
                            <label className="label-app">| Editar Jogador</label>
                            <div className="input-area">
                                <input
                                    className="input-app"
                                    type="text"
                                    name="nome-jogador"
                                    id="nome-jogador"
                                />
                            </div> 
                            <div className='modal-content-bottom'>
                                <button id="salvar-jogador">Salvar</button>
                                <button id="deletar-jogador">Excluir Jogador</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListaReservas;
