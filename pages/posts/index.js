import { Button, Grid, Icon, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import {
  createEditor,
  BaseEditor,
  Descendant,
  Editor,
  Element,
  Transforms,
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  useSlateStatic,
  useSelected,
  useFocused,
} from 'slate-react';
import { embedRegexes, isImageUrl, withEmbeds } from '../../utils';
import { YouTube } from '../../components/Editor';
import { FaLink, FaUnlink } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph' }],
  },
  {
    type: 'image',
    children: [{ text: '' }],
    url: 'https://ladatamix.com/wp-content/uploads/2023/09/Globo-aeroestatico.jpeg',
  },
];

const Link = ({ attributes, element, children }) => {
  const router = useRouter();

  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();
  console.log(element.url);
  return (
    <div>
      <a
        {...attributes}
        href={element.url}
        target="_blank"
        rel="noreferrer"
        style={{ cursor: 'pointer' }}
      >
        {children}
      </a>
      {selected && focused && (
        <div
          className="popup"
          contentEditable={false}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            window.open(element.url, '_blank');
          }}
        >
          <FaLink />
          {element.url}
          {/* <button onClick={() => CustomEditor.removeLink(editor)}>
						<FaUnlink marginLeft='5rem' />
					</button> */}
        </div>
      )}
    </div>
  );
};

const CustomImage = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} style={{ position: 'relative' }}>
        <img
          src={element.url}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20rem',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
        {/* <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          style={{
            display: selected && focused ? 'inline' : 'none',
            position: 'absolute',
            top: '0.5em',
            left: '0.5em',
            // backgroundColor: 'white',
          }}
        >
          <MdDelete size="6rem" />
        </Button> */}
      </div>
    </div>
  );
};

const DefaultElement = (props) => <p {...props.attributes}>{props.children}</p>;

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecoration: props.leaf.underline ? 'underline' : 'none',
        color: props.leaf.link ? 'blue' : 'inherit',
      }}
    >
      {props.leaf.link ? (
        <>
          <a href={props.leaf.url} target="_blank" rel="noopener noreferrer">
            {props.children}
          </a>
        </>
      ) : (
        props.children
      )}
    </span>
  );
};

const CustomEditor = {
  handleEmbed(editor, event) {
    const text = event.clipboardData.getData('text/plain');

    embedRegexes.some(({ regex, type }) => {
      const match = text.match(regex);
      if (match) {
        console.log('match', type, match[1]);
        event.preventDefault();
        const url = text;
        const embed = { type, url, children: [{ text: url }] };
        Transforms.insertNodes(editor, {
          children: [{ text: '' }],
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
  withImages(editor) {
    const { insertData, isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === 'image' ? true : isVoid(element);
    };

    editor.insertData = (data) => {
      const text = data.getData('text/plain');
      const { files } = data;

      if (files && files.length > 0) {
        for (const file of files) {
          const reader = new FileReader();
          const [mime] = file.type.split('/');

          if (mime === 'image') {
            reader.addEventListener('load', () => {
              const url = reader.result;
              insertImage(editor, url);
            });

            reader.readAsDataURL(file);
          }
        }
      } else if (isImageUrl(text)) {
        CustomEditor.insertImage(editor, text);
      } else {
        insertData(data);
      }
    };

    return editor;
  },
  insertImage(editor, url) {
    const text = { text: '' };
    const image = { type: 'image', url, children: [text] };
    Transforms.insertNodes(editor, image);
  },
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },
  toggleItalicMark(editor) {
    const isActive = Editor.marks(editor).italic;
    if (isActive) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },
  toggleUnderlineMark(editor) {
    const isActive = Editor.marks(editor).underline;
    if (isActive) {
      Editor.removeMark(editor, 'underline');
    } else {
      Editor.addMark(editor, 'underline', true);
    }
  },
  toggleHeading1(editor) {
    Transforms.setNodes(
      editor,
      { type: CustomEditor.isHeading1Active(editor) ? null : 'h1' },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },
  isHeading1Active(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'h1',
    });
    return !!match;
  },
  isHeading2Active(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'h2',
    });
    return !!match;
  },
  toggleHeading2(editor) {
    Transforms.setNodes(
      editor,
      { type: CustomEditor.isHeading2Active(editor) ? null : 'h2' },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },
  createLinkNode(href, text) {
    return {
      type: 'link',
      href,
      children: [{ text }],
    };
  },
  removeLink(editor, opts = {}) {
    Transforms.unwrapNodes(editor, {
      ...opts,
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  },
  insertLink(editor, url) {
    if (!url) return;

    const { selection } = editor;
    const link = CustomEditor.createLinkNode(url, 'New Link');

    ReactEditor.focus(editor);

    if (!!selection) {
      const [parentNode, parentPath] = Editor.parent(
        editor,
        selection.focus?.path
      );

      // Remove the Link node if we're inserting a new link node inside of another link.
      if (parentNode.type === 'link') {
        CustomEditor.removeLink(editor);
      }

      if (editor.isVoid(parentNode)) {
        // Insert the new link after the void node.
        Transforms.insertNodes(editor, createParagraphNode([link]), {
          at: Path.next(parentPath),
          select: true,
        });
      } else if (Range.isCollapsed(selection)) {
        // Insert the new link in our last known location.
        Transforms.insertNodes(editor, link, { select: true });
      } else {
        // Wrap the currently selected range of text into a Link.
        Transforms.wrapNodes(editor, link, { split: true });
        // Remove the highlight and move the cursor to the end of the highlight.
        Transforms.collapse(editor, { edge: 'end' });
      }
    } else {
      // Insert the new link node at the bottom of the Editor when selection
      // is falsey.
      Transforms.insertNodes(editor, createParagraphNode([link]));
    }
  },
  toggleLink(editor, url) {
    const isLinkActive = CustomEditor.isLinkActive(editor);

    if (isLinkActive) {
      // If a link is active, unwrap the nodes
      Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' });
    } else {
      // If no link is active, insert the link node
      const link = { type: 'link', url, children: [{ text: '' }] };
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' }); // Move the cursor after the link
    }
  },
  isLinkActive(editor) {
    const [link] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
    return !!link;
  },
};

const Posts = () => {
  const editor = useMemo(() => withEmbeds(withReact(createEditor()), []));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'image':
        return <CustomImage {...props} />;
      case 'h1':
        return <h1 {...props.attributes}>{props.children}</h1>;
      case 'h2':
        return <h2 {...props.attributes}>{props.children}</h2>;
      case 'youtube':
        return <YouTube {...props} />;
      case 'link':
        return <Link {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Grid container direction="column">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => op.type !== 'set_selection'
          );

          if (isAstChange) {
            // Save value to local storage
            const content = JSON.stringify(value);
            localStorage.setItem('content', content);
          }
        }}
      >
        <Grid direction="row">
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
              CustomEditor.toggleItalicMark(editor);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            Italic
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleUnderlineMark(editor);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            Underline
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              const url = prompt('Enter the URL:');
              if (url) {
                CustomEditor.toggleLink(editor, url);
              }
            }}
            sx={{ marginLeft: '1rem' }}
          >
            Link
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            Numbered list
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            Bullet points
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleHeading1(editor);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            H1
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleHeading2(editor);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            H2
          </Button>

          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              const url = window.prompt('Enter the URL of the image:');
              if (url && !isImageUrl(url)) {
                alert('URL is not an image');
                return;
              }
              url && CustomEditor.insertImage(editor, url);
            }}
          >
            Image
          </Button>
          <Button
            onMouseDown={(event) => {
              event.preventDefault();
              console.log(editor.children);
            }}
            sx={{ marginLeft: '1rem' }}
          >
            Save
          </Button>
        </Grid>

        <Editable
          style={{ color: 'black' }}
          onChange={(value) => {
            console.log('onChange', value);
          }}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }
            switch (event.key) {
              case '`': {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              case 'b': {
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
