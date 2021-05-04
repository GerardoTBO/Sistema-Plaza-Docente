import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
//import localS from 'local-storage'
import { db } from '../../../firebase'

import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import GetAppIcon from '@material-ui/icons/GetApp'
import TextField from '@material-ui/core/TextField'

export default function CurriculumEvaluador() {
    const classes = useStyles()
    const [datosOk, setDatosOk] = useState(false)
    const [paginaAnterior, setPaginaAnterior] = useState(false)
    const [datosProfes, setDatosProfes] = useState({})
    const [notaUno, setNotaUno] = useState(0)

    const handleNota = idProfe => async (e) => {
        await db.collection('postulacion').where('Docente', '==', idProfe).get()
            .then((querySnapshot) => {
                const docs = []
                querySnapshot.forEach((element) => {
                    // doc.data() is never undefined for query doc snapshots
                    docs.push({ ...element.data(), id: element.id })
                })
                //console.log(docs[0]) // docs[0] es la data del documento especifico de postulacion
                db.collection('postulacion').doc(docs[0].id).update({nota1: notaUno})                
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            })
    }

    useEffect(() => {
        const getProfes = () => {
            db.collection('docentes').onSnapshot((query) => {
                const docs = []
                query.forEach(element => {
                    docs.push({ ...element.data(), id: element.id })
                })
                setDatosProfes(docs)
                setDatosOk(true)
            })
        }
        getProfes()
    }, [])

    const handleField = (e) => {
        setNotaUno(e.target.value)
    }

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
                                    <Grid item xs container direction="column" spacing={8} className={`producttabCenter`}>
                                        <Grid item xs>
                                            <Typography className={`noActionsColor subirChild`} component="h1">
                                                Curriculum
                                            </Typography>
                                        </Grid>

                                        <Grid container justify="center" spacing={2}>
                                            {datosProfes.map((value) => (
                                                <Grid key={value.Nombre} item>
                                                    <Paper className={classes.paper2}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12}>
                                                                <Typography className={`noActionsColor`} component="h4">
                                                                    {value.Nombre} {value.Apellidos}
                                                                </Typography>
                                                                Descarga Curriculum:
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    target="_blank"
                                                                    href={`${value.Curriculo}`}
                                                                    className={`${classes.button} modifyButton5`}
                                                                    startIcon={<GetAppIcon />}
                                                                > CV
                                                                </Button>
                                                                <Divider variant="middle" />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography className={`noActionsColor`} component="h4">
                                                                    Agrega Nota:
                                                                </Typography>
                                                                <TextField
                                                                    id={`${value.Nombre}`}
                                                                    label="Nota"
                                                                    className={`textFieldFilled`}
                                                                    onChange={handleField}
                                                                    variant="filled" />
                                                                <IconButton
                                                                    onClick={handleNota(value.id)}
                                                                    type="submit" className={classes.iconButton} aria-label="search">
                                                                    <SendIcon className={`noActionsColor`} />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>

                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>

                                    </Grid>
                                </Grid> :
                                <Grid className={`moveCenter sizeGrid`} style={{ alignItems: 'center' }} item xs={12} sm container>
                                    <CircularProgress className={'noActionsColor'} />
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
}))