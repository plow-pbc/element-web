/*
Copyright 2026 Plow PBC

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE in the repository root for full details.
*/

// @vitest-environment happy-dom

import React, { type JSX, useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "test-utils-rtl";
import userEvent from "@testing-library/user-event";
import { stubClient } from "test-utils";
import { RoomListItemMoreOptionsMenu, useMockedViewModel } from "@element-hq/web-shared-components";

import { closeMenuUnderFileDrag } from "./DragAndDrop";
import ContextMenu from "../components/structures/ContextMenu";
import { ThreadsActivityCentre } from "../components/views/spaces/threads-activity-centre/ThreadsActivityCentre";
import MatrixClientContext from "../contexts/MatrixClientContext";

const files = { dataTransfer: { types: ["Files"] } };

function LegacyContextMenu(): JSX.Element {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)}>Open</button>
            {open && (
                <ContextMenu top={0} left={0} onFinished={() => setOpen(false)}>
                    <div />
                </ContextMenu>
            )}
        </>
    );
}

function RoomListItemMenu(): JSX.Element {
    const vm = useMockedViewModel(
        {
            showMoreOptionsMenu: true,
            canMarkAsRead: true,
            canMarkAsUnread: false,
            isFavourite: false,
            isLowPriority: false,
            canInvite: false,
            canCopyRoomLink: false,
            sections: [],
        } as any,
        {} as any,
    );
    return <RoomListItemMoreOptionsMenu vm={vm} />;
}

function TAC(): JSX.Element {
    const cli = stubClient();
    cli.supportsThreads = () => true;
    return (
        <MatrixClientContext.Provider value={cli}>
            <ThreadsActivityCentre />
        </MatrixClientContext.Provider>
    );
}

// Where a file drag lands while the menu is open: the legacy menu's background, or <html> under a Radix modal menu
const overlayOf = {
    legacy: () => document.querySelector(".mx_ContextualMenu_background")!,
    radix: () => document.documentElement,
};

describe("closeMenuUnderFileDrag", () => {
    beforeEach(() => window.addEventListener("dragenter", closeMenuUnderFileDrag, true));
    afterEach(() => window.removeEventListener("dragenter", closeMenuUnderFileDrag, true));

    it.each([
        ["ContextMenu", LegacyContextMenu, "Open", overlayOf.legacy],
        ["room list item More Options", RoomListItemMenu, "More Options", overlayOf.radix],
        ["Threads activity centre", TAC, "Threads", overlayOf.radix],
    ])("closes the %s menu when a file is dragged onto its overlay", async (_, Component, button, overlay) => {
        render(<Component />);
        await userEvent.click(screen.getByRole("button", { name: button }));
        expect(screen.getByRole("menu")).toBeInTheDocument();

        fireEvent.dragEnter(overlay(), { dataTransfer: { types: ["text/plain"] } });
        expect(screen.getByRole("menu")).toBeInTheDocument();

        fireEvent.dragEnter(overlay(), files);
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes a ContextMenu once, however many elements the drag crosses", () => {
        let closes = 0;
        render(
            <ContextMenu top={0} left={0} onFinished={() => closes++}>
                <div />
            </ContextMenu>,
        );
        fireEvent.dragEnter(overlayOf.legacy(), files);
        fireEvent.dragEnter(document.body, files);
        fireEvent.dragEnter(document.documentElement, files);
        expect(closes).toBe(1);
    });
});
