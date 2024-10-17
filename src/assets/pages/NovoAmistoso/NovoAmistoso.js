import React from 'react';
import { Header } from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import './NovoAmistoso.css'; 


const NovoAmistoso = () => {
  return (
    <>
        <Header/>
        
        <body>
            <div className='center'>
                <div className='body-content card'>
                   <strong># Novo Amistoso</strong>
                   <div className="area-novo-jogo">

                        <label className="label-app" for="nome-sessao">| Nome da sessão:</label>
                        <div className="input-area">
                            <input className="input-app" type="text" name="nome-sessao" id="nome-sessao"/>
                        </div>
                            
                        <label className="label-app" for="nome-sessao">| Número de jogadores por time: <small>(não conta goleiro)</small></label>
                        <div className="input-area">
                            <input className="input-app" type="number" name="jogadores-por-time" id="jogadores-por-time"/>
                        </div>

                        <label className="label-app" for="tempo-jogo">| Tempo de jogo: <small>(em minutos)</small></label>
                        <div className="input-area">
                            <input className="input-app" type="number" name="tempo-jogo" id="tempo-jogo"/>
                        </div>

                        <label className="label-app" for="pontos-fim">| Pontos para acabar:</label>
                        <div className="input-area">
                            <input className="input-app" type="number" name="pontos-fim" id="pontos-fim"/>
                        </div>
                          
                        <div id="novo-jogo" className="btn-default" href="">AVANÇAR</div>
                    </div>
                </div>
            </div>
        </body>
    </>
  );
};

export default NovoAmistoso;
