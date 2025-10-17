import type {PlasmoCSConfig, PlasmoGetStyle} from "plasmo";
import styleText from "data-text:./style.css"
import { FaRegCirclePlay, FaRegCirclePause  } from "react-icons/fa6";
import {useEffect, useState} from "react";
import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
    matches: ["https://user.7speaking.com/*"],
    all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style")
    style.textContent = styleText
    return style
}

const storage = new Storage();

const overlay = () => {

    const [active , setActive] = useState<boolean>(false);
    const [text , setText] = useState<string>("⏱️ waiting...");

    const updateValue = async () => {
        const result = await storage.getMany(['active', 'text']);
        if (typeof result?.active === "boolean") {
            setActive(result.active);
        } else {
            storage.setItem("active", false);
        }
        if(typeof result?.text == "string") {
            setText(result.text);
        } else {
            storage.setItem("text", "⏱️ waiting...");
        }
    };

    useEffect(() => {
        updateValue();
        const i = setInterval(updateValue, 100);
        return () => {clearInterval(i)};
    });

    const toggleActive = async () => {
        await storage.set("active", !active);
        setActive(!active);
    }

    return(
        <div className="overlay">
            {active ? (
                <>
                    <FaRegCirclePause onClick={toggleActive}/>
                    <span className="overlay-text">{text}</span>
                </>
            ):(
                <>
                    <FaRegCirclePause onClick={toggleActive} />
                    <span className="overlay-text">🧠 ready to learn ! </span>
                </>
            )}


        </div>
    )

};

export default overlay