export class HomeHandler implements RouteHandlerInterfaces{

    readonly routeRegex = /^home/;

    async handler() {
        const page = document.querySelector(".scrollableList .scrollableList__content .MuiButtonBase-root") as HTMLElement
        if(page == null){
            console.warn("elem not found")
            return
        }
        page.click()
    }
}


