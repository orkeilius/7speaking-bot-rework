

export async function realistInput(input: HTMLInputElement, value: string) {
    input.value = ""
    for (let i = 0; i < value.length ; i++) {
        input.focus()
        document.execCommand("insertText", false, value.charAt(i));
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
    }
    input.blur()
}