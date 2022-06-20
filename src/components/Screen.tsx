import { Box, Fade, styled } from '@mui/material'
import React, { ReactNode } from 'react'

interface Props{
    children: ReactNode;
    id?: string;
}

const StyledScreen = styled(Box)({
    paddingTop: 130
})

function Screen({children, id = ''}: Props) {
  return (
    <Fade in>
        <StyledScreen id={id}>
        {children}
    </StyledScreen>
    </Fade>
  )
}

export default Screen