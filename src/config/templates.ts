export const TEMPLATE = {
	copyDialogTitle: (title: string, command: string | undefined, emptyMessage: string): string =>
		`${title}\n${command ?? emptyMessage}`,
};
