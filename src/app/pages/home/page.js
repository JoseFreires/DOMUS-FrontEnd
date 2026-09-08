import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function Home(){
    return(
    <div className={`container-fluid ${styles.body}`}>
        <Sidebar/>
        
    </div>
    );
};