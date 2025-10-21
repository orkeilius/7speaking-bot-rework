import "../style.css"
import React, {useEffect} from "react";
import {storageService} from "~contents/services/StorageService";
import Settings from "~popup/component/Settings";
import {FaRegCirclePlay, FaRegCirclePause} from "react-icons/fa6";
import Stats from "~popup/component/Stats";

export default function IndexPopup() {

    const [active, setActive] = React.useState(false);


    const updateActive = () => {
        setActive(!active);
        storageService.setActive(!active)

    }

    useEffect(() => {
        async function fetchSettings() {
            setActive(await storageService.getActive());
        }
        fetchSettings();
    }, []);


    return (
        <div className="w-64 bg-bg-1 text-color-text font-sans flex flex-col items-center text-xs">
            <header className="bg-bg-2 p-4 m-0 rounded flex flex-col  items-center w-full">
                <img alt="pause button" src="https://www.7speaking.com/wp-content/uploads/2024/07/Logo-7Speaking.webp" width="150px"/>
                <h1 className="text-xl text-center w-full">
                    Bot Rework
                </h1>
            </header>
            <button className="w-20 h-20 shadow p-4 rounded-full bg-bg-2 text-primary m-4 " onClick={updateActive}>
                {active ? <FaRegCirclePause className="w-full h-full"/> : <FaRegCirclePlay className="w-full h-full"/>}
            </button>
            <Settings/>
            <Stats/>
        </div>
    )
}
