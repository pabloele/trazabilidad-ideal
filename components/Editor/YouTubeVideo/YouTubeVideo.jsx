import YouTubeEmbed from "react-youtube";

export const YouTube = (props) => {
	const { attributes, children, element } = props;
	const { youtubeId } = element;

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<YouTubeEmbed contentEditable={false} videoId={youtubeId} />
				{children}
			</div>
		</div>
	);
};
