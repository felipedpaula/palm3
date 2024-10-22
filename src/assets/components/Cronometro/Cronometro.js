import React, { useEffect, useState, useRef } from 'react';
import { getDadosJogo } from '../../../db/db';
import './Cronometro.css'; 

const Cronometro = () => {
    const [tempoRestante, setTempoRestante] = useState(0); // Tempo restante em segundos
    const [estaAtivo, setEstaAtivo] = useState(false); // Controla se o cronômetro está ativo
    const [jogo, setJogo] = useState(null); // Armazena o jogo recuperado
    const [jogoIniciado, setJogoIniciado] = useState(false); // Verifica se o jogo foi iniciado para tocar som de término
    const [primeiroPlay, setPrimeiroPlay] = useState(true); // Flag para controlar o som de início

    // Ref para armazenar o som do apito
    const apito = useRef(new Audio('/audios/apito.mp3'));

    // Função para formatar o tempo em minutos e segundos
    const formatarTempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        return `${minutos}:${segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes}`;
    };

    // Buscar o jogo e configurar o tempo restante com base no tempoDeJogo
    useEffect(() => {
        const fetchJogo = async () => {
            try {
                const dadosJogo = await getDadosJogo();
                if (dadosJogo.length > 0) {
                    setJogo(dadosJogo[0]); // Como sempre será 1 jogo, pegamos o primeiro (ou único)
                    setTempoRestante(dadosJogo[0].tempoDeJogo * 60); // Configura o tempo restante com base no tempo de jogo (em minutos)
                } else {
                    console.log('Nenhum jogo encontrado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar o jogo:', error);
            }
        };    
        fetchJogo();
    }, []);

    // Controla o cronômetro
    useEffect(() => {
        let intervalo = null;

        if (estaAtivo && tempoRestante > 0) {
            intervalo = setInterval(() => {
                setTempoRestante(prevTempo => prevTempo - 1);
            }, 1000); // Atualiza a cada segundo
        } else if (tempoRestante === 0 && jogoIniciado) {
            clearInterval(intervalo); // Para o cronômetro quando chegar a zero
            apito.current.play(); // Toca o som do apito ao terminar o jogo
        }

        return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar
    }, [estaAtivo, tempoRestante, jogoIniciado]);

    // Controles do cronômetro
    const handlePlay = () => {
        setEstaAtivo(true);

        if (primeiroPlay) {
            apito.current.play().catch(err => {
                console.log('Reprodução bloqueada até interação do usuário: ', err);
            }); // Toca o som do apito ao iniciar o jogo pela primeira vez
            setPrimeiroPlay(false); // Marca que o jogo já foi iniciado uma vez
            setJogoIniciado(true); // Marca que o jogo foi iniciado
        }
    };
    
    const handlePause = () => setEstaAtivo(false);
    
    const handleStop = () => {
        setEstaAtivo(false);
        setPrimeiroPlay(true); // Reseta a flag para o próximo jogo
        if (jogo) {
            setTempoRestante(jogo.tempoDeJogo * 60); // Reseta o cronômetro para o tempo inicial
        }
    };

    // Define a classe com base no estado do jogo
    const definirClasseStatus = () => {
        if (tempoRestante === 0) {
            return 'fim-de-jogo'; // Quando o tempo acabar
        }
        return estaAtivo ? 'em-andamento' : 'parado'; // Ativo ou parado
    };

    return (
        <div className="topo-jogo">
            <div className="status-jogo">
                <label className="label-app">| Status JOGO:</label>
                <div className={`sinal ${definirClasseStatus()}`}>
                    {tempoRestante === 0 ? 'Fim de Jogo' : (estaAtivo ? 'Em Andamento' : 'Parado')}
                </div>
            </div>
            <div className="tempo-jogo">
                <label className="label-app">| TEMPO:</label>
                <div className="timer-jogo">
                    <div className="controles-jogo">
                        <div className="btn-controll play" onClick={handlePlay}>
                            <img width="25px" src="/images/play.png" alt="Play"/>
                        </div>
                        <div className="btn-controll pause" onClick={handlePause}>
                            <img width="25px" src="/images/pause.png" alt="Pause"/>
                        </div>
                        <div className="btn-controll stop" onClick={handleStop}>
                            <img width="25px" src="/images/stop.png" alt="Stop"/>
                        </div>
                    </div>
                    <div className="cronometro">
                        <span className="tempo-restante">{formatarTempo(tempoRestante)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cronometro;