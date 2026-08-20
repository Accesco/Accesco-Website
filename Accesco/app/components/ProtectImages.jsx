"use client"
import { useEffect } from "react"

function ProtectImages(){
    useEffect(()=>{
     const block=(e)=>{
        if(e.target.closest('img')) e.preventDefault();
     }
     
    document.addEventListener('contextmenu',block);

    return()=>document.removeEventListener('contextmenu',block);
    },[])

    return null;

}

export default ProtectImages