/*
Copyright 2026 Plow PBC

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/

/**
 * Whether a drag carries files, e.g. dragged in from the desktop.
 * See https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
 * @param dataTransfer - the drag event's data
 */
export function isFileDrag(dataTransfer: DataTransfer | null): boolean {
    return (
        !!dataTransfer &&
        (dataTransfer.types.includes("Files") || dataTransfer.types.includes("application/x-moz-file"))
    );
}

/**
 * Call `onFileDrag` whenever a file drag enters the window. Menus use this to close themselves,
 * as their full-screen background (or a modal menu's `pointer-events: none` on the body) would
 * otherwise take the drop away from the room's file drop target.
 * @param onFileDrag - called on each file `dragenter`
 * @returns a function that removes the listener
 */
export function onFileDragEnterWindow(onFileDrag: () => void): () => void {
    const listener = (ev: DragEvent): void => {
        if (isFileDrag(ev.dataTransfer)) onFileDrag();
    };
    window.addEventListener("dragenter", listener, true);
    return () => window.removeEventListener("dragenter", listener, true);
}
