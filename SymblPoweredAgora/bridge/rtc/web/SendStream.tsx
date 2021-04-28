import {Symbl} from "./symbl";
import React, {useCallback, useState,createContext} from 'react';
import {UserrIdToUSernameMappring} from '../web/UserrIdToUSername';

import SessionContext from "../../../src/components/SessionContext";
import { v4 as uuidv4 } from 'uuid';
export let cci="";

const getContent = (data) => {

    const punctuated = data.data.punctuated;
    const payload =data.data.payload;
    console.log(JSON.stringify(punctuated));

    if (punctuated && punctuated.transcript) {
        return punctuated.transcript;
    } else if (payload && payload.content) {
        return payload.content;
    } else if (payload && payload.raw && payload.raw.alternatives && payload.raw.alternatives.length > 0) {
        return payload.raw.alternatives[0].transcript || '';
    }
    return undefined;
}
 export const  SymblContext=React.createContext(null);
export const StorageConsumer = SymblContext.Consumer;
let m = new Map;
let symbl;
let interTranscript=``;
let interInsight=``;


export function getInterTranscript(){

    return interTranscript;

   // return interTranscript;

}
export function getInterInsight(){
    return interInsight;

}
export async function SendStream(channelName,optionalUid,optionalInfo) {

    /////

    //const [closedCaptionResponse,setClosedCaptionResponse]=useState({});
    /*const [conversationCompleted, setConversationCompleted]=useState ({});
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [insights, setInsights] = useState([]);
    const [newInsights, setNewInsights] = useState([]);
    const [tracker, setTracker] = useState([]);*/



    /////



       // const res =  await fetch("https://2201b035aeec.ngrok.io/symbl-token");
    const res =  await fetch("http://18.216.209.27:8081/symbl-token");
        const data = await res.json();
        console.log("getting accesstoken"+data.ACCESS_TOKEN);
        ///importing username from vvideoCall.ts
        const userName=  new UserrIdToUSernameMappring().getUserMap(optionalUid);
        const un=document.getElementById("username").innerText;

        let mId=uuidv4();
        const config = {
            attendeeId: userName,
            userName: un,
            meetingId: channelName,
            meeting: channelName
        };
        console.log("Got symbl token", data, config);
        //const tempAccesstoken ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjY2NjY2MDk1Njc0NjU0NzIiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiajRuOWZkYnk3dFE4bGtoZlBpeVJxM21UZ2twR0hrRXBAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjE5MzkzODgwLCJleHAiOjE2MTk0ODAyODAsImF6cCI6Imo0bjlmZGJ5N3RROGxraGZQaXlScTNtVGdrcEdIa0VwIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.VJ8SGx8WZskJ_KoqgzDglPqxDKby94UI48vKlU7V1OdeiCDFx7NFawpw5wSP9sPjdTGoIggwERcpV8o6EMGWKbS9CxogqB1Jb2iQYBhF8RFN8hrzyb39BtAWPDrGAkf7FXs4lxnwrEZbw8qt_qOeYoAVc7s0fiv88d91lCCX4EQMnRAWWo5cRp5BJkOwnc5po5ADcTaoVyxQuICGDp_BRS_aK9D1klRAXEA5czq7pGAEwGk_j-UbfRzMBLhJe-PfsCwIEMeQ-8vmhCc2o3MRi4D6HITzQcPASzYJ2o1nrX1Rq0OK0VZbARn0K3IVM7HFBBDRcVr8uc41XLx1YOIjvQ";
        Symbl.ACCESS_TOKEN = data.accessToken;
        symbl = new Symbl(config);
        const insightHandler = {
            onInsightCreated: (insight) => {
                console.log('Insight created', insight, insight.type);
                // insight.createElement();
                const div = document.createElement("div");
                div.innerHTML = `
                    <div style="background-color: rgba(0,0,0,.5); margin: 15px; padding: 8px; color: rgb(255,255,255);">
                        <div style="font-weight: bold; text-align: center; margin-bottom: 5px;"> ${insight.type} </div>
                        <div style="font-weight: bold; border-bottom: 1px solid white; margin-left: -5px; margin-right: -5px;"> </div>
                        <div style="padding: 10px; "> ${insight.text} </div>
                        <div style="text-align: right; font-weight: 400; font-size: 12px; margin-left: 15px;"> ${new Date().toLocaleString()} </span>
                    </div>
                        `;
                insight.element = div;
                const container = document.getElementById("transcriptContainer");
                insight.add(container);
                console.log("neeraj"+JSON.stringify(insight));
                console.log("neeraj"+JSON.stringify(insight.data.payload.content));
                console.log("neeraj"+JSON.stringify(insight));
                let insight_type="";
                let helping_verb="";
                if(insight.type=="action_item")
                {
                    insight_type= "Action Item"
                    helping_verb="";
                }
                else if(insight.type=="follow_up"){
                    insight_type="Follow up";
                    helping_verb="";
                }
                else if(insight.type=="question"){
                    insight_type="Question ?";
                    helping_verb="asked";
                }
                else
                    insight_type=insight.type;


                interInsight+=`<div style="background-color: rgba(0,0,0,.5); margin: 15px; padding: 8px; color: rgb(255,255,255);">
                        <div style="font-weight: bold; text-align: center; margin-bottom: 5px;"> ${insight_type} </div>
                        <div style="text-align:left; "> ${insight.data.from.name} ${helping_verb} </div>
                        <div style=" "> ${insight.data.payload.content} </div>
                        <div style="text-align: right; font-weight: 400; font-size: 12px; margin-left: 15px;"> ${new Date().toLocaleString()} </div>
                    </div>`;
                console.log(interInsight);
                if(document.getElementById("ST2")){
                document.getElementById("ST2").innerHTML=interInsight;}
            }
        };
        symbl.subscribeToInsightEvents(insightHandler);
        const transcriptHandler = {
            onTranscriptCreated: transcript => {
                console.log('On transcript created', transcript);
                const div = document.createElement("div");
                div.innerHTML = `<div style="background-color: rgba(0,0,0,.5); margin: 15px; padding: 5px; color: rgb(255,255,255);">
                        <div style="font-weight: bold;"> ${transcript.userName}</div>
                        <div style="padding: 10px;"> ${transcript.message} </div>
                        <div style="text-align: right; font-weight: 400; font-size: 12px; margin-left: 15px;"> ${new Date(transcript.timeStamp).toLocaleString()} </div>
                        </div>`;
                const container = document.getElementById(
                    "transcriptContainer"
                );
                interTranscript+=`<div style="background-color: rgba(30, 139, 195, 1); margin: 15px; padding:1px; color: rgb(0,0,0);">
                        <div style="font-weight: bold;padding: 2px; font-size:13px"> ${transcript.userName}</div>
                        <div style="padding: 2px; font-size:13px "> ${transcript.message} </div>
                        <div style="text-align: right; font-weight: 200; font-size: 10px; margin-left: 15px;"> ${new Date(transcript.timeStamp).toLocaleString()} </div>
                        </div>`;
                if(document.getElementById("ST")!=null) {
                    document.getElementById("ST").innerHTML = interTranscript;
                }

                //container.appendChild(div);
            }
        };
        symbl.subscribeToTranscriptEvents(transcriptHandler);

        var _caption = '';
        const captioningHandler = {
            onCaptioningToggled: ccEnabled => {
                // Implement
            },
            onCaptionCreated: (caption) => {
                console.warn("Caption created", caption);
                ////new code added for caption ;
                cci=caption;
                // Retrieve the video element that you wish to add the subtitle tracks to.
                // var activeVideoElement = document.querySelector("video");
                var videoElementContainer = document.getElementsByClassName('main-stream-player')[0];
                if (videoElementContainer) {
                    const activeVideoElement = videoElementContainer.querySelector('video');
                    caption.setVideoElement(activeVideoElement);
                }

            },
            onCaptionUpdated: (caption) => {
                // Check if the video element is set correctly

                var videoElementContainer = document.getElementsByClassName('main-stream-player')[0];
                var check = document.getElementById("test");
                console.log(getContent(caption));
                cci=JSON.stringify(caption);


                //setClosedCaptionResponse(caption);

                document.getElementById("tes").innerText=getContent(caption);

                if (videoElementContainer) {
                    const activeVideoElement = videoElementContainer.querySelector('video');
                    caption.setVideoElement(activeVideoElement);
                }
            }
        };
        symbl.subscribeToCaptioningEvents(captioningHandler);
    console.log("starting symbl");





      console.log( "inside sendStream");
    let sS = await symbl.start();
    console.log("type of sS"+sS.constructor.name);



        /*

        then((val)=>{
            m.set(channelName,val._conversationId);
            console.log("starting symbl");
            console.log("send stream"+val.conversationId());


        });
         */


    if(!m.has(channelName))
    {
    }






    return sS;

}

/*export function sp(text){

    const [closedCaptionResponse,setClosedCaptionResponse]=useState({});
    setClosedCaptionResponse(text);
    return (
        <SymblContext.Provider
            value={{

                closedCaptionResponse


            }}
        >
            {this.props.children}
        </SymblContext.Provider>
    );
}*/


