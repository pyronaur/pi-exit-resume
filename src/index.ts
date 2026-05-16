import { existsSync } from "node:fs";

import {
	copyToClipboard,
	type ExtensionAPI,
	type ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { matchesKey } from "@earendil-works/pi-tui";

import {
	COPY_DIALOG_OPTIONS,
	COPY_DIALOG_TITLE,
	COPY_FAILED_MESSAGE,
	RESUME_COMMAND_PREFIX,
} from "./config/constants.ts";

type ExitContext = Pick<
	ExtensionContext,
	"abort" | "hasUI" | "sessionManager" | "shutdown" | "ui"
>;

function getResumeCommand(ctx: ExitContext): string | undefined {
	const sessionId = ctx.sessionManager.getSessionId();
	const sessionFile = ctx.sessionManager.getSessionFile();
	if (!sessionId || !sessionFile || !existsSync(sessionFile)) {
		return undefined;
	}

	return `${RESUME_COMMAND_PREFIX}${sessionId}`;
}

async function exit(ctx: ExitContext, copy: boolean): Promise<void> {
	const command = getResumeCommand(ctx);
	if (copy && command) {
		try {
			await copyToClipboard(command);
		} catch {
			ctx.ui.notify(COPY_FAILED_MESSAGE, "warning");
		}
	}

	ctx.abort();
	ctx.shutdown();
}

export default function piExitResume(pi: Pick<ExtensionAPI, "on">): void {
	let unsubscribe: (() => void) | undefined;

	pi.on("session_start", (_event, ctx) => {
		if (!ctx.hasUI) {
			return;
		}

		let dialogOpen = false;
		unsubscribe?.();
		unsubscribe = ctx.ui.onTerminalInput((data) => {
			if (dialogOpen) {
				return;
			}

			if (!matchesKey(data, "ctrl+c")) {
				return;
			}

			dialogOpen = true;
			void (async () => {
				const choice = await ctx.ui.select(COPY_DIALOG_TITLE, [...COPY_DIALOG_OPTIONS]);
				dialogOpen = false;
				await exit(ctx, choice === COPY_DIALOG_OPTIONS[0]);
			})();

			return { consume: true };
		});
	});

	pi.on("session_shutdown", () => {
		unsubscribe?.();
		unsubscribe = undefined;
	});
}
