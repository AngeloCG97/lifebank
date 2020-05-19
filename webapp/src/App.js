import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import routes from './routes'

const App = ({ ual }) => (
  <BrowserRouter>
    <Switch>
      {routes.map(({ path, component: Component, ...args }) => (
        <Route key={`path-${path}`} path={path} {...args}>
          <Component ual={ual} />
        </Route>
      ))}
      <Redirect to="/not-found" />
    </Switch>
  </BrowserRouter>
)

App.propTypes = {
  ual: PropTypes.object
}

export default App
