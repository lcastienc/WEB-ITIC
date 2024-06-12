import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ title, links }) => {
    return (
        <div className="sidebar">
            <h1>{title}</h1>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link.href}>{link.text}</a>
                    </li>
                ))}
            </ul>
            <style jsx>{`
                .sidebar {
                    background-color: #3A31F4;
                    padding: 20px;
                    width: 300px; /* Ancho fijo */
                    color: white;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                    flex-shrink: 0;
                    margin-top: 1.5%;
                }

                .sidebar h1 {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 600;
                    color: #30EFBC;
                    margin-bottom: 30px;
                }

                .sidebar ul {
                    list-style-type: none;
                    padding: 0;
                    flex-grow: 1;
                }

                .sidebar li {
                    margin: 15px 0;
                }

                .sidebar a {
                    color: white;
                    text-decoration: none;
                    font-family: 'Outfit', sans-serif;
                    font-size: 18px;
                    transition: color 0.3s ease;
                }

                .sidebar a:hover {
                    color: #30EFBC;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        width: 100%;
                        height: auto;
                        position: relative;
                    }
                }
            `}</style>
        </div>
    );
};

Sidebar.propTypes = {
    title: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Sidebar;
