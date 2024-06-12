import React, { useState } from "react";
import './estudios.css';

const Estudios = ({ mostrarDetalle }) => {
    const [mostrarInformacion, setMostrarInformacion] = useState(null);

    const loadContent = async (clave) => {
        const res = await fetch(`/Estudios/${clave}`);
        const content = await res.text();
        setMostrarInformacion(content);
    };

    return (
        <div id="container-estudios">
            <div className="titulo">
                <h1>Estudios</h1>
            </div>
            <section id="section-estudios">
                <div className="dropdown">
                    <div>
                        <p>Programas de Formación e Inserción</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#' onClick={() => loadContent('pfi')}>PFI Auxiliar de muntatge i manteniment d’equips informàtics</a>
                    </div>
                </div>

                <div className="dropdown">
                    <div>
                        <p>Ciclo Formativo Grado Medio</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#smx' onClick={() => loadContent('cfgm-smx')}>CFGM Sistemes Microinformàtics i Xarxes (SMX) (IC10)</a>
                    </div>
                </div>

                <div className="dropdown">
                    <div>
                        <p>Ciclo Formativo Grado Superior</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#dam' onClick={() => loadContent('cfgs-dam')}>CFGS Desenvolupament d’Aplicacions Multiplataforma (DAM) (ICB0)</a>
                        <a href='#daw' onClick={() => loadContent('cfgs-daw')}>CFGS Desenvolupament d’Aplicacions Web (DAW) (ICC0)</a>
                        <a href='#asix' onClick={() => loadContent('cfgs-asix')}>CFGS Administració de Sistemes Informàtics en Xarxa (ASIX) (ICA0)</a>
                    </div>
                </div>

                <div className="dropdown">
                    <div>
                        <p>Curso de Especialización</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#ce' onClick={() => loadContent('ce')}>CE en Intel·ligència Artificial i Big Data</a>
                    </div>
                </div>
            </section>

            {mostrarDetalle && (
                <section id="bloque-informacion-estudios">
                    <div id="bloquePruebaEstudios" dangerouslySetInnerHTML={{ __html: mostrarInformacion }}>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Estudios;
