import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { db, storage } from '../../../firebase'
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
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Register(props) {
    const classes = useStyles()
    const [hayVacantes, setHayVacantes] = useState(true)
    const [revisarNotas, setRevisarNotas] = useState(false)

    const [finalDocentes, setFinalDocentes] = useState({})

    const { handleCloseProfesor, handleOpenSignIn } = props
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [miCurso, setMiCurso] = useState('')
    const [file, setFile] = useState('')

    const [uploadValue, setUpValue] = useState(0)
    const [lleno, setLleno] = useState(false)
    const [load, setLoad] = useState(false)
    const [habilitarBoton, setHabilitarBoton] = useState(true)
    const [change, setChange] = useState(false)
    const [checkNotas, setCheckNotas] = useState(false)
    const [botonCheck, setBotonCheck] = useState(true)

    const [cursos, setCursos] = useState([])
    const [ttoo, setTtoo] = useState(false)

    const handleCloseModalRegister = () => {
        handleCloseProfesor()
    }

    const handleEmail = (e) => {
        localS.set('emailSystem', e.target.value)
        setEmail(e.target.value)
    }
    const handleName = (e) => {
        localS.set('nameSystem', e.target.value)
        setName(e.target.value)
    }
    const handleLastName = (e) => {
        localS.set('lastNameSystem', e.target.value)
        setLastName(e.target.value)
    }

    const createDocente = async () => {
        const jsonValues = {
            Nombre: name,
            Apellidos: lastName,
            Email: email,
            Curso: miCurso,
            Curriculo: file
        }
        await db.collection(`docentes`).doc().set(jsonValues)

        // Recolectar id del profesor que se acaba de registrar
        await db.collection(`docentes`).where('Nombre', '==', name).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    localS.set('idProfesor', doc.id)
                    //console.log(doc.id, " => ", doc.data()) // Data del profesor que se acaba de registrar
                })
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            })
        idonk()
        pushDocentePostulacion()
    }

    const pushDocentePostulacion = async () => {
        // Subir un docente a postulacion
        const jsonValues = {
            Docente: localS.get('idProfesor'),
            nota1: 0,
            nota2: 0,
            notaEj: 0,
            notaPj: 0,
            notaFinal: 0
        }
        await db.collection(`postulacion`).doc().set(jsonValues)
    }

    const idonk = () => {
        setTtoo(true)
    }

    const handleRegister = (e) => {
        e.preventDefault()
        if (name === '' || lastName === '' || email === '' || miCurso === '') {
            console.log('No se subio')
        } else {
            createDocente()
        }
    }

    const hayVacantesAun = async () => {
        localS.set('contPostulaciones', 0)
        await db.collection(`postulacion`).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    localS.set('contPostulaciones', (localS.get('contPostulaciones') + 1))
                })
            }).then(() => {
                if (localS.get('contPostulaciones') > 9) {
                    setHayVacantes(false)
                }
            })
    }

    const terminoNotas = async () => {
        const docs = []
        await db.collection(`notas_finales`).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //console.log(doc.data())
                    docs.push(doc.data())
                })
            }).then(() => {
                setFinalDocentes(docs)
                if (docs.length === 2) {
                    setRevisarNotas(true)
                }
            })
    }

    useEffect(() => {
        if (!checkNotas) {
            terminoNotas()
        }
        else if (!change) {
            hayVacantesAun()
        }
        setCheckNotas(true)
        setChange(true)
        if (handleOpenSignIn) {
            const getData = () => {
                db.collection('cursos').onSnapshot((query) => {
                    const docs = []
                    query.forEach(element => {
                        docs.push({ ...element.data(), id: element.id })
                    })
                    setCursos(docs)
                    setLoad(true)
                })
            }
            getData()
        }
        if (name !== '' && lastName !== '' && email !== '') {
            setLleno(true)
        }
    }, [handleOpenSignIn, name, lastName, email, miCurso, change])

    if (ttoo) {
        return <Redirect to='/profesor-inicio' />
    }

    const onChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = storage.ref()
        const fileRef = storageRef.child(file.name)
        setUpValue(10)
        await fileRef.put(file)
            .then(() => {
                setUpValue(100)
                setHabilitarBoton(false)
            })
        setFile(await fileRef.getDownloadURL())
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
                    {revisarNotas ?
                        <List component="nav" className={classes.lista} aria-label="contacts">
                            {finalDocentes.map((value) => (
                                <ListItem
                                    key={`${value.idPro}`}
                                    className={`fixPadding`}>
                                    <ListItemText inset primary={`${value.Docente}, Nota: ${value.Nota}`} />
                                </ListItem>
                            ))}
                        </List>
                        :
                        <div>
                            {hayVacantes ?
                                <div>
                                    <Typography component="h2" variant="h5">
                                        Regístrate
                                    </Typography>
                                    <form onSubmit={handleRegister} className={classes.form} noValidate={false}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onChange={handleName}
                                                    required
                                                    fullWidth
                                                    name="nombre"
                                                    label="Nombre"
                                                    id="nombre"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onChange={handleLastName}
                                                    required
                                                    fullWidth
                                                    name="apellido"
                                                    label="Apellidos"
                                                    id="apellido"
                                                />
                                            </Grid>
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
                                            <Grid>
                                                <h4>Curso:</h4>
                                                {load ? <Cursos setMiCurso={setMiCurso} cursos={cursos} />
                                                    : <div><CircularProgress className={'noActionsColor'} /></div>}
                                            </Grid>
                                            <Grid>
                                                {lleno ? <div>
                                                    <h4>Curriculum:</h4>
                                                    <progress value={uploadValue} max='100'></progress>
                                                    <input type="file" onChange={onChange} /></div>
                                                    :
                                                    <div></div>}

                                            </Grid>
                                        </Grid>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={habilitarBoton}
                                            onClick={() => setBotonCheck(false)}
                                            className={`${classes.submit} dontMove modifyButton1`}
                                        >
                                            {botonCheck ? <div>Registrate</div> :
                                                <CircularProgress className={'marginTop-2p noActionsColor'} />}
                                        </Button>
                                    </form>
                                </div>
                                : <div>Sin Vacantes</div>}
                        </div>
                    }
                </Container>
            </Fade>
        </Modal>
    )
}

function Cursos(props) {
    const { cursos, setMiCurso } = props
    const [open, setOpen] = useState(false)
    const anchorRef = React.useRef(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleClick = () => {
        console.info(`You clicked ${cursos.Nombre[selectedIndex]}`);
    }

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index)
        setMiCurso(cursos[index].Nombre)
        localS.set('cursos', cursos[index].Nombre)
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    useEffect(() => {

    }, [cursos])

    return (
        <Grid container direction="row" alignItems="center">
            <Grid item xs={12}>
                <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                    <Button onClick={handleClick}>{cursos[selectedIndex].Nombre}</Button>
                    <Button
                        color="primary"
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </ButtonGroup>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {cursos.map((value, index) => (
                                            <MenuItem
                                                key={value}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {value.Nombre}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
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
    lista: {
        width: '100%',
        maxWidth: 600,
        color: 'black',
        backgroundColor: theme.palette.background.paper,
    },
}))