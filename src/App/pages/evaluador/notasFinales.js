import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
//import localS from 'local-storage'
import { db } from '../../../firebase'
import SendEmail from './sendEmail'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export default function FinalesEvaluador() {
    const classes = useStyles()
    const [datosOk, setDatosOk] = useState(false)
    const [paginaAnterior, setPaginaAnterior] = useState(false)
    const [datosProfes, setDatosProfes] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [idpro, setIdpro] = useState('')

    const handleCloseModal = (e) => {
        setOpenModal(false)
    }

    const handleOpenModal = (name, email, id) => () => {
        setIdpro(id)
        setNombre(name)
        setEmail(email)
        setOpenModal(true)
    }

    useEffect(() => {
        const getProfes = () => {
            db.collection('notas_finales').onSnapshot((query) => {
                const docs = []
                query.forEach(element => {
                    docs.push({ ...element.data(), id: element.id })
                })
                setDatosProfes(docs)
                if (docs.length === 2) {
                    setDatosOk(true)
                } else {
                    setDatosOk(false)
                }
            })
        }
        getProfes()
    }, [])

    if (paginaAnterior) {
        return <Redirect to='/evaluador-inicio' />
    }

    return (
        <div className={`${classes.root} lesgo`}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.root2} >
                    <Paper className={`${classes.paper} cambiarBackground`}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setPaginaAnterior(true)}
                            className={`${classes.submit} modifyButton4`}
                            startIcon={<NavigateBeforeIcon />}
                        >
                            Atras
                        </Button>
                        <Grid container spacing={1} className={`producttabCenterImg`}>
                            {datosOk ?
                                <Grid item sm container>
                                    <Grid item style={{ alignItems: 'center' }} xs container direction="column" spacing={8} className={`producttabCenter`}>
                                        <Grid item xs>
                                            <Typography className={`noActionsColor subirChild`} component="h1">
                                                Notas Finales
                                            </Typography>
                                        </Grid>

                                        <Grid container justify="center" spacing={2}>

                                            <List component="nav" className={classes.lista} aria-label="contacts">
                                                {datosProfes.map((value) => (
                                                    <ListItem button
                                                        key={`${value.idPro}`}
                                                        className={`fixPadding`}
                                                        onClick={handleOpenModal(value.Docente, value.Email, value.idPro)}>
                                                        <ListItemText inset primary={`${value.Docente}`} />
                                                    </ListItem>
                                                ))}
                                            </List>

                                            <SendEmail
                                                handleCloseModalTeacher={handleCloseModal}
                                                handleOpenSignIn={openModal}
                                                nombre={nombre} email={email}
                                                profeId={idpro} loading={false} />
                                        </Grid>

                                    </Grid>
                                </Grid> :
                                <Grid className={`moveCenter sizeGrid`} style={{ alignItems: 'center' }} item xs={12} sm container>
                                    <CircularProgress className={'noActionsColor'} />
                                    <Typography className={`marginLeft`} variant="h3" gutterBottom>
                                        Aún no finalizan las presentaciones
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </Paper>
                </div>
            </main>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
    root2: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        margin: 'auto',

    },
    paper2: {
        padding: theme.spacing(4),
        margin: 'auto',
        minWidth: '320px',
        maxWidth: '400px'
    },
    second: {
        display: 'flex',
        alignItems: 'center',
    },
    lista: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: theme.palette.background.paper,
    },
}))