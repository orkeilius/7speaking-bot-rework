import "./styles.css"
import React, {useEffect} from "react";
import {storageService} from "~contents/services/StorageService";


export default function IndexPopup() {
    const [errorProbability, setErrorProbability] = React.useState(0.2);
    const [useRealtime, setUseRealtime] = React.useState(true);
    const [fixTime, setFixTime] = React.useState(360);
    const [active, setActive] = React.useState(false);

    const updateErrorProbability = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorProbability(Number.parseFloat(e.target.value));
        storageService.setErrorProbability(Number.parseFloat(e.target.value));
    }

    const updateUseRealtime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseRealtime(e.target.checked);
        storageService.setUseRealtime(e.target.checked)
    }
    const updateFixedTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFixTime(Number.parseInt(e.target.value, 10));
        storageService.setFixedTime(Number.parseInt(e.target.value, 10));
    }
    const updateActive = () => {
        setActive(!active);
        storageService.setActive(!active)

    }

    useEffect(() => {
        async function fetchSettings() {
            setActive(await storageService.getActive());
            setErrorProbability(await storageService.getErrorProbability());
            setUseRealtime(await storageService.getUseRealtime());
            setFixTime((await storageService.getFixedTime()));
        }

        fetchSettings();
    }, []);


    return (
        <>
            <header>
                <h1>
                    7speaking bot rework - settings
                </h1>
            </header>
            <button onClick={updateActive}>{active ? "stop" : "start"}</button>
            <div className="settings-card">
                <div className="setting-row">
                    <label>Error probability:
                        <input type={"number"} value={errorProbability} onChange={updateErrorProbability}/>
                    </label>
                </div>
                <div className="setting-row">
                    <label>use realtime
                        <input type={"checkbox"} checked={useRealtime} onChange={updateUseRealtime}/>
                    </label>
                </div>
                {!useRealtime && (
                    <div className="setting-row">
                        <label>Fix time (in seconds):
                            <input type={"number"} value={fixTime} onChange={updateFixedTime}/>
                        </label>
                    </div>
                )}
            </div>
        </>
    )
}
