import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useProtocols from '../../hooks/useProtocols';
import { HomeLayout } from '../../layout';
const ProtocolPage = () => {

    const router = useRouter()

    const {protocols} = useProtocols()

    const [protocolSelected, setProtocolSelected] = useState()

    useEffect(() => {
        if(protocols) {

            const findProtocol = protocols.find((protocol) => protocol.name === router.query.protocol)

            setProtocolSelected( findProtocol )

            console.log(protocolSelected);
        }
    }, [protocols])
   

return (<HomeLayout>   
    <Box>
        <Typography sx={{color:"primary.main" ,fontSize:24}}>Crea tu producto</Typography>
        <TextField label={"Eslere"}></TextField>
    </Box>
</HomeLayout>)
}

export default ProtocolPage;