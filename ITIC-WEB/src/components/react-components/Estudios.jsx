import React, { useState, useEffect } from "react";
import './estudios.css';

const Estudios = ({ mostrarDetalle }) => {
    const [mostrarInformacion, setMostrarInformacion] = useState(null);
    const [clave, setClave] = useState(null);

    const loadContent = async (clave) => {
        const res = await fetch(`/Estudios/${clave}`);
        const content = await res.text();
        setMostrarInformacion(content);
    };

    const navigateToStudy = (clave) => {
        window.location.href = `/Estudios?clave=${clave}`;
    };

    useEffect(() => {
        const urlClave = new URLSearchParams(window.location.search).get('clave');
        if (urlClave) {
            setClave(urlClave);
            loadContent(urlClave);
        }
    }, []);

    useEffect(() => {
        if (clave) {
            loadContent(clave);
        }
    }, [clave]);

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
                        <a href='#' onClick={() => navigateToStudy('pfi')}>PFI Auxiliar de muntatge i manteniment d’equips informàtics</a>
                    </div>
                </div>

                <div className="dropdown">
                    <div>
                        <p>Ciclo Formativo Grado Medio</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#' onClick={() => navigateToStudy('cfgm-smx')}>CFGM Sistemes Microinformàtics i Xarxes (SMX) (IC10)</a>
                    </div>
                </div>

                <div className="dropdown">
                    <div>
                        <p>Ciclo Formativo Grado Superior</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#' onClick={() => navigateToStudy('cfgs-dam')}>CFGS Desenvolupament d’Aplicacions Multiplataforma (DAM) (ICB0)</a>
                        <a href='#' onClick={() => navigateToStudy('cfgs-daw')}>CFGS Desenvolupament d’Aplicacions Web (DAW) (ICC0)</a>
                        <a href='#' onClick={() => navigateToStudy('cfgs-asix')}>CFGS Administració de Sistemes Informàtics en Xarxa (ASIX) (ICA0)</a>
                    </div>
                </div>

                <div className="dropdown">
                    <div>
                        <p>Curso de Especialización</p>
                    </div>
                    <div className="dropdown-content">
                        <a href='#' onClick={() => navigateToStudy('ce')}>CE en Intel·ligència Artificial i Big Data</a>
                    </div>
                </div>
            </section>

            {mostrarDetalle && mostrarInformacion && (
                <section id="bloque-informacion-estudios">
                    <div id="bloquePruebaEstudios" dangerouslySetInnerHTML={{ __html: mostrarInformacion }}>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Estudios;
