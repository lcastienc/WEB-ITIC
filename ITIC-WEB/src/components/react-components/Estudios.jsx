import React, { useState } from "react";
import './estudios.css'

const Estudios = ({ mostrarDetalle }) => {

    const [mostrarInformacion, setMostrarInformacion] = useState({
        SMX: false,
        DAM: false,
        DAW: false,
        ASIX: false,
        CE: false,
        PFI: false
    });

    const renderInformacion = (clave) => {
        if (!informacion[clave]) return null;

        const estudio = informacion[clave];

        return (
            <div>
                <h2>Información {clave}:</h2>
                <p>¿Qué estudiaré?: {estudio.QueEstudiare}</p>
                <p>De qué trabajaré?: {estudio.DeQueTrabajar}</p>
                <p>Por qué ITIC: {estudio.PorQueITIC}</p>
                <p>Horario: {estudio.Horario}</p>
                <p>Objetivos:</p>
                <ul>
                    {estudio.Objetivos.map((objetivo, index) => (
                        <li key={index}>{objetivo}</li>
                    ))}
                </ul>
                <p>Duración: {estudio.Duracion}</p>
                <p>Titulación: {estudio.Titulacion}</p>
                <p>Primer Curso: {estudio.PrimerCurso.join(', ')}</p>
                <p>Segundo Curso: {estudio.SegundoCurso.join(', ')}</p>
                <p>Salidas Académicas: {estudio.SalidasAcademicas.join(', ')}</p>
            </div>
        );
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
                            <a href='/Erasmus' onClick={() => setMostrarInformacion({ ...mostrarInformacion, PFI: true })}>PFI Auxiliar de muntatge i manteniment d’equips informàtics</a>
                        </div>
                    </div>

                    <div className="dropdown">
                        <div>
                            <p>Ciclo Formativo Grado Medio</p>
                        </div>
                        <div className="dropdown-content">
                            <a  onClick={() => setMostrarInformacion({ ...mostrarInformacion, SMX: true })}>CFGM Sistemes Microinformàtics i Xarxes (SMX) (IC10)</a>
                        </div>
                    </div>

                    <div className="dropdown">
                        <div>
                            <p>Ciclo Formativo Grado Superior</p>
                        </div>
                        <div className="dropdown-content">
                            <a to="#" onClick={() => setMostrarInformacion({ ...mostrarInformacion, DAM: true })}>CFGS Desenvolupament d’Aplicacions Multiplataforma (DAM) (ICB0)</a>
                            <a to="#" onClick={() => setMostrarInformacion({ ...mostrarInformacion, DAW: true })}>CFGS Desenvolupament d’Aplicacions Web (DAW) (ICC0)</a>
                            <a to="#" onClick={() => setMostrarInformacion({ ...mostrarInformacion, ASIX: true })}>CFGS Administració de Sistemes Informàtics en Xarxa (ASIX) (ICA0)</a>
                        </div>
                    </div>

                    <div className="dropdown">
                        <div>
                            <p>Curso de Especialización</p>
                        </div>
                        <div className="dropdown-content">
                            <a to="#" onClick={() => setMostrarInformacion({ ...mostrarInformacion, CE: true })}>CE en Intel·ligència Artificial i Big Data</a>
                        </div>
                    </div>
                </section>

                {mostrarDetalle && (
                    <section id="bloque-informacion-estudios">
                        <div id="bloquePruebaEstudios">
                            {Object.keys(mostrarInformacion).map(clave => {
                                if (mostrarInformacion[clave]) {
                                    return (
                                        <div key={clave}>
                                            {renderInformacion(clave)}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </section>
                )}
            </div>
        
    );
}

export default Estudios;
