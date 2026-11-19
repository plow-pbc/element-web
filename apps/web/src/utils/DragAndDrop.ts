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
