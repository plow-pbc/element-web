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
 * Window `dragenter` listener (capture) that closes the menu a file drag lands on, so the drop reaches the room.
 * An open menu's overlay is what takes the drop: a {@link ContextMenu}'s full-screen background, or `<html>`
 * under a modal Radix menu (every compound-web `Menu`), which sets `pointer-events: none` on the body.
 * Both kinds of menu close on a click outside, so the drag clicks the overlay it landed on.
 * @param ev - the `dragenter` event
 */
export function closeMenuUnderFileDrag(ev: DragEvent): void {
    if (!isFileDrag(ev.dataTransfer)) return;
    const overlay = ev.target as HTMLElement;
    if (overlay !== document.documentElement && !overlay.classList.contains("mx_ContextualMenu_background")) return;
    overlay.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); // Radix dismisses on pointerdown
    overlay.click(); // ContextMenu closes on a click on its background
}
