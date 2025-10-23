
export default function UpdateWarning(){
    return(
        <div className="rounded-2xl bg-secondary/10 text-text p-2 m-4 flex flex-col items-center gap-2 border-2 border-secondary w-4/5">
            <h2>Update available</h2>
            <a target="_blank" href="https://github.com/orkeilius/7speaking-bot-rework/releases" className="underline">Download here</a>
        </div>
    )
}