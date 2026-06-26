import "../style.css"
import {useEffect, useState} from "react";
import {StorageKeys, storageService} from "~contents/services/StorageService";
import Settings from "~popup/component/Settings";
import {FaRegCirclePlay, FaRegCirclePause} from "react-icons/fa6";
import Stats from "~popup/component/Stats";
import {updateService} from "~contents/services/UpdateService";
import UpdateWarning from "~popup/component/UpdateWarning";

export default function IndexPopup() {

    const [active, setActive] = useState(false);
    const version = chrome.runtime.getManifest().version


    const updateActive = () => {
        setActive(!active);
        storageService.set(StorageKeys.ACTIVE,!active)

    }

    useEffect(() => {
        storageService.subscribe<boolean>(StorageKeys.ACTIVE,setActive)
    },[]);

    return (
        <div className="w-64 bg-bg-1 text-color-text font-sans flex flex-col items-center text-xs">
            <header className="bg-bg-2 p-4 m-0 rounded flex flex-col  items-center w-full">
                <img alt="pause button" src="https://www.7speaking.com/wp-content/uploads/2024/07/Logo-7Speaking.webp"
                     width="150px"/>
                <h1 className="text-xl text-center w-full">
                    Bot Rework
                </h1>
            </header>
            {updateService.getUpdateAvailable() && <UpdateWarning/>}
            <button className="w-20 h-20 shadow p-4 rounded-full bg-bg-2 text-primary m-2 " onClick={updateActive}>
                {active ? <FaRegCirclePause className="w-full h-full"/> : <FaRegCirclePlay className="w-full h-full"/>}
            </button>
            <Settings/>
            <Stats/>
            <footer className="bg-bg-2 p-2 mt-1 pb-0 rounded rounded-t-2xl flex flex-col items-center w-full">
                <p>version {version}</p>
                <div className="flex items-center justify-center mb-0">
                    <p className="text-nowrap">made by orkeilius </p>
                    <p className="text-text-2 text-2xl">·</p>
                    <iframe
                        className="inline-block align-middle mb-0"
                        src="https://ghbtns.com/github-btn.html?user=orkeilius&repo=7speaking-bot-rework&type=star&count=true&size=small"
                        width="80" height="20" title="GitHub"></iframe>
                </div>
            </footer>
        </div>
    )
}
