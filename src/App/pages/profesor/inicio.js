import React, { useState, useEffect } from 'react'
import localS from 'local-storage'
import { db } from '../../../firebase'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function InicioProfesor() {
    const classes = useStyles()
    const [datosOk, setDatosOk] = useState(false)
    const [numSorteo, setNumSorteo] = useState(0)
    const [tema, setTema] = useState('')
    const [botonCheck, setBotonCheck] = useState(true)
    const [botonView, setBotonView] = useState(true)

    useEffect(() => {
        const datSor = async () => {
            await db.collection('sorteo').doc('fNxeb9kE5mXD3uObz4sU').get()
                .then((snapshot) => {
                    localS.set('numAle', snapshot.data())
                    setNumSorteo(Math.floor(Math.random() * (localS.get('numAle').aleatorio.length - 0)) + 0)
                    setDatosOk(true)
                })
        }
        datSor()
    }, [])

    const handleTema = async () => {
        setBotonCheck(false)
        var newListSorteo = localS.get('numAle').aleatorio.filter(value => value != localS.get('numAle').aleatorio[numSorteo])
        //var newListSorteo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const jsonValues = {
            aleatorio: newListSorteo
        }
        await db.collection('sorteo').doc('fNxeb9kE5mXD3uObz4sU').update(jsonValues)

        await db.collection('cursos').where('Nombre', '==', localS.get('cursos')).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const silab = doc.data()
                    const silabIndex = Math.floor(Math.random() * (silab.Silabo.length - 0)) + 0
                    console.log(silab.Silabo[silabIndex])
                    setTema(silab.Silabo[silabIndex])
                    setBotonView(false)
                })
            })
    }

    return (
        <div className={`${classes.root} lesgo`}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.root2} >
                    <Paper className={`${classes.paper}`}>
                        <Grid container spacing={1} className={`producttabCenterImg`}>
                            {datosOk ?
                                <Grid item sm container>
                                    <Grid item xs container direction="column" spacing={8} className={`producttabCenter`}>
                                        <Grid item xs>
                                            <div className={`espacioBottom`}>
                                                <Typography className={`noActionsColor subirChild`} component="h1">
                                                    Postulante Nro {localS.get('numAle').aleatorio[numSorteo]}:
                                                </Typography>
                                                Presentacion: <a href="https://www.facebook.com/PaginaOficialUNSA/">https://google.meet.com</a>
                                            </div>
                                            <Typography className={`noActionsColor`} component="h4">
                                                Nombre Completo
                                            </Typography>
                                            <Typography variant="body2" className={``} color="textSecondary" component="p">
                                                {localS.get('nameSystem')} {localS.get('lastNameSystem')}
                                            </Typography>
                                            <Typography className={`noActionsColor`} component="h4">
                                                Curso
                                            </Typography>
                                            <Typography variant="body2" className={``} color="textSecondary" component="p">
                                                {localS.get('cursos')}
                                            </Typography>
                                            <Typography className={`noActionsColor`} component="h4">
                                                Email
                                            </Typography>
                                            <Typography variant="body2" className={``} color="textSecondary" component="p">
                                                {localS.get('emailSystem')}
                                            </Typography>

                                            <Grid>
                                                <Typography className={`noActionsColor`} component="h4">
                                                    Tema de Silabo:
                                                </Typography>
                                                {botonView ?
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={handleTema}
                                                        className={`${classes.submit} dontMove modifyButton3`}
                                                    >{botonCheck ? <div>Saber Tema</div> :
                                                        <CircularProgress className={'marginTop-2p noActionsColor'} />}
                                                    </Button>
                                                    :
                                                    <Typography variant="body2" className={`noActionsColor2`} component="h2">
                                                        {tema}
                                                    </Typography>
                                                }

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid> :
                                <Grid className={`moveCenter sizeGrid`} style={{ alignItems: 'center' }} item xs={12} sm container>
                                    <CircularProgress className={'noActionsColor'} />
                                </Grid>}
                            <Grid style={{ textAlign: 'center' }} item>
                                <img className={`moveCenter sizeCustom`} alt='' src='assets/images/horario.png' />
                            </Grid>
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
    second: {
        display: 'flex',
        alignItems: 'center',
    },
}))