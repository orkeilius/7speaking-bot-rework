import "../style.css"
import React from "react";
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

    async function fetchSettings() {
        setActive(await storageService.getActive());
    }

    setInterval(() => {
        fetchSettings();
    }, 1000);
    fetchSettings()


    return (
        <div className="w-64 bg-bg-1 text-color-text font-sans flex flex-col items-center text-xs">
            <header className="bg-bg-2 p-4 m-0 rounded flex flex-col  items-center w-full">
                <img alt="pause button" src="https://www.7speaking.com/wp-content/uploads/2024/07/Logo-7Speaking.webp"
                     width="150px"/>
                <h1 className="text-xl text-center w-full">
                    Bot Rework
                </h1>
            </header>
            <button className="w-20 h-20 shadow p-4 rounded-full bg-bg-2 text-primary m-4 " onClick={updateActive}>
                {active ? <FaRegCirclePause className="w-full h-full"/> : <FaRegCirclePlay className="w-full h-full"/>}
            </button>
            <Settings/>
            <Stats/>
            <footer className="bg-bg-2 p-2 m-0 rounded flex  w-full rounded-t-2xl  items-center justify-center gap-1">
                <p className="text-nowrap">made by orkeilius </p>
                <p className="text-text-2 text-2xl">·</p>
                <iframe
                    className="inline-block align-middle"
                    src="https://ghbtns.com/github-btn.html?user=orkeilius&repo=7speaking-bot-rework&type=star&count=true&size=small"
                    width="80" height="20" title="GitHub"></iframe>

            </footer>
        </div>
    )
}
