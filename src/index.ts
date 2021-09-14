/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import {bootstrapExtra} from '@workadventure/scripting-api-extra'

console.log('Script started successfully');

async function extendedFeatures() {
    try {
        await bootstrapExtra()
        console.log('Scripting API Extra loaded successfully');

        // Place the countdown GIF inside of the cinema screen
        const countdown = await WA.room.website.get('cinemaScreen');
        countdown.x = 1670;
        countdown.y = 802;
        countdown.width = 320;
        countdown.height = 240;
    } catch (error) {
        console.error('Scripting API Extra ERROR',error);
    }
}
extendedFeatures();

// Manage the scrolling effect on the public monitor in the office
WA.room.onEnterZone('scrollMonitor', () => {
    WA.room.hideLayer('inactiveMonitor')
});
WA.room.onLeaveZone('scrollMonitor', () => {
    WA.room.showLayer('inactiveMonitor')
});

// Manage the door code tip
WA.room.onEnterZone('toRoom3', () => {
    WA.room.hideLayer('doorTipSwitch')
});
WA.room.onLeaveZone('toRoom3', () => {
    WA.room.showLayer('doorTipSwitch')
});

// Manage the "need help" and "follow us" popups
let currentZone: string;
let currentPopup: any;

const config = [
    {
        zone: 'needHelp',
        message: 'Do you need some guidance? We are happy to help you out.',
        cta: [
            {
                label: 'Meet us',
                className: 'primary',
                callback: () => WA.nav.openTab('https://play.workadventu.re/@/tcm/workadventure/welcome#meet-us'),
            }
        ]
    },
    {
        zone: 'followUs',
        message: 'Hey! Have you already started following us?',
        cta: [
            {
                label: 'LinkedIn',
                className: 'primary',
                callback: () => WA.nav.openTab('https://www.linkedin.com/company/workadventu-re'),
            },
            {
                label: 'Twitter',
                className: 'primary',
                callback: () => WA.nav.openTab('https://twitter.com/workadventure_'),
            }
        ]
    },
    {
        zone: 'doorCode',
        message: 'Hello, I\'m Mr Robot. The code is 5300.',
        cta: []
    },
    {
        zone: 'toRoom3',
        message: 'Want to access the gaming room? Mr Robot can help you!',
        cta: []
    },
]

WA.room.onEnterZone('needHelp', () => {
    openPopup('needHelp')
});
WA.room.onLeaveZone('needHelp', closePopup);

WA.room.onEnterZone('followUs', () => {
    openPopup('followUs')
});
WA.room.onLeaveZone('followUs', closePopup);

// Manage the popups to open the Room3 door
WA.room.onEnterZone('doorCode', () => {
    openPopup('doorCode')
});
WA.room.onLeaveZone('doorCode', closePopup);

WA.room.onEnterZone('toRoom3', () => {
    const isDoorOpen = WA.state.loadVariable('room3Door')
    if (isDoorOpen) return;

    openPopup('toRoom3')
});
WA.room.onLeaveZone('toRoom3', closePopup);

// Popup management functions
function openPopup(zoneName: string) {
    currentZone = zoneName
    const popupName = zoneName + 'Popup'
    const zone = config.find((item) => {
        return item.zone == zoneName
    });

    if (typeof zone !== 'undefined') {
        // @ts-ignore otherwise we can't use zone.cta object
        currentPopup = WA.ui.openPopup(popupName, zone.message, zone.cta)
    }
}
function closePopup(){
    if (typeof currentPopup !== 'undefined') {
        currentPopup.close();
        currentPopup = undefined;
    }
}