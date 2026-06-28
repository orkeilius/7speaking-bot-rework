import type {PlasmoCSConfig, PlasmoGetStyle} from "plasmo";
import styleText from "data-text:~style.css";
import {FaEyeSlash, FaRegCirclePause, FaRegCirclePlay} from "react-icons/fa6";
import {BsFastForwardCircle} from "react-icons/bs";
import {useEffect, useState} from "react";
import {StorageKeys, storageService} from "~contents/services/StorageService";

export const config: PlasmoCSConfig = {
    matches: [
        "https://user.7speaking.com/*",
        "https://prepmyfuture.com/*"
    ],
    all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style")
    style.textContent = styleText
    return style
}


const Overlay = () => {

    const [active, setActive] = useState<boolean>(false);
    const [text, setText] = useState<string>("⏱️ waiting...");
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        const watchers = [
            storageService.subscribe<string>(StorageKeys.LOG, setText),
            storageService.subscribe<boolean>(StorageKeys.ACTIVE, setActive),
            storageService.subscribe<boolean>(StorageKeys.SHOW_OVERLAY, setVisible)
        ];
        return () => watchers.forEach(unsubscribe => unsubscribe())
    }, []);

    const toggleActive = async () => {
        await storageService.set(StorageKeys.ACTIVE, !active);
        setActive(!active);
    }
    const toggleVisible = async () => {
        await storageService.set(StorageKeys.SHOW_OVERLAY, !visible);
        await storageService.set(StorageKeys.ACTIVE, false)
        setVisible(!visible);
    }

    const isTimerActive = active && text.includes("⏱️")
    const skipTimer = async () => {
        await storageService.set(StorageKeys.TIMER_END, 0)
    }

    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed bottom-0 left-0 flex z-[9999] m-2 px-4 py-2 text-2xl border bg-bg-2 rounded-full p-2 items-center shadow shadow-primary">

            <FaEyeSlash className="text-text-2 mr-2 border-2 border-text-2 rounded-full" onClick={toggleVisible}/>
            {active ?
                <FaRegCirclePause className="text-secondary mr-1" alt="pause bot" onClick={toggleActive}/>
                :
                <FaRegCirclePlay className="text-primary mr-1" alt="start bot" onClick={toggleActive}/>
            }
            {isTimerActive &&
                <BsFastForwardCircle className="text-primary mx-1" onClick={skipTimer}/>
            }

            <span className="overlay-text">{text}</span>


        </div>
    )

};

export default Overlay