export const withEmbeds = (editor) => {
	const { insertData, isInLine, isVoid } = editor;

	editor.insertData = (data) => {
		console.log("Data", data.getData("text/plain"));
		return insertData(data);
	};

	return editor;
};
