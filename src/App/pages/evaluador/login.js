import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { auth } from '../../../firebase'
import localS from 'local-storage'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Login(props) {
    const classes = useStyles()
    const { handleCloseEvaluador, handleOpenSignIn } = props
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [botonCheck, setBotonCheck] = useState(true)
    const [ttoo, setTtoo] = useState(false)

    const signinUser = (email, password) => {
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log("Logeado")
                localS.set('logeado', true)
                idonk()
            })
            .catch((error) => {
                console.log("Error")
                localS.set('logeado', false)
            })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        signinUser(email, password)
    }

    const idonk = () => {
        setTtoo(true)
    }

    const handleCloseModalRegister = () => {
        handleCloseEvaluador()
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    if (ttoo) {
        return <Redirect to='/evaluador-inicio' />
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            onClose={handleCloseModalRegister}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            open={handleOpenSignIn} >
            <Fade in={handleOpenSignIn}>
                <Container className={classes.paper} component="main" maxWidth="xs">
                    <Toolbar to="/">
                        <img src="/assets/images/logo.png" alt="logo" className={classes.logo} />
                    </Toolbar>
                    <div>
                        <Typography component="h2" variant="h5">
                            Ingresa
                            </Typography>
                        <form onSubmit={handleLogin} className={classes.form} noValidate={false}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleEmail}
                                        required
                                        fullWidth
                                        id="email"
                                        type="email"
                                        label="Correo Electronico"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handlePassword}
                                        required
                                        fullWidth
                                        name="password"
                                        label="Contraseña"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={() => setBotonCheck(false)}
                                className={`${classes.submit} dontMove modifyButton1`}
                            >
                                {botonCheck ? <div>Registrate</div> :
                                    <CircularProgress className={'marginTop-2p noActionsColor'} />}
                            </Button>
                        </form>
                    </div>
                </Container>
            </Fade>
        </Modal>
    )
}

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        outline: 'none', /* quitar borde de modal */
        borderRadius: '5px',
        backgroundColor: '#242943',
        padding: theme.spacing(2, 4, 3),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    logo: {
        maxWidth: 100,
    },
    title: {
        padding: 0,
        flexGrow: 1,
        marginTop: 10,
        justifyContent: 'center',
    },
}))