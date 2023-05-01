require("firebase-functions/logger/compat");
const functions = require("firebase-functions");
const client = require("@mailchimp/mailchimp_marketing");
const admin = require('firebase-admin');
admin.initializeApp();

exports.insertUser2mailChimp = functions.firestore.document('/MobileUsers/{documentId}')
    .onCreate((snap, context) => {
        const original = snap.data();
        const email = original.mail;
        const username = original.name;
        const who = original.who;
        const gender = original.gender;

        const API_KEY = ''; //mailchimp
        const AUDIENCE_ID = ''; //mailchimp

        const bday = original.birthday;
        const arybday = bday.split("-");
        const bday2 = arybday[2]+"-"+arybday[1]+"-"+arybday[0]+"T00:00:00.001Z"

        client.setConfig({
            apiKey: API_KEY,
            server: "us11",
        });

        const run = async () => {
            const response = await client.lists.addListMember(AUDIENCE_ID, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: username,
                    WHO: who,
                    GENDER: gender,
                    BDATE: bday2
                }
            });
        };

        run();
        return null
    });
