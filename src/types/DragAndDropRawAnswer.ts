
export default interface DragAndDropRawAnswer{
    answers: DragAndDropRawDropzone[];
    options: DragAndDropRawDragElem[]
}

interface DragAndDropRawDropzone{
    id: number
    content: string
}
interface DragAndDropRawDragElem{
    displayOrder: number
    id: number
    content: string
}
