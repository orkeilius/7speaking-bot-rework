

export async function realistInput(input: HTMLInputElement, value: string) {
    input.value = ""
    for (let i = 0; i < value.length ; i++) {
        input.focus()
        document.execCommand("insertText", false, value.charAt(i));
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
    }
    input.blur()
}


export async function waitForSelector(selector: string, timeout = 30000): Promise<boolean> {

    // Delay for react re-render
    const  initialDelay = 500;
    await new Promise(resolve => setTimeout(resolve, initialDelay));

    const timeLimit = Date.now() + timeout;
    while (Date.now() < timeLimit) {
        if (document.querySelector(selector)) {
            return true
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false
}