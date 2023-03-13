module.exports = {
  apps: [{
    name: 'mint_nft',
    script: './src/bin/www.js',
    instances: 0,
    exec_mode: "cluster"
}]
}
