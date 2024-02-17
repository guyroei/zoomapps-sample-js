import zoomSdk from '@zoom/appssdk';
import ZoomVideo from '@zoom/videosdk';

//Create SDK JWT in order to setup chat client that enables sending message to a specific user
const KJUR = require('jsrsasign');
// https://www.npmjs.com/package/jsrsasign

function generateSignature(
    sdkKey,
    sdkSecret,
    sessionName,
    role,
    sessionKey,
    userIdentity
) {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
        app_key: sdkKey,
        tpc: sessionName,
        role_type: role,
        session_key: sessionKey,
        user_identity: userIdentity,
        version: 1,
        iat: iat,
        exp: exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
    return sdkJWT;
}

console.log(
    generateSignature(
        process.env.ZOOM_VIDEO_SDK_KEY,
        process.env.ZOOM_VIDEO_SDK_SECRET,
        'Test',
        1,
        '123',
        'user123'
    )
);
const sdkJWT = generateSignature(
    process.env.ZOOM_VIDEO_SDK_KEY,
    process.env.ZOOM_VIDEO_SDK_SECRET,
    'Test',
    1,
    '123',
    'user123'
);

var client = ZoomVideo.createClient();
await client.init('en-US', 'Global', { patchJsMedia: true });
await client.join(
    'sessionName',
    sdkJWT,
    'userName',
    'sessionPasscode'
)(async () => {
    try {
        const configResponse = await zoomSdk.config({
            size: { width: 480, height: 360 },
            capabilities: [
                /* Add Capabilities Here */
                'shareApp',
            ],
        });

        console.debug('Zoom JS SDK Configuration', configResponse);
    } catch (e) {
        console.error(e);
    }

    try {
        await zoomSdk.launchAppInMeeting();
    } catch (e) {
        console.error(e);
    }

    try {
        const notificationResponse = await zoomSdk.showNotification({
            type: 'info',
            title: 'notification!',
            message: 'HELLO WORLD',
        });
        console.debug('Zoom JS SDK Notification', notificationResponse);
    } catch (e) {
        console.error(e);
    }

    client.on('chat-on-message', (payload) => {
        console.log(payload);
        console.log(
            `Message: ${payload.message}, from ${payload.sender.name} to ${payload.receiver.name}`
        );
    });

    const chat = client.getchatClient();
    chat.send('Hey', participantUUID1);

    /*
    function notifi(message){
        try{
            const notificationResponse = await zoomSdk.showNotification({
                type: 'info',
                title: 'notification!',
                message: message,
            });
            console.debug('Zoom JS SDK Notification', notificationResponse);
        } catch (e) {
            console.error(e);
        }
    }
     */

    let meetingParticipants = await zoomSdk.getMeetingParticipants();
    const participantUUID1 =
        meetingParticipants.participants[0].participantUUID;
    const participantID1 = meetingParticipants.participants[0].participantId;
    try {
        const notificationResponse = await zoomSdk.showNotification({
            type: 'info',
            title: 'notification!',
            message: participantUUID1 + ' : ' + participantID1,
        });
        console.debug('Zoom JS SDK Notification', notificationResponse);
    } catch (e) {
        console.error(e);
    }

    /*
    const meetingDetails = await zoomSdk.getMeetingContext();

    try{
        const notificationResponse = await zoomSdk.showNotification({
            type: 'info',
            title: 'notification!',
            message: meetingDetails,
        });
        console.debug('Zoom JS SDK Notification', notificationResponse);
    } catch (e) {
        console.error(e);
    }




    timeInMintues = 5; //later should be timeInMintues = inputFromHost
    alertTimeInMinutes = 2;
    timeInMiliSeconds = (timeInMintues - alertTimeInMinutes)*60*1000;
    alertTimeInMiliSeconds = alertTimeInMinutes*60*1000;
    function alert_speakers(listOfSpeakers, i, alertTimeInMinutes) {
        //currenSpeakerMessage = "Your time is running out." + alertTime + " minutes left.";
        //nextSpeakerMessage = "Your turn is coming up in " + alertTime + " minutes.";
        //showNotification(listOfSpeakers(i), currenSpeakerMessage);
        //if(i < listOfSpeakers.length){
        //showNotification(listOfSpeakers(i+1), nextSpeakerMessage);
        //}
    }
    function switch_speakers(listOfSpeakers, i, alertTimeInMinutes) {
        //muteUser(listOfSpeakers(i), currenSpeakerMessage);
        //removeFromSpotlight(listOfSpeakers(i), currenSpeakerMessage);
        //if(i < listOfSpeakers.length){
        //unMuteUser(listOfSpeakers(i+1), nextSpeakerMessage);
        //addToSpotlight(listOfSpeakers(i+1), nextSpeakerMessage);
        //}
    }
    for(let i = 0; i < listOfSpeakers.lentgh; i++){
        setTimeout(alert_speakers, timeInMiliSeconds, listOfSpeakers, i, alertTimeInMinutes);
        setTimeout(switch_speakers, alertTimeInMiliSeconds, listOfSpeakers, i, alertTimeInMinutes);
        //setTimeout(switch_speakers, timeInMiliSeconds + alertTimeInMiliSeconds, listOfSpeakers, i, alertTimeInMinutes);
    }
    // try{
    // zoomSdk.toggleParticipantMediaAudio({
    //     "audio": true
    //   });
    // } catch (e) { console.log(e); }
    // try{
    //     zoomSdk.sendAppInvitationToAllParticipants();
    // }
    // catch (e) { console.error(e); }

     */
})();
