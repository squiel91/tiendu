const dotenv = require('dotenv')
dotenv.config()

const result = dotenv.config()
if (result.error) {
  throw result.error
}
const { parsed: envs } = result

envs.raw = process.env.NODE_ENV?.toLowerCase()
envs.isDev = !['stagging', 'production'].includes(envs.raw)
envs.isStag = envs.raw === 'stagging'
envs.isProd = envs.raw === 'production'
envs.port = envs.PORT || 3000

module.exports = envs
