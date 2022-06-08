# Integrate web3 notifications using unmarshal push notifications.

### Create a react app
```sh
npx create-react-app unmarshal-notifications --template typescript && cd unmarshal-notifications
```

### Install required packages
```
yarn add firebase
yarn add react-toastify
yarn add @mui/material @emotion/react @emotion/styled
```

To create a firebase project click here https://console.firebase.google.com

#### Create a file `firebase.ts`
```typescript
import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage} from "firebase/messaging";

const firebaseConfig = {
 // Firebase config
};

const vapidKey = 'FIREBASE_VAPID_KEY';

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getFirebaseToken = () => {
    return getToken(messaging, {vapidKey});
}

export const onNewMessage = (callBack: (payload: any) => void) => {
    onMessage(messaging, callBack)
};

```

#### Create a file `Subscribe.tsx`
```typescript
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

```


#### Create a file `ListNotifications.tsx`
```typescript
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import React from "react";
import {Notification} from "./Subscribe";

export  default function ListNotifications({notifications}: {notifications: Array<Notification>}) {
    return <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Transaction Hash</TableCell>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Body</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {notifications.map((notification, index) => (
                    <TableRow
                        key={notification.title + index}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell align="center">{notification.time.toLocaleTimeString()}</TableCell>
                        <TableCell align="center">{notification.transactionHash}</TableCell>
                        <TableCell align="center">{notification.title}</TableCell>
                        <TableCell align="center">{notification.body}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>;
}
```

#### Update `App.ts`  as below

```typescript
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Subscribe from "./notifications/Subscribe";
import {Container} from "@mui/material";
import {ToastContainer} from "react-toastify";

function App() {
  return (
    <Container >
        <ToastContainer />
        <Subscribe/>
    </Container>
  );
}

export default App;
```

### Create a file `firebase-messaging-sw.js` in a public folder

```javascript
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig ={
    // Firebase config
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
```