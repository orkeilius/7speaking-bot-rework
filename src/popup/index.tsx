import "./styles.css"
import { Storage } from "@plasmohq/storage"
import React, {useEffect} from "react";

const storage = new Storage({area: "local"})

export default function IndexPopup() {
    const [errorProbability, setErrorProbability] = React.useState(0.2);
    const [useRealtime, setUseRealtime] = React.useState(true);
    const [fixTime, setFixTime] = React.useState(360);
    const [active, setActive] = React.useState(false);

    const updateErrorProbability = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorProbability(Number.parseFloat(e.target.value));
        storage.set("errorProbability", Number.parseFloat(e.target.value));

    }

    const updateUseRealtime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseRealtime(e.target.checked);
        storage.set("useRealtime", e.target.checked);
    }
    const updateFixedTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFixTime(Number.parseInt(e.target.value, 10));
        storage.set("fixTime", Number.parseInt(e.target.value, 10));
    }
    const updateActive = () => {
        storage.set("active", !active)
        setActive(!active);

    }

    useEffect(() => {
        async function fetchSettings() {
            try {
                const result = await storage.getMany(['errorProbability', 'useRealtime', 'fixTime', 'active']);
                if (typeof result.errorProbability === 'number' && !Number.isNaN(result.errorProbability)) {
                    setErrorProbability(result.errorProbability);
                }
                if (typeof result.useRealtime === 'boolean') {
                    setUseRealtime(result.useRealtime);
                }
                if (typeof result.fixTime === 'number' && !Number.isNaN(result.fixTime)) {
                    setFixTime(result.fixTime);
                }
                if (typeof result.active === 'boolean') {
                    setActive(result.active);
                }
            } catch (e) {
                // Optionnel : log l'erreur ou ignorer
                console.error('Erreur lors de la récupération des paramètres:', e);
            }
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
