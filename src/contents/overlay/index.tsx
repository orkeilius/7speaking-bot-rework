import type {PlasmoCSConfig, PlasmoGetStyle} from "plasmo";
import styleText from "data-text:./style.css"
import {FaRegCirclePlay, FaRegCirclePause} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {storageService} from "~contents/services/StorageService";

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
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

    const updateValue = async () => {
        setText(await storageService.getLog())
        setActive(await storageService.getActive())
    };

    useEffect(() => {
        updateValue();
        const i = setInterval(updateValue, 100);
        return () => {
            clearInterval(i)
        };
    });

    const toggleActive = async () => {
        await storageService.setActive(!active);
        setActive(!active);
    }

    return (
        <div className="overlay">
            {active ?
                <FaRegCirclePause className="icon pause" onClick={toggleActive}/>
             :
                <FaRegCirclePlay className="icon play" onClick={toggleActive}/>
            }
            <span className="overlay-text">{text}</span>


        </div>
    )

};

export default Overlay