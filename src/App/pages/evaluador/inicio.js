import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Redirect } from 'react-router'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'

export default function InicioEvaluador() {
    const classes = useStyles()
    const [curri, setCurri] = useState(false)
    const [prese, setPrese] = useState(false)
    const [finales, setFinales] = useState(false)
    const [paginaAnterior, setPaginaAnterior] = useState(false)

    if (curri) {
        return <Redirect to='/evaluador-curriculum' />
    }

    if (prese) {
        return <Redirect to='/evaluador-presentacion' />
    }

    if (finales) {
        return <Redirect to='/evaluador-notas-finales' />
    }

    if (paginaAnterior) {
        return <Redirect to='/' />
    }

    return (
        <div className={`${classes.root} lesgo`}>
            <main className={`${classes.content}`}>
                <div className={`${classes.toolbar}`} />
                <div className={`${classes.root2}`} >
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
                            <Grid item sm container>
                                <Grid item xs container direction="column" spacing={8} className={`producttabCenter`}>
                                    <Typography className={`noActionsColor`} component="h1">
                                        Calificacion
                                    </Typography>
                                    <Grid item xs>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            onClick={() => setCurri(true)}
                                            variant="contained"
                                            className={`modifyButton1`}
                                        >
                                            Curriculo
                                        </Button>
                                    </Grid>
                                    <Grid item xs>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            onClick={() => setPrese(true)}
                                            variant="contained"
                                            className={`${classes.submit} modifyButton2`}
                                        >
                                            Presentacion
                                        </Button>
                                    </Grid>
                                    <Grid item xs>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            onClick={() => setFinales(true)}
                                            variant="contained"
                                            className={`${classes.submit} modifyButton8`}
                                        >
                                            Notas Finales
                                        </Button>
                                    </Grid>
                                </Grid>
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