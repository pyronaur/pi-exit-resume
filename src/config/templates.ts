export const TEMPLATE = {
	copied: (command: string): string => `\nCopied resume command to clipboard:\n${command}\n\n`,
	copyFailed: (message: string): string => `\n${message}\n\n`,
};
