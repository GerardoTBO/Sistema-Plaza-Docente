import React, { useState } from 'react'
import localS from 'local-storage'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import ProfesorRegister from './profesor/register'
import EvaluadorRegister from './evaluador/login'

export default function Portada() {
    const [openProfesor, setOpenProfesor] = useState(false)
    const [openEvaluador, setOpenEvaluador] = useState(false)

    const handleCloseProfesor = (e) => {
        setOpenProfesor(false)
    }

    const handleOpenProfesor = () => {
        setOpenProfesor(true)
        localS.set('idProfesor','')
    }

    const handleCloseEvaluador = (e) => {
        setOpenEvaluador(false)
    }

    const handleOpenEvaluador = (e) => {
        setOpenEvaluador(true)
    }

    return (
        <div id="wrapper">

            <header id="header" className="alt">
                <a href="index.html" className="logo"><strong>UNSA</strong> <span>Sistema Docente</span></a>
                <nav>
                    <div className={`noLink`} onClick={handleOpenEvaluador}>¿Eres evaluador?</div>
                </nav>
            </header>

            <section id="banner" className="major">
                <div className="inner">
                    <header className="major">
                        <h1>PLataforma Elección Docente</h1>
                    </header>
                    <div className="content">
                        <p>Logra tus metas postulando como docente para la UNSA. <br />
                            La mejor universidad del sur del Perú.</p>
                        <ul className="actions">
                            <li>
                                <Button onClick={handleOpenProfesor}>
                                    <ListItem button>
                                        <ListItemIcon><ArrowForwardIosIcon /></ListItemIcon>
                                        <ListItemText primary={'Empezar'} />
                                    </ListItem>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <Toolbar>
                    <ProfesorRegister handleCloseProfesor={handleCloseProfesor} handleOpenSignIn={openProfesor} />
                </Toolbar>
                <Toolbar>
                    <EvaluadorRegister handleCloseEvaluador={handleCloseEvaluador} handleOpenSignIn={openEvaluador} />
                </Toolbar>
            </section>

            <footer id="footer">
                <div className="inner">
                    <ul className="icons">
                        <li><a target="_blank" rel="noreferrer" href="https://www.facebook.com/PaginaOficialUNSA/" className="icon brands alt fa-facebook-f"><span className="label">Facebook</span></a></li>
                        <li><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/school/universidad-nacional-de-san-agustin-de-arequipa/?originalSubdomain=pe" className="icon brands alt fa-linkedin-in"><span className="label">LinkedIn</span></a></li>
                    </ul>
                    <ul className="copyright">
                        <li>&copy; UNSA</li><li>By: <a href="https://www.unsa.edu.pe/">UNSA</a></li>
                    </ul>
                </div>
            </footer>

        </div>
    )
}
