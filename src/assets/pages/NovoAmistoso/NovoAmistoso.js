import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import Jogo from '../../../models/Jogo';
import { addJogo } from '../../../db/db';
import './NovoAmistoso.css'; 

const NovoAmistoso = () => {
    const [nomeSessao, setNomeSessao] = useState('');
    const [jogadoresPorTime, setJogadoresPorTime] = useState('');
    const [tempoDeJogo, setTempoDeJogo] = useState('');
    const [pontosParaAcabar, setPontosParaAcabar] = useState('');

    const navigate = useNavigate();

    const handleAvancar = async () => {
        // Verificação dos campos vazios
        if (!nomeSessao || !jogadoresPorTime || !tempoDeJogo || !pontosParaAcabar) {
            alert('Por favor, preencha todos os campos antes de avançar.');
            return;
        }
      
        try {
            const novoJogo = new Jogo(nomeSessao, 'futebol', parseInt(jogadoresPorTime), parseInt(tempoDeJogo), parseInt(pontosParaAcabar));
            
            // Salvar no IndexedDB
            await addJogo(novoJogo);
        
            // Redireciona para a próxima página
            navigate('/novo-amistoso/incluir-jogadores');
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
            alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
        }
    };

    return (
        <>
            <Header/>
            
            <body>
                <div className='center'>
                    <div className='body-content card'>
                        <div className='topo-page'>
                            <strong># Novo Amistoso</strong>                        
                        </div>
                        <div className="area-novo-jogo">

                            <label className="label-app" for="nome-sessao">| Nome da sessão:</label>
                            <div className="input-area">
                            <input
                                className="input-app"
                                type="text"
                                name="nome-sessao"
                                id="nome-sessao"
                                value={nomeSessao}
                                onChange={(e) => setNomeSessao(e.target.value)}
                            />
                            </div>
                                
                            <label className="label-app" for="nome-sessao">| Número de jogadores por time: <small>(não conta goleiro)</small></label>
                            <div className="input-area">
                                <input
                                    className="input-app"
                                    type="number"
                                    name="jogadores-por-time"
                                    id="jogadores-por-time"
                                    value={jogadoresPorTime}
                                    onChange={(e) => setJogadoresPorTime(e.target.value)}
                                />
                            </div>

                            <label className="label-app" for="tempo-jogo">| Tempo de jogo: <small>(em minutos)</small></label>
                            <div className="input-area">
                                <input
                                    className="input-app"
                                    type="number"
                                    name="tempo-jogo"
                                    id="tempo-jogo"
                                    value={tempoDeJogo}
                                    onChange={(e) => setTempoDeJogo(e.target.value)}
                                />
                            </div>

                            <label className="label-app" for="pontos-fim">| Pontos para acabar:</label>
                            <div className="input-area">
                                <input
                                    className="input-app"
                                    type="number"
                                    name="pontos-fim"
                                    id="pontos-fim"
                                    value={pontosParaAcabar}
                                    onChange={(e) => setPontosParaAcabar(e.target.value)}
                                />
                            </div>
                            
                            <button
                                id="novo-jogo"
                                className="btn-default"
                                onClick={handleAvancar}
                            >
                                AVANÇAR
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </>
    );
};

export default NovoAmistoso;
