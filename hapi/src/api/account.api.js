const {
  eosUtils,
  jwtUtils,
  consent2lifeUtils,
  lifebankcodeUtils,
  lifebankcoinUtils
} = require('../utils')

const historyApi = require('./history.api')
const userApi = require('./user.api')
const vaultApi = require('./vault.api')
const LIFEBANCKCODE_CONTRACT = 'lifebankcode' // @todo: use ENV

const create = async ({ role, username, secret }) => {
  const account = `${role.substring(0, 3)}${username}`.substring(0, 12)
  const { password, transaction } = await eosUtils.createAccount(account)
  const token = jwtUtils.create({ role, username, account })

  await userApi.insert({
    role,
    username,
    account,
    secret
  })
  await vaultApi.insert({
    account,
    password
  })
  await historyApi.insert(transaction)

  return {
    account,
    token,
    transaction_id: transaction.transaction_id
  }
}

const getProfile = async account => {
  const user = await userApi.getOne({
    account: { _eq: account }
  })

  let data = {}

  switch (user.role) {
    case 'donor':
      data = await getDonorData(account)
      break
    case 'lifebank':
      data = await getLifebankData(account)
      break
    case 'sponsor':
      data = await getSponsorData(account)
      break
    default:
      break
  }

  return {
    account,
    role: user.role,
    ...data
  }
}

const getDonorData = async account => {
  const { tx } = (await lifebankcodeUtils.getDonor(account)) || {}
  const { donor_name: name } = await getTransactionData(tx)
  const networks = await lifebankcodeUtils.getUserNetworks(account)
  const comunities = []

  for (let index = 0; index < networks.length; index++) {
    const comunity = await lifebankcodeUtils.getComunity(
      networks[index].community
    )
    comunities.push(comunity.community_name)
  }

  const consent = await consent2lifeUtils.getConsent(
    LIFEBANCKCODE_CONTRACT,
    account
  )
  const balance = await lifebankcoinUtils.getbalance(account)

  return {
    name,
    comunities,
    balance,
    consent: !!consent
  }
}

const getLifebankData = async account => {
  const { tx } = (await lifebankcodeUtils.getLifebank(account)) || {}
  const { lifebank_name: name, ...profile } = await getTransactionData(tx)
  const consent = await consent2lifeUtils.getConsent(
    LIFEBANCKCODE_CONTRACT,
    account
  )

  return {
    ...profile,
    name,
    consent: !!consent
  }
}

const getSponsorData = async account => {
  const { tx } = (await lifebankcodeUtils.getSponsor(account)) || {}
  const { sponsor_name: name, ...profile } = await getTransactionData(tx)
  const networks = await lifebankcodeUtils.getUserNetworks(account)
  const comunities = []

  for (let index = 0; index < networks.length; index++) {
    const comunity = await lifebankcodeUtils.getComunity(
      networks[index].community
    )
    comunities.push(comunity.community_name)
  }

  const consent = await consent2lifeUtils.getConsent(
    LIFEBANCKCODE_CONTRACT,
    account
  )
  const balance = await lifebankcoinUtils.getbalance(account)

  return {
    ...profile,
    comunities,
    balance,
    name,
    consent: !!consent
  }
}

const getTransactionData = async tx => {
  const {
    processed: { action_traces: actionTraces = [] } = {}
  } = await historyApi.getOne({
    transaction_id: { _eq: tx }
  })

  return actionTraces.reduce(
    (result, item) => ({ ...result, ...item.act.data }),
    {}
  )
}

const grantConsent = async account => {
  const password = await vaultApi.getPassword(account)
  const consentTransaction = await consent2lifeUtils.consent(
    LIFEBANCKCODE_CONTRACT,
    account,
    password
  )

  await historyApi.insert(consentTransaction)
}

const login = async ({ account, secret }) => {
  const user = await userApi.getOne({
    _and: [
      {
        _or: [
          { account: { _eq: account } },
          { username: { _eq: account } },
          { email: { _eq: account } }
        ]
      },
      { secret: { _eq: secret } }
    ]
  })

  if (!user) {
    throw new Error('Invalid account or secret')
  }

  const token = jwtUtils.create({
    account: user.account,
    role: user.role,
    username: user.username
  })

  return {
    token
  }
}

const revokeConsent = async account => {
  const password = await vaultApi.getPassword(account)
  const consentTransaction = await consent2lifeUtils.revoke(
    LIFEBANCKCODE_CONTRACT,
    account,
    password
  )

  await historyApi.insert(consentTransaction)
}

module.exports = {
  create,
  getProfile,
  login,
  grantConsent,
  revokeConsent
}