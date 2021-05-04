import React, { useState, useEffect } from 'react'
import emailjs from 'emailjs-com'
import { db } from '../../../firebase'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

emailjs.init("user_saRcOpFZByVXDJ5Aoarbs")

export default function SendEmail(props) {
    const classes = useStyles()
    const { handleCloseModalTeacher, handleOpenSignIn, nombre, email, profeId, loading } = props
    const [notaCheck, setNotaCheck] = useState(false)
    const [notaFinal2, setNotaFinal] = useState(0)
    const [statE, setState] = useState('')

    const activateNota = async () => {
        if (notaFinal2 === 100) {
            setState('Plaza Aprobada')
        } else if (notaFinal2 >= 50) {
            setState('En consideracion')
        } else {
            setState('Sin Plaza')
        }
        setNotaCheck(true)
        await db.collection('notas_finales').where('idPro', '==', profeId).get()
            .then((querySnapshot) => {
                const docs = []
                querySnapshot.forEach((element) => {
                    // doc.data() is never undefined for query doc snapshots
                    docs.push({ ...element.data(), id: element.id })
                })
                
                db.collection('notas_finales').doc(docs[0].id).update({
                    Docente: nombre,
                    Email: email,
                    idPro: profeId,
                    Nota: notaFinal2
                })
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            })
    }

    useEffect(() => {
        setNotaCheck(loading)
        if (handleOpenSignIn) {
            db.collection('postulacion').where('Docente', '==', profeId).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        const silab = doc.data()
                        setNotaFinal(silab.notaFinal)
                    })
                })
        }
    }, [notaFinal2, profeId, handleOpenSignIn, loading])

    const handleCloseModalRegister = () => {
        handleCloseModalTeacher()
    }

    function sendEmail(e) {
        e.preventDefault()
        emailjs.sendForm('service_x3tqj8h', 'template_armzaca', e.target, 'user_saRcOpFZByVXDJ5Aoarbs')
            .then((result) => {
                console.log(result.text)
            }, (error) => {
                console.log(error.text, 'ERROR')
            })
        e.target.reset()
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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={activateNota}
                            className={`${classes.submit} modifyButton7`}
                        >
                            Nota Final
                        </Button>
                        <Typography component="h4" variant="h5">
                            {notaCheck ? <div>{notaFinal2} {statE}</div>
                                :
                                <Grid className={`moveCenter sizeGrid`} style={{ alignItems: 'center' }} item xs={12} sm container>
                                    <CircularProgress className={'noActionsColor'} />
                                </Grid>}
                        </Typography>
                        <form className="contact-form" onSubmit={sendEmail}>
                            <input type="hidden" name="contact_number" />
                            <label>Name</label>
                            <input type="text" value={nombre} name={`to_name`} />
                            <label>Email</label>
                            <input type="email" value={email} name={`reply_to`} />
                            <label>Message</label>
                            <textarea name="message" />
                            <input type="submit" value="Send" />
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