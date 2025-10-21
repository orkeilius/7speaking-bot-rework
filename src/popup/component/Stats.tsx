import {useEffect, useState} from "react";
import ElemRow from "~popup/component/ElemRow";
import {storageService} from "~contents/services/StorageService";

export default function Stats(){

    const [nbQuestionDone, setNbQuestionDone] = useState(0);
    const [nbQuizDone, setNbQuizDone] = useState(0);
    const [timeSpend, setTimeSpend] = useState(0);

    useEffect(() => {
        async function fetchSettings() {
            setNbQuestionDone(await storageService.getStatQuestionDone());
            setNbQuizDone(await storageService.getStatQuizDone());
            setTimeSpend(await storageService.getStatTimeUse());
        }
        fetchSettings();
    }, []);

    return(
        <div className="m-2 bg-bg-2 rounded-xl p-2 w-4/5">
           <div>
               <ElemRow label="Question completed 📝 ">
                   <p>{nbQuestionDone}</p>
               </ElemRow>
               <ElemRow label="Lesson learned 📕 ">
                   <p>{nbQuizDone}</p>
               </ElemRow>
               <ElemRow label="Time Spend learning 🧠 ">
                   <p>{formatMsToHoursMinutes(timeSpend)}</p>
               </ElemRow>



           </div>
        </div>
    )
}

function formatMsToHoursMinutes(ms: number): string {
    if (!ms || ms <= 0) return '0m';
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}