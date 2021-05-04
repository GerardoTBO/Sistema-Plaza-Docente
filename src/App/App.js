import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'

import Portada from './pages/portada'
import InicioProfesor from './pages/profesor/inicio'
import InicioEvaluador from './pages/evaluador/inicio'
import CurriculoEvaluador from './pages/evaluador/curriculo'
import PresentacionEvaluador from './pages/evaluador/presentacion'
import FinalesEvaluador from './pages/evaluador/notasFinales'
import Errore from './pages/error'

function App() {
  return (

    <Router>
      <CssBaseline />
      {/* The rest of the application */}
      <div className="App">
        <Switch>
          <Route path='/' exact component={Portada} />
          <Route path='/profesor-inicio' exact component={InicioProfesor} />
          <Route path='/evaluador-inicio' exact component={InicioEvaluador} />
          <Route path='/evaluador-curriculum' exact component={CurriculoEvaluador} />
          <Route path='/evaluador-presentacion' exact component={PresentacionEvaluador} />
          <Route path='/evaluador-notas-finales' exact component={FinalesEvaluador} />
          <Route exact component={Errore} />
        </Switch>
      </div>
    </Router>

  )
}

export default App
