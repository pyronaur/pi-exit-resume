import { existsSync } from "node:fs";

import {
	copyToClipboard,
	type ExtensionAPI,
	type ExtensionContext,
} from "@earendil-works/pi-coding-agent";

import {
	COPY_FAILED_MESSAGE,
	RESUME_COMMAND_PREFIX,
} from "./config/constants.ts";
import { TEMPLATE } from "./config/templates.ts";

type ShutdownContext = Pick<ExtensionContext, "sessionManager">;

function getResumeCommand(ctx: ShutdownContext): string | undefined {
	const sessionId = ctx.sessionManager.getSessionId();
	const sessionFile = ctx.sessionManager.getSessionFile();
	if (!sessionId || !sessionFile || !existsSync(sessionFile)) {
		return undefined;
	}

	return `${RESUME_COMMAND_PREFIX}${sessionId}`;
}

async function copyResumeCommand(command: string): Promise<void> {
	try {
		await copyToClipboard(command);
		process.stderr.write(TEMPLATE.copied(command));
	} catch {
		process.stderr.write(TEMPLATE.copyFailed(COPY_FAILED_MESSAGE));
	}
}

export default function piExitResume(pi: Pick<ExtensionAPI, "on">): void {
	pi.on("session_shutdown", async (event, ctx) => {
		if (event.reason !== "quit") {
			return;
		}

		const command = getResumeCommand(ctx);
		if (!command) {
			return;
		}

		await copyResumeCommand(command);
	});
}
