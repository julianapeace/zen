const importEnv = require('import-env')

const config = importEnv(
    {
        name: 'PORT',
        default: 4444
    },
    {
        name: 'GOOGLE_API_KEY',
        alias: 'GKEY',
        required: true
    },
    {
        name: 'DARK_SKY_API_KEY',
        alias: 'DARKSKYKEY',
        required: true
    }
)


module.exports = config
