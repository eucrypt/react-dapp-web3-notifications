import React, {Fragment, useEffect, useState} from 'react';
import {Box, Button, Stack, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {getFirebaseToken, onNewMessage} from "./firebase";
import ListNotifications from "./ListNotifications";

const subscribeForTransactionalNotification = (address: string, fcmToken: string) => {
    fetch(
        `https://notify.unmarshal.com/v1/firebase/subscribe`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': "YOUR_API_KEY"
            },
            body: JSON.stringify({
                fcm_token: fcmToken,
                device_id: 'YOUR_DEVICE_ID',
                wallet_ids: [address]
            })
        }
    )
        .then(response => response.json())
        .then(result => toast.success("Subscribed successfully!!!"))
        .catch(error => toast.error("Failed to subscribe!"));
}

const subscribe = (address: string) => {
    getFirebaseToken()
        .then((fcmToken: string) => subscribeForTransactionalNotification(address, fcmToken))
        .catch(() => toast.error("Failed to get FCM token"))
}

export interface Notification {
    title: string;
    body: string;
    time: Date;
    transactionHash: string;
}

const Subscribe = () => {
    const [address, updateAddress] = useState("")
    const [notifications, updateNotifications] = useState<Array<Notification>>([])

    useEffect(() => {
        onNewMessage(({notification, data}) => {
            toast(<div>
                <b>{notification?.title}</b>
                <p>{notification?.body}</p>
            </div>);
            updateNotifications((value) => [{
                title: notification?.title,
                body: notification?.body,
                time: new Date(),
                transactionHash: JSON.parse(data.transaction).id
            }, ...value])
        })
    }, [])

    return (
        <Fragment>
            <Box height={40}/>
            <Stack spacing={3}>
                <TextField label={"Enter your wallet address"} onChange={(e) => updateAddress(e.target.value)}/>
                <Button variant={"outlined"} onClick={() => subscribe(address)}>Subscribe</Button>
            </Stack>
            <Box height={40}/>
            <ListNotifications notifications={notifications}/>
        </Fragment>
    );
};

export default Subscribe;

