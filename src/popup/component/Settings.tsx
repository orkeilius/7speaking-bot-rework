import {StorageKeys, storageService} from "~contents/services/StorageService";
import ElemRow from "~popup/component/ElemRow";
import React, {useEffect} from "react";

export default function Settings() {

    const [errorProbability, setErrorProbability] = React.useState(0.2);
    const [useRealtime, setUseRealtime] = React.useState(true);
    const [customTimerQuiz, setCustomTimerQuiz] = React.useState(360);
    const [customTimerQuestion, setCustomTimerQuestion] = React.useState(360);
    const [showOverlay, setShowOverlay] = React.useState(true);

    const updateErrorProbability = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorProbability(Number.parseFloat(e.target.value));
        storageService.set(StorageKeys.ERROR_PROBABILITY, Number.parseFloat(e.target.value) / 100);
    }

    const updateShowOverlay = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowOverlay(e.target.checked);
        storageService.set(StorageKeys.SHOW_OVERLAY, e.target.checked);
    }

    const updateUseRealtime = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseRealtime(e.target.checked);
        storageService.set(StorageKeys.USE_RECOMMENDED_TIME, e.target.checked)
    }
    const updateCustomTimerQuiz = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomTimerQuiz(Number.parseInt(e.target.value, 10));
        storageService.set(StorageKeys.CUSTOM_TIMER_QUIZ, Number.parseInt(e.target.value, 10) * 1000 * 60);
    }
    const updateCustomTimerQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomTimerQuestion(Number.parseInt(e.target.value, 10));
        storageService.set(StorageKeys.CUSTOM_TIMER_QUESTION, Number.parseInt(e.target.value, 10) * 1000);
    }

    useEffect(() => {
        const watchers = [
            storageService.subscribe<boolean>(StorageKeys.SHOW_OVERLAY, setShowOverlay),
            storageService.subscribe<number>(StorageKeys.ERROR_PROBABILITY, (v: number) => setErrorProbability(v * 100)),
            storageService.subscribe<boolean>(StorageKeys.USE_RECOMMENDED_TIME, setUseRealtime),
            storageService.subscribe<number>(StorageKeys.CUSTOM_TIMER_QUIZ, (v: number) => setCustomTimerQuiz(v / 1000 / 60)),
            storageService.subscribe<number>(StorageKeys.CUSTOM_TIMER_QUESTION, (v: number) => setCustomTimerQuestion(v / 1000))
        ];
        return () => watchers.forEach(unsubscribe => unsubscribe())
    }, []);

    return (
        <div className="m-2 bg-bg-2 rounded-xl p-2 w-4/5">
            <ElemRow label={"Error Probability : "} labelAfter={"%"}>
                <input type={"number"} className="border-text-2 border p-0.5 rounded w-14" value={errorProbability}
                       onChange={updateErrorProbability} min="0" max="100" step=".1"/>
            </ElemRow>
            <ElemRow label={"Show overlay : "}>
                <input type={"checkbox"} checked={showOverlay} onChange={updateShowOverlay}/>
            </ElemRow>
            <ElemRow label="use recommanded timer : ">
                <input type={"checkbox"} checked={useRealtime} onChange={updateUseRealtime}/>
            </ElemRow>
            {!useRealtime && (
                <>
                    <ElemRow label="Lesson timer : " labelAfter={"min"}>
                        <input type={"number"} className="border-text-2 border p-0.5 rounded w-14"
                               value={customTimerQuiz} onChange={updateCustomTimerQuiz}/>
                    </ElemRow>
                    <ElemRow label="Question timer : " labelAfter={"sec"}>
                        <input type={"number"} className="border-text-2 border p-0.5 rounded w-14"
                               value={customTimerQuestion} onChange={updateCustomTimerQuestion}/>
                    </ElemRow>
                </>

            )}
        </div>
    )
}

