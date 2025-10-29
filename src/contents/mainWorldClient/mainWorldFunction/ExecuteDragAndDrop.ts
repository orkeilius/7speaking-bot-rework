import MainWorldInterface from "~contents/mainWorldClient/mainWorldInterface";
import type DragAndDropAnswer from "~types/DragAndDropAnswer";


export default class ExecuteDragAndDrop extends MainWorldInterface<DragAndDropAnswer, void>{
    name: string = "ExecuteDragAndDrop";

    protected clientFunction({dragId,dropzoneId}: DragAndDropAnswer): void {
        try {
            const dragElem = document.querySelector(`div[data-rbd-draggable-id="${dragId}"]`);
            if (!dragElem) {
                console.log('Drag element not found');
                return
            }

            // Trouver l'instance React et le callback onDragEnd
            let reactInstance = this.getReactElement(dragElem);
            let onDragEndCallback = null;

            let current = reactInstance;
            while (current) {
                if (current.return) {
                    current = current.return;
                    if (current.memoizedProps?.onDragEnd) {
                        onDragEndCallback = current.memoizedProps.onDragEnd;
                        break;
                    }
                    if (current.pendingProps?.onDragEnd) {
                        onDragEndCallback = current.pendingProps.onDragEnd;
                        break;
                    }
                } else {
                    break;
                }
            }

            if (!onDragEndCallback) {
                console.error("onDragEnd callback not found");
                return;
            }

            // Trouver la source droppable
            const sourceDroppable = dragElem.closest<HTMLElement>('[data-rbd-droppable-id]');
            const sourceDroppableId = sourceDroppable?.dataset.rbdDroppableId;

            const sourceIndex = Array.from(sourceDroppable?.querySelectorAll('[data-rbd-draggable-id]') || [])
                .indexOf(dragElem);

            // Appeler le callback onDragEnd
            const result = {
                draggableId: String(dragId),
                type: 'DEFAULT',
                source: {
                    droppableId: sourceDroppableId,
                    index: Math.max(0,sourceIndex)
                },
                destination: {
                    droppableId: String(dropzoneId),
                    index: 0
                },
                reason: 'DROP',
                mode: 'FLUID',
                combine: null
            };

            onDragEndCallback(result);
        } catch (error) {
            console.error(error)
        }
    }
}