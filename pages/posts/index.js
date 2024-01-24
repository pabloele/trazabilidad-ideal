import { Button, Grid, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
	createEditor,
	BaseEditor,
	Descendant,
	Editor,
	Element,
	Transforms,
} from "slate";
import {
	Slate,
	Editable,
	withReact,
	ReactEditor,
	useSlateStatic,
} from "slate-react";
import { withEmbeds } from "../../utils";
import { YouTube } from "../../components/Editor";

const initialValue = [
	{
		type: "paragraph",
		children: [{ text: "A line of text in a paragraph" }],
	},
	{
		type: "image",
		children: [{ text: "" }],
		url: "https://ladatamix.com/wp-content/uploads/2023/09/Globo-aeroestatico.jpeg",
	},
];

const embedRegexes = [
	{
		regex: /https:\/\/www\.youtube\.com\/watch\?v=(\w+)/,
		type: "youtube",
	},
];

const CustomEditor = {
	handleEmbed(editor, event) {
		const text = event.clipboardData.getData("text/plain");

		embedRegexes.some(({ regex, type }) => {
			const match = text.match(regex);
			if (match) {
				console.log("match", type, match[1]);
				event.preventDefault();
				const url = text;
				const embed = { type, url, children: [{ text: url }] };
				Transforms.insertNodes(editor, {
					children: [{ text: "" }],
					type,
					youtubeId: match[1],
				});
				return true;
			}
			return false;
		});
	},
	handlePaste(editor, event) {
		CustomEditor.handleEmbed(editor, event);
	},
	isBoldMarkActive(editor) {
		const marks = Editor.marks(editor);
		return marks ? marks.bold === true : false;
	},
	isCodeBlockActive(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => n.type === "code",
		});
	},

	toggleBoldMark(editor) {
		const isActive = CustomEditor.isBoldMarkActive(editor);
		if (isActive) {
			Editor.removeMark(editor, "bold");
		} else {
			Editor.addMark(editor, "bold", true);
		}
	},
	toggleItalicMark(editor) {
		const isActive = Editor.marks(editor).italic;
		if (isActive) {
			Editor.removeMark(editor, "italic");
		} else {
			Editor.addMark(editor, "italic", true);
		}
	},
	toggleUnderlineMark(editor) {
		const isActive = Editor.marks(editor).underline;
		if (isActive) {
			Editor.removeMark(editor, "underline");
		} else {
			Editor.addMark(editor, "underline", true);
		}
	},
	toggleHeading1(editor) {
		Transforms.setNodes(
			editor,
			{ type: CustomEditor.isHeading1Active(editor) ? null : "h1" },
			{ match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
		);
	},
	isHeading1Active(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "h1",
		});
		return !!match;
	},

	isHeading2Active(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => Element.isElement(n) && n.type === "h2",
		});
		return !!match;
	},

	toggleHeading2(editor) {
		Transforms.setNodes(
			editor,
			{ type: CustomEditor.isHeading2Active(editor) ? null : "h2" },
			{ match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
		);
	},
	toggleCodeBlock(editor) {
		const isActive = CustomEditor.isCodeBlockActive(editor);
		Transforms.setNodes(
			editor,
			{ type: isActive ? null : "code" },
			{ match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
		);
	},
};

const CustomImage = (props) => (
	<img {...props.attributes} src={props.element.url} alt='img' />
);

// const CodeElement = props => {
//   <pre {...props.attributes} style={{backgroundColor: "black", color:"white"}}>

//   </pre>
// }
const CodeElement = (props) => {
	return (
		<pre
			{...props.attributes}
			style={{ backgroundColor: "black", color: "white" }}
		>
			{props.children}
		</pre>
	);
};

const DefaultElement = (props) => <p {...props.attributes}>{props.children}</p>;

const Leaf = (props) => (
	<span
		{...props.attributes}
		style={{
			fontWeight: props.leaf.bold ? "bold" : "normal",
			fontStyle: props.leaf.italic ? "italic" : "normal",
			textDecoration: props.leaf.underline ? "underline" : "none",
		}}
	>
		{props.children}
	</span>
);

const Posts = () => {
	// const [editor] = useState(()=>withReact(createEditor))
	const editor = useMemo(() => withEmbeds(withReact(createEditor()), []));

	const renderElement = useCallback((props) => {
		switch (props.element.type) {
			case "code":
				return <CodeElement {...props} />;
			case "image":
				return <CustomImage {...props} />;
			case "h1":
				return <h1 {...props.attributes}>{props.children}</h1>;
			case "h2":
				return <h2 {...props.attributes}>{props.children}</h2>;
			case "youtube":
				return <YouTube {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

	return (
		<Grid container direction='column'>
			<Slate
				editor={editor}
				initialValue={initialValue}
				onChange={(value) => {
					const isAstChange = editor.operations.some(
						(op) => op.type !== "set_selection"
					);

					if (isAstChange) {
						// Save value to local storage
						const content = JSON.stringify(value);
						localStorage.setItem("content", content);
					}
				}}
			>
				<Grid direction='row'>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleBoldMark(editor);
						}}
					>
						Bold
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeBlock(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Code BLock
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleItalicMark(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Italic
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleUnderlineMark(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Underline
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeBlock(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Link
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeBlock(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Numbered list
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeBlock(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Bullet points
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleHeading1(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						H1
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleHeading2(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						H2
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeBlock(editor);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Image
					</Button>
					<Button
						onMouseDown={(event) => {
							event.preventDefault();
							console.log(editor.children);
						}}
						sx={{ marginLeft: "1rem" }}
					>
						Save
					</Button>
				</Grid>

				<Typography variant='h1' color='primary.main'>
					New post
				</Typography>
				<Editable
					style={{ color: "black" }}
					onChange={(value) => {
						console.log("onChange", value);
					}}
					onKeyDown={(event) => {
						if (!event.ctrlKey) {
							return;
						}
						switch (event.key) {
							case "`": {
								event.preventDefault();
								CustomEditor.toggleCodeBlock(editor);
								break;
							}

							case "b": {
								event.preventDefault();
								CustomEditor.toggleBoldMark(editor);
								break;
							}
						}
					}}
					onPaste={(event) => {
						CustomEditor.handlePaste(editor, event);
					}}
					renderElement={renderElement}
					renderLeaf={renderLeaf}
				></Editable>
			</Slate>
		</Grid>
	);
};

export default Posts;
