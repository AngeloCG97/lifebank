import CarouselComponent from '../../components/Carousel'

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Link as LinkRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'

import '@brainhubeu/react-carousel/lib/style.css'

import 'date-fns'

import Schedule from '../../components/Schedule'
import MapShowOneLocation from '../../components/MapShowOneLocation'

const { eosConfig } = require('../../config')


const useStyles = makeStyles((theme) => ({
  rowBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    height: 40,
    padding: theme.spacing(0, 2),
    alignItems: 'center',
    '& p': {
      color: theme.palette.secondary.onSecondaryMediumEmphasizedText,
      textTransform: 'capitalize'
    }
  },
  carouselComponent: {
    justifyContent: 'center',
    justifySelf: 'center'
  },
  divider: {
    width: '100%'
  },
  editBtn: {
    margin: theme.spacing(2, 0)
  },
  secondaryText: {
    color: `${theme.palette.secondary.main} !important`
  },
  carouselDiv: {
    width: '100%',
    objectFit: 'cover'
  },
  img: {
    width: '65px',
    objectFit: 'cover',
    height: '65px',
    borderRadius: '50%',
    marginBottom: '30px'
  },
  divProgressProfile: {
    width: '100%',
    marginBottom: '40px'
  }
}))

const ProfilePageLifebank = ({ profile }) => {
  console.log("profile lifebank:", profile)
  const classes = useStyles()
  let logo = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"
  const arrayImage = ["https://www.fodors.com/wp-content/uploads/2019/03/UltimateCostaRica__HERO_shutterstock_1245999643.jpg", "https://www.guanacastealaaltura.com/media/k2/items/cache/0a7d97071828da65151775fc572477c0_XL.jpg?t=20200524_175218"]

  const [pendingFields, setPendingFields] = useState()

  const checkAvailableFields = () => {
    let pendingFieldsObject = {}

    if (!profile.email)
      pendingFieldsObject = { ...pendingFieldsObject, email: false }

    if (!profile.name)
      pendingFieldsObject = { ...pendingFieldsObject, name: false }

    if (!profile.phone_number)
      pendingFieldsObject = { ...pendingFieldsObject, phone_number: false }

    if (!profile.photos)
      pendingFieldsObject = { ...pendingFieldsObject, photos: false }

    if (!profile.logo)
      pendingFieldsObject = { ...pendingFieldsObject, logo: false }

    if (!profile.schedule)
      pendingFieldsObject = { ...pendingFieldsObject, schedule: false }

    if (!profile.location)
      pendingFieldsObject = { ...pendingFieldsObject, location: false }

    if (!profile.address)
      pendingFieldsObject = { ...pendingFieldsObject, address: false }

    if (!profile.description)
      pendingFieldsObject = { ...pendingFieldsObject, description: false }

    if (!profile.blood_urgency_level)
      pendingFieldsObject = { ...pendingFieldsObject, blood_urgency_level: false }

    if (Object.keys(pendingFieldsObject).length > 0)
      setPendingFields(pendingFieldsObject)
  }

  useEffect(() => {
    if (profile) {
      //if (profile.photos) profile.photos = JSON.parse(profile.photos)
      //if (profile.telephones)
      //profile.telephones = JSON.parse(profile.telephones)
      checkAvailableFields()
    }
  }, [profile])

  return (
    <>
      <div className={classes.divProgressProfile}>
        {pendingFields && (
          <Grid style={{ maxWidth: 500, margin: 'auto' }} item>
            <Alert
              action={
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <LinkRouter
                    style={{ textDecoration: 'none' }}
                    to={{
                      pathname: '/edit-profile',
                      state: { isCompleting: true }
                    }}
                  >
                    <Button
                      color="secondary"
                      className={classes.noCapitalize}
                      classes={{
                        root: classes.editBtn
                      }}
                    >
                      Update
                    </Button>
                  </LinkRouter>
                </Box>
              }
              className={classes.alert}
              severity="info"
            >
              <Typography>Your profile is not complete </Typography>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress
                    variant="determinate"
                    color="secondary"
                    className={classes.customizedLinearProgress}
                    value={
                      ((10 - Object.keys(pendingFields).length) * 100) / 10
                    }
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >{`${Math.round(
                    ((10 - Object.keys(pendingFields).length) * 100) / 10
                  )}%`}</Typography>
                </Box>
              </Box>
            </Alert>
          </Grid>
        )}
      </div>
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Logo</Typography>
        <img className={classes.img} src={logo} alt={'logo image'} />
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">URL site</Typography>
        {console.log("profile 2:", profile)}
        <a variant="body1" href={'https://lifebank.io/info/' + profile.role}> {'https://lifebank.io/info/' + profile.role}</a>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Account</Typography>
        <Typography variant="body1">
          <Link
            href={`${eosConfig.BLOCK_EXPLORER_URL}account/${profile.account}`}
            target="_blank"
            rel="noopener"
            color="secondary"
          >
            {profile.account}
          </Link>
        </Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        {console.log("profile 3:", profile)}
        <Typography variant="subtitle1">Organization</Typography>
        <Typography variant="body1">{profile.name}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Role</Typography>
        <Typography variant="body1">{profile.role}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Email</Typography>
        <Typography variant="body1">{profile.email}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Address</Typography>
        <Typography variant="body1">{profile.address}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        {console.log("profile 4:", profile)}
        <Typography variant="subtitle1">Telephone</Typography>
        <Typography variant="body1">{profile.phone_number}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Consent</Typography>
        <Typography variant="body1">{`${profile.consent}`}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Community Assets</Typography>
        <Typography variant="body1" className={classes.secondaryText}>
          {profile.community_asset}
        </Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Has Immunity Test</Typography>
        <Typography variant="body1">{`${Boolean(
          profile.has_inmmunity_test
        )}`}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        <Typography variant="subtitle1">Blood Urgency Level</Typography>
        <Typography variant="body1" className={classes.secondaryText}>
          {profile.blood_urgency_level}
        </Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.rowBox}>
        {console.log("profile 5:", profile.schedule)}
        <Typography variant="subtitle1">Schedule</Typography>
        <Typography variant="body1" />
      </Box>
      <Schedule
        data={JSON.parse(profile.schedule)}
        showSchedule
        showButton={false}
      />
      <Box className={classes.rowBox}>
        {console.log("profile 6:", profile)}
        <Typography variant="subtitle1">Benefit Description</Typography>
        <Typography variant="body1" />
      </Box>
      <TextField
        id="benefitDescription"
        variant="outlined"
        disabled
        defaultValue={profile.description}
        InputLabelProps={{
          shrink: true
        }}
        multiline
        fullWidth
        rows={3}
      />
      <Box className={classes.rowBox}>
        {console.log("profile 7:", profile)}
        <Typography variant="subtitle1">Images</Typography>
        <Typography variant="body1" />
      </Box>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        className={classes.carouselComponent}
      >
        <CarouselComponent images={arrayImage} />
      </Grid>
      <Box className={classes.rowBox}>
        {console.log("profile 8:", profile)}
        <Typography variant="subtitle1">Location</Typography>
        <Typography variant="body1" />
      </Box>
      <MapShowOneLocation
        markerLocation={JSON.parse(profile.location)}
        accountProp={profile.account}
        width="100%"
        height={400}
        py={2}
      />
      <Divider className={classes.divider} />
      <LinkRouter to={{ pathname: '/edit-profile', state: { isCompleting: false } }} className={classes.editBtn}>
        <Button variant="contained" color="primary">
          Edit
        </Button>
      </LinkRouter>
    </>
  )
}

ProfilePageLifebank.propTypes = {
  profile: PropTypes.object
}

export default ProfilePageLifebank
