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

