import { getSocket } from "./socket";

export const updateProfile = (payload: any, off: boolean = false)=>{
    const socket = getSocket();
    if(!socket){
        console.log("Socket is not connected");
        return;
    }
    if(off){
        //turn off listining to this event
        socket.off("updateProfile", payload);//payload is the callback
    }else if(typeof payload=='function'){
        socket.on("updateProfile", payload);//payload as callback for this event
    }else{
        socket.emit("updateProfile", payload); //sending payload as data
    }
}