import {StorageKeys, storageService} from "~contents/services/StorageService";
import ElemRow from "~popup/component/ElemRow";
import React from "react";

export default function Settings(){

    const [errorProbability, setErrorProbability] = React.useState(0.2);
    const [useRealtime, setUseRealtime] = React.useState(true);
    const [fixTime, setFixTime] = React.useState(360);
    const [showOverlay, setShowOverlay] = React.useState(true);

    const updateErrorProbability = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorProbability(Number.parseFloat(e.target.value));
        storageService.set(StorageKeys.ERROR_PROBABILITY,Number.parseFloat(e.target.value) / 100);
    }

    const updateShowOverlay = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowOverlay(e.target.checked);
        storageService.set(StorageKeys.SHOW_OVERLAY,e.target.checked);
    }

    const updateUseRealtime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseRealtime(e.target.checked);
        storageService.set(StorageKeys.USE_RECOMMENDED_TIME, e.target.checked)
    }
    const updateFixedTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFixTime(Number.parseInt(e.target.value, 10));
        storageService.set(StorageKeys.CUSTOM_TIMER,Number.parseInt(e.target.value, 10) * 1000 * 60);
    }

    async function fetchSettings() {
        setErrorProbability(await storageService.get<number>(StorageKeys.ERROR_PROBABILITY) * 100);
        setShowOverlay(await storageService.get(StorageKeys.SHOW_OVERLAY));
        setUseRealtime(await storageService.get(StorageKeys.USE_RECOMMENDED_TIME))
        setFixTime(await storageService.get<number>(StorageKeys.CUSTOM_TIMER) / 1000 / 60);
    }

    setInterval(async () => {
        setShowOverlay(await storageService.get(StorageKeys.SHOW_OVERLAY));
    },1000);
    fetchSettings()

    return (
        <div className="m-2 bg-bg-2 rounded-xl p-2 w-4/5">
                <ElemRow label={"Error Probability : "} labelAfter={"%"}>
                        <input type={"number"} className="border-text-2 border p-0.5 rounded w-14" value={errorProbability} onChange={updateErrorProbability} min="0" max="100" step=".1"/>
                </ElemRow>
                <ElemRow label={"Show overlay : "}>
                        <input type={"checkbox"} checked={showOverlay} onChange={updateShowOverlay}/>
                </ElemRow>
                <ElemRow label="use recommanded timer : ">
                        <input type={"checkbox"} checked={useRealtime} onChange={updateUseRealtime}/>
                </ElemRow>
                {!useRealtime && (
                    <ElemRow label="custom timer : " labelAfter={"min"}>
                            <input type={"number"} className="border-text-2 border p-0.5 rounded w-14" value={fixTime} onChange={updateFixedTime}/>
                    </ElemRow>
                )}
        </div>
    )
}

