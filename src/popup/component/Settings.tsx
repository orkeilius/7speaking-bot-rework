import {storageService} from "~contents/services/StorageService";
import ElemRow from "~popup/component/ElemRow";
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
                <ElemRow label={"Error Probability : "} labelAfter={"%"}>
                        <input type={"number"} className="border-text-2 border p-0.5 rounded w-12" value={errorProbability} onChange={updateErrorProbability} min="0" max="100" step=".1"/>
                </ElemRow>
                <ElemRow label={"Show overlay : "}>
                        <input type={"checkbox"} checked={showOverlay} onChange={updateShowOverlay}/>
                </ElemRow>
                <ElemRow label="use recommanded timer : ">
                        <input type={"checkbox"} checked={useRealtime} onChange={updateUseRealtime}/>
                </ElemRow>
                {!useRealtime && (
                    <ElemRow label="custom timer : " labelAfter={"min"}>
                            <input type={"number"} className="border-text-2 border p-0.5 rounded w-12" value={fixTime} onChange={updateFixedTime}/>
                    </ElemRow>
                )}
        </div>
    )
}

