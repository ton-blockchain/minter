import { Link, Typography } from '@mui/material'
import React from 'react'

function Description() {
  return (
    <Typography variant="body2" gutterBottom>
    Jetton is the fungible{" "}
    <Link href="https://github.com/ton-blockchain/TIPs/issues/74">
      token standard
    </Link>{" "}
    for <Link href="https://ton.org">TON blockchain</Link>. This
    educational tool allows you to deploy your own Jetton to mainnet in
    one click. You will need at least 0.25 TON for deployment fees. Never
    deploy code that you've never seen before! This deployer is fully open
    source with all smart contract code{" "}
    <Link href="https://github.com/ton-defi-org/jetton-deployer-contracts">
      available here
    </Link>
    . The HTML form is also{" "}
    <Link href="https://github.com/ton-defi-org/jetton-deployer-webclient">
      open source
    </Link>{" "}
    and served from{" "}
    <Link href="https://ton-defi-org.github.io/jetton-deployer-webclient">
      GitHub Pages
    </Link>
    . Is this deployer safe? Yes! read{" "}
    <Link href="https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users">
      this
    </Link>{" "}
    to understand why.
  </Typography>
  )
}

export default Description