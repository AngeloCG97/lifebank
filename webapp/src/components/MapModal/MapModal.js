import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import RoomIcon from '@material-ui/icons/Room';

import MapShowLocations from '../MapShowLocations'

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 5,
    right: 1,
    margin: '0',
    height: "5vh",
    '& svg': {
      fontSize: 25,
      color: theme.palette.secondary.main
    }
  },
  title: {
    height: "50px"
  },
  map: {
    height: "50vh",
    width: "50vw",
    [theme.breakpoints.down('sm')]: {
      height: "calc(100vh - 50px)",
      width: "100vw",
    }
  },
  marker: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    '& svg': {
      width: 30
    },
    '& p': {
      fontSize: 12,
      color: theme.palette.primary.mediumEmphasizedBlackText,
      lineHeight: 1.33,
      letterSpacing: '0.4px'
    }
  },
  iconBottomAppBar: {
    color: "#121212"
  },
}))

const MapModal = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [maxWidth] = React.useState('md');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <RoomIcon className={classes.iconBottomAppBar} />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        className={classes.dialog}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <Box className={classes.closeIcon}>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <DialogTitle id="responsive-dialog-title" className={classes.title}>Find Lifebanks or Sponsors Near You</DialogTitle>
        <MapShowLocations className={classes.map} />
      </Dialog>
    </>
  )
}

MapModal.propTypes = {
}

MapModal.defaultProps = {
  useButton: false
}

export default MapModal
