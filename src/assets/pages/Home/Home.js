import React from 'react';
import { Header } from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import './Home.css'; 


const Home = () => {
  return (
    <>
        <Header/>
        
        <body>
            <div className='center'>
                <div className='body-content card'>
                    <div className='area-menu-home'>
                        <Link className='btn-default' to="/novo-amistoso">Novo Amistoso</Link>
                    </div>
                </div>
            </div>
        </body>
    </>
  );
};

export default Home;