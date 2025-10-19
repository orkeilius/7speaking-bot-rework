import {storageService} from "~contents/services/StorageService";
import React, {useEffect} from "react";

export default function Settings(){

    const [errorProbability, setErrorProbability] = React.useState(0.2);
    const [useRealtime, setUseRealtime] = React.useState(true);
    const [fixTime, setFixTime] = React.useState(360);
    const [showOverlay, setShowOverlay] = React.useState(true);

    const updateErrorProbability = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorProbability(Number.parseFloat(e.target.value));
        storageService.setErrorProbability(Number.parseFloat(e.target.value) / 100);
    }

    const updateShowOverlay = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowOverlay(e.target.checked);
        storageService.setShowOverlay(e.target.checked);
    }

    const updateUseRealtime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseRealtime(e.target.checked);
        storageService.setUseRealtime(e.target.checked)
    }
    const updateFixedTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFixTime(Number.parseInt(e.target.value, 10));
        storageService.setFixedTime(Number.parseInt(e.target.value, 10) * 1000 * 60);
    }

    useEffect(() => {
        async function fetchSettings() {
            setErrorProbability(await storageService.getErrorProbability() * 100);
            setShowOverlay(await storageService.getShowOverlay());
            setUseRealtime(await storageService.getUseRealtime())
            setFixTime(await storageService.getFixedTime() / 1000 / 60);
        }
        fetchSettings();
    }, []);

    return (
        <div className="m-2 bg-bg-2 rounded-xl p-2">
                <SettingRow label={"Error Probability : "} labelAfter={"%"}>
                        <input type={"number"} className="border-text-2 border p-0.5 rounded w-fit" value={errorProbability} onChange={updateErrorProbability} min="0" max="100" step=".1"/>
                </SettingRow>
                <SettingRow label={"Show overlay : "}>
                        <input type={"checkbox"} checked={showOverlay} onChange={updateShowOverlay}/>
                </SettingRow>
                <SettingRow label="use recommanded timer : ">
                        <input type={"checkbox"} checked={useRealtime} onChange={updateUseRealtime}/>
                </SettingRow>
                {!useRealtime && (
                    <SettingRow label="custom timer : " labelAfter={"min"}>
                            <input type={"number"} className="border-text-2 border p-0.5 rounded w-fit" value={fixTime} onChange={updateFixedTime}/>
                    </SettingRow>
                )}
        </div>
    )
}

const SettingRow: React.FC<{label: string,labelAfter?: string, children: React.ReactNode}> = ({label, labelAfter, children}) => {
    return (
        <div className="w-full p-2 flex items-center">
            <label>{label}</label>
            <div className="grow ml-1"/>
            {children}
            {labelAfter && <label>{labelAfter}</label>}
        </div>
    )
}