# React Native Markdown Display [![npm version](https://badge.fury.io/js/react-native-markdown-display.svg)](https://badge.fury.io/js/react-native-markdown-display) [![Known Vulnerabilities](https://snyk.io/test/github/iamacup/react-native-markdown-display/badge.svg)](https://snyk.io/test/github/iamacup/react-native-markdown-display)

It a 100% compatible CommonMark renderer, a react-native markdown renderer done right. This is __not__ a web-view markdown renderer but a renderer that uses native components for all its elements. These components can be overwritten and styled as needed.

### Compatibility with react-native-markdown-renderer

This is intended to be a replacement for react-native-markdown-renderer, with a variety of bug fixes and enhancements - **Due to how the new style rules work, there may be some tweaking needed**, [see how to style stuff section below](#How-to-style-stuff)

### Install

#### Yarn
```npm
yarn add react-native-markdown-display
```

#### NPM
```npm
npm install -S react-native-markdown-display
```

### Get Started

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Markdown from 'react-native-markdown-display';

const copy = `# h1 Heading 8-)

**This is some bold text!**

This is normal text
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
          <Markdown>
            {copy}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```
You can find this example [here](https://snack.expo.dev/@hassieb/react-native-markdown-display-ordered-list)

This next example worked with `"react-native-markdown-display": "^7.0.0-alpha.2",` on React`18.1.0`, React Native `0.70.5` via the Expo command `npx create-expo-app --template` with typescript selected. 

```jsx
import React from "react";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useTheme } from "@react-navigation/native";

import Markdown from "react-native-markdown-display";

const copy = `# h1 Heading 8-)

**This is some bold text!**

This is normal text
`;

const MarkdownWrapper: React.FC<any> = ({ children }) => {
  const { colors } = useTheme();
  // @ts-ignore
  return <Markdown style={styles({ colors })}>{children}</Markdown>;
};

const App: () => React.ReactElement = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: "100%" }}
        >
          <MarkdownWrapper>{copy}</MarkdownWrapper>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export const styles = (props: any) =>
  StyleSheet.create({
    text: {
      color: props.colors.text,
    },
  });

export default App;
```

With text input 

```jsx
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import Markdown from "react-native-markdown-display";

const copy = `# h1 Heading 8-)

**This is some bold text!**

This is normal text
`;

const MarkdownWrapper: React.FC<any> = ({ children }) => {
  const { colors } = useTheme();
  // @ts-ignore
  return <Markdown style={styles({ colors })}>{children}</Markdown>;
};

const App: () => React.ReactElement = () => {
  const [text, onChangeText] = React.useState(copy);
  const { colors } = useTheme();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: "100%" }}
        >
          <TextInput
            multiline
            style={{ ...styles({colors}).input, color: colors.text }}
            onChangeText={onChangeText}
            value={text}
          />
          <MarkdownWrapper>{text}</MarkdownWrapper>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export const styles = (props: any) =>
  StyleSheet.create({
    text: {
      color: props.colors.text,
    },
    input: {
      height: 80,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

export default App;
```

### Props and Functions

The `<Markdown>` object takes the following common props:

| Property | Default | Required | Description                                                      
| --- | --- | --- | ---
| `children` | N/A | `true` | The markdown string to render, or the [pre-processed tree](#pre-processing)
| `style` | [source](https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js) | `false` | An object to override the styling for the various rules, [see style section below](#rules-and-styles) for more info
| `mergeStyle` | `true` | `false` | If true, when a style is supplied, the individual items are merged with the default styles instead of overwriting them
| `rules` | [source](https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js) | `false` | An object of rules that specify how to render each markdown item, [see rules section below](#rules) for more info
| `onLinkPress` | `import { Linking } from 'react-native';` and `Linking.openURL(url);` | `false` | A handler function to change click behaviour, [see handling links section below](#handling-links) for more info
| `debugPrintTree` | `false` | `false` | Will print the AST tree to the console to help you see what the markdown is being translated to


And some additional, less used options:

| Property | Default | Required | Description    
| --- | ---  | --- | ---
| `renderer` | `instanceOf(AstRenderer)` | `false` | Used to specify a custom renderer, you can not use the rules or styles props with a custom renderer.
| `markdownit` | `instanceOf(MarkdownIt)` | `false` | A custom markdownit instance with your configuration, default is `MarkdownIt({typographer: true})`
| `maxTopLevelChildren` | `null` | `false` | If defined as a number will only render out first `n` many top level children, then will try to render out `topLevelMaxExceededItem`
| `topLevelMaxExceededItem` | `<Text key="dotdotdot">...</Text>` | `false` | Will render when `maxTopLevelChildren` is hit. Make sure to give it a key!
| `allowedImageHandlers` | `['data:image/png;base64', 'data:image/gif;base64', 'data:image/jpeg;base64', 'https://', 'http://']` | `false` | Any image that does not start with one of these will have the `defaultImageHandler` value prepended to it (unless `defaultImageHandler` is null in which case it won't try to render anything)
| `defaultImageHandler` | `http://` | `false` | Will be prepended to an image url if it does not start with something in the `allowedImageHandlers` array, if this is set to null, it won't try to recover but will just not render anything instead.


# Syntax Support

<details><summary>Headings</summary>
<p>

```
  # h1 Heading 8-)
  ## h2 Heading
  ### h3 Heading
  #### h4 Heading
  ##### h5 Heading
  ###### h6 Heading
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-1.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-1.png"/>  

</p>
</details>


<details><summary>Horizontal Rules</summary>
<p>

```
  Some text above
  ___

  Some text in the middle

  ---

  Some text below
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-2.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-2.png"/>  


</p>
</details>



<details><summary>Emphasis</summary>
<p>

```
  **This is bold text**

  __This is bold text__

  *This is italic text*

  _This is italic text_

  ~~Strikethrough~~
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-4.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-4.png"/>  

</p>
</details>


<details><summary>Blockquotes</summary>
<p>

```
  > Blockquotes can also be nested...
  >> ...by using additional greater-than signs right next to each other...
  > > > ...or with spaces between arrows.
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-5.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-5.png"/>  

</p>
</details>


<details><summary>Lists</summary>
<p>

```
  Unordered

  + Create a list by starting a line with `+`, `-`, or `*`
  + Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
      * Ac tristique libero volutpat at
      + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
      - Nulla volutpat aliquam velit
  + Very easy!

  Ordered

  1. Lorem ipsum dolor sit amet
  2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
  3. Integer molestie lorem at massa

  Start numbering with offset:

  57. foo
  58. bar
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-6.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-6.png"/>  

</p>
</details>


<details><summary>Code</summary>
<p>
  
```
  Inline \`code\`

  Indented code

      // Some comments
      line 1 of code
      line 2 of code
      line 3 of code


  Block code "fences"

  \`\`\`
  Sample text here...
  \`\`\`

  Syntax highlighting

  \`\`\` js
  var foo = function (bar) {
    return bar++;
  };

  console.log(foo(5));
  \`\`\`
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-7.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-7.png"/>  

</p>
</details>


<details><summary>Tables</summary>
<p>

```
  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |

  Right aligned columns

  | Option | Description |
  | ------:| -----------:|
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-8.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-8.png"/>  

</p>
</details>

<details><summary>Links</summary>
<p>

```
  [link text](https://www.google.com)

  [link with title](https://www.google.com "title text!")

  Autoconverted link https://www.google.com (enable linkify to see)
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-9.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-9.png"/>  

</p>
</details>

<details><summary>Images</summary>
<p>

```
  ![Minion](https://octodex.github.com/images/minion.png)
  ![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

  Like links, Images also have a footnote style syntax

  ![Alt text][id]

  With a reference later in the document defining the URL location:

  [id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-10.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-10.png"/>  

</p>
</details>


<details><summary>Typographic Replacements</summary>
<p>

```
  Enable typographer option to see result.

  (c) (C) (r) (R) (tm) (TM) (p) (P) +-

  test.. test... test..... test?..... test!....

  !!!!!! ???? ,,  -- ---

  "Smartypants, double quotes" and 'single quotes'
```

| iOS | Android
| --- | ---
| <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/ios-3.png"/>  | <img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/android-3.png"/>  

</p>
</details>


<details><summary>Plugins and Extensions</summary>
<p>

  Plugins for **extra** syntax support can be added using any markdown-it compatible plugins - [see plugins](https://www.npmjs.com/browse/keyword/markdown-it-plugin) for documentation from markdown-it. An example for integration follows:


#### Step 1

Identify the new components and integrate the plugin with a rendered component. We can use the `debugPrintTree` property to see what rules we are rendering:


```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import blockEmbedPlugin from 'markdown-it-block-embed';

const markdownItInstance = 
    MarkdownIt({typographer: true})
      .use(blockEmbedPlugin, {
        containerClassName: "video-embed"
      });

const copy = `
# Some header

@[youtube](lJIrF4YjHfQ)
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
              debugPrintTree
              markdownit={markdownItInstance}
            >
              {copy}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;

```

In the console, we will see the following rendered tree:

```
body
-heading1
--textgroup
---text
-video
```

With the following error message:

```
Warning, unknown render rule encountered: video. 'unknown' render rule used (by default, returns null - nothing rendered) 
```


#### Step 2

We need to create the **render rules** and **styles** to handle this new **'video'** component


```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import blockEmbedPlugin from 'markdown-it-block-embed';

const markdownItInstance = 
    MarkdownIt({typographer: true})
      .use(blockEmbedPlugin, {
        containerClassName: "video-embed"
      });

const copy = `
# Some header

@[youtube](lJIrF4YjHfQ)
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
              debugPrintTree
              markdownit={markdownItInstance}
              style={{
                  video: {
                    color: 'red',
                  }
                }}
              rules={{
                  video: (node, children, parent, styles) =>{
                    // examine the node properties to see what video we need to render
                    console.log(node); // expected output of this is in readme.md below this code snip

                    return (<Text key={node.key} style={styles.video}>
                      Return a video component instead of this text component!
                    </Text>);
                  }
                   
                }}
            >
              {copy}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

And all of the video properties needed to render something meaningful are on the node, like this:

```
{type: "video", sourceType: "video", sourceInfo: {…}, sourceMeta: null, block: true, …}
  attributes: {}
  block: true
  children: []
  content: ""
  index: 1
  key: "rnmr_1720a98f540_video"
  markup: "@[youtube](lJIrF4YjHfQ)"
  sourceInfo:
    service: YouTubeService
      env: PluginEnvironment {md: MarkdownIt, options: {…}, services: {…}}
      name: "youtube"
      options:
        height: 390
        width: 640
      serviceName: "youtube"
      videoID: "lJIrF4YjHfQ"
      videoReference: "lJIrF4YjHfQ"
  sourceMeta: null
  sourceType: "video"
  tokenIndex: 5
  type: "video"
```

#### Other Debugging

You can do some additional debugging of what the markdown instance is spitting out like this:

```jsx
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import blockEmbedPlugin from 'markdown-it-block-embed';

const markdownItInstance = 
    MarkdownIt({typographer: true})
      .use(blockEmbedPlugin, {
        containerClassName: "video-embed"
      });

const copy = `
# Some header

@[youtube](lJIrF4YjHfQ)
`;

// this shows you the tree that is used by the react-native-markdown-display
const astTree = markdownItInstance.parse(copy, {});
console.log(astTree);

//this contains the html that would be generated - not used by react-native-markdown-display but useful for reference
const html = markdownItInstance.render(copy);
console.log(html);

```

The above code will output something like this:

```
astTree:

(4) [Token, Token, Token, Token]

0: Token {type: "heading_open", tag: "h1", attrs: null, map: Array(2), nesting: 1, …}
1: Token {type: "inline", tag: "", attrs: null, map: Array(2), nesting: 0, …}
2: Token {type: "heading_close", tag: "h1", attrs: null, map: null, nesting: -1, …}
3: Token {type: "video", tag: "div", attrs: null, map: Array(2), nesting: 0, …}

length: 4
```

```
html:


<h1>Some header</h1>
<div class="video-embed block-embed-service-youtube"><iframe type="text/html" src="//www.youtube.com/embed/lJIrF4YjHfQ" frameborder="0" width="640" height="390" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
```


</p>
</details>


<details><summary>All Markdown for Testing</summary>
<p>

This is all of the markdown in one place for testing that your applied styles work in all cases

```
Headings

  # h1 Heading 8-)
  ## h2 Heading
  ### h3 Heading
  #### h4 Heading
  ##### h5 Heading
  ###### h6 Heading


Horizontal Rules

  Some text above
  ___

  Some text in the middle

  ---

  Some text below


Emphasis

  **This is bold text**

  __This is bold text__

  *This is italic text*

  _This is italic text_

  ~~Strikethrough~~


Blockquotes

  > Blockquotes can also be nested...
  >> ...by using additional greater-than signs right next to each other...
  > > > ...or with spaces between arrows.


Lists

  Unordered

  + Create a list by starting a line with `+`, `-`, or `*`
  + Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
      * Ac tristique libero volutpat at
      + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
      - Nulla volutpat aliquam velit
  + Very easy!

  Ordered

  1. Lorem ipsum dolor sit amet
  2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
  3. Integer molestie lorem at massa

  Start numbering with offset:

  57. foo
  58. bar


Code

  Inline \`code\`

  Indented code

      // Some comments
      line 1 of code
      line 2 of code
      line 3 of code


  Block code "fences"

  \`\`\`
  Sample text here...
  \`\`\`

  Syntax highlighting

  \`\`\` js
  var foo = function (bar) {
    return bar++;
  };

  console.log(foo(5));
  \`\`\`


Tables

  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |

  Right aligned columns

  | Option | Description |
  | ------:| -----------:|
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |


Links

  [link text](https://www.google.com)

  [link with title](https://www.google.com "title text!")

  Autoconverted link https://www.google.com (enable linkify to see)


Images

  ![Minion](https://octodex.github.com/images/minion.png)
  ![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

  Like links, Images also have a footnote style syntax

  ![Alt text][id]

  With a reference later in the document defining the URL location:

  [id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


Typographic Replacements

  Enable typographer option to see result.

  (c) (C) (r) (R) (tm) (TM) (p) (P) +-

  test.. test... test..... test?..... test!....

  !!!!!! ???? ,,  -- ---

  "Smartypants, double quotes" and 'single quotes'

```

</p>
</details>


# Rules and Styles

### How to style stuff

Text styles are applied in a way that makes it much more convenient to manage changes to global styles while also allowing fine tuning of individual elements.

Think of the implementation like applying styles in CSS. changes to the `body` effect everything, but can be overwritten further down the style / component tree.

**Be careful when styling 'text':** the text rule is not applied to all rendered text, most notably list bullet points. If you want to, for instance, color all text, change the `body` style.


<details><summary>Example</summary>
<p>

<img src="https://github.com/iamacup/react-native-markdown-display/raw/master/doc/images/style-example.png"/> 

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Markdown from 'react-native-markdown-display';

const copy = `
This is some text which is red because of the body style, which is also really small!

\`\`\`
//This is a code block woooo

const cool = () => {
  console.log('????');
};
\`\`\`

and some more small text

# This is a h1
## this is a h2
### this is a h3
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
              style={{
                body: {color: 'red', fontSize: 10},
                heading1: {color: 'purple'},
                code_block: {color: 'black', fontSize: 14}
              }}
            >
              {copy}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

</p>
</details>

### Styles 

Styles are used to override how certain rules are styled. The existing implementation is [here](https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js)

**NOTE:** By default styles are merged with the existing implementation, to change this, see the `mergeStyle` prop

<details><summary>Example Implementation</summary>
<p>

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';

import Markdown from 'react-native-markdown-display';

const styles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  }
});

const copy = `
# h1 Heading 8-)
## h2 Heading 8-)
### h3 Heading 8-)

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
              style={styles}
            >
              {copy}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

</p>
</details>

### Rules

Rules are used to specify how you want certain elements to be displayed. The existing implementation is [here](https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js)

<details><summary>Example Implementation</summary>
<p>

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';

import Markdown from 'react-native-markdown-display';

const rules = {
    heading1: (node, children, parent, styles) =>
      <Text key={node.key} style={[styles.heading, styles.heading1]}>
        >> H1 TEXT HERE >> "{children}"
      </Text>,
    heading2: (node, children, parent, styles) =>
      <Text key={node.key} style={[styles.heading, styles.heading2]}>
        >> H2 TEXT HERE >> "{children}"
      </Text>,
    heading3: (node, children, parent, styles) =>
      <Text key={node.key} style={[styles.heading, styles.heading3]}>
        >> H3 TEXT HERE >> "{children}"
      </Text>,
};

const copy = `
# h1 Heading 8-)
## h2 Heading 8-)
### h3 Heading 8-)

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
              rules={rules}
            >
              {copy}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

</p>
</details>


### All rules and their associated styles:

| Render Rule | Style(s) |
| ------ | ----------- |
| `body` | `body` | 
| `heading1` | `heading1` |
| `heading2` | `heading2` |
| `heading3` | `heading3` |
| `heading4` | `heading4` |
| `heading5` | `heading5` |
| `heading6` | `heading6` | 
| `hr` | `hr` | 
| `strong` | `strong` | 
| `em` | `em` | 
| `s` | `s` | 
| `blockquote` | `blockquote` | 
| `bullet_list` | `bullet_list` | 
| `ordered_list` | `ordered_list` | 
| `list_item` | `list_item` - This is a special case that contains a set of pseudo classes that don't align to the render rule: `ordered_list_icon`, `ordered_list_content`, `bullet_list_icon`, `bullet_list_content` | 
| `code_inline` | `code_inline` | 
| `code_block` | `code_block` | 
| `fence` | `fence` | 
| `table` | `table` | 
| `thead` | `thead` | 
| `tbody` | `tbody` | 
| `th` | `th` | 
| `tr` | `tr` | 
| `td` | `td` | 
| `link` | `link` | 
| `blocklink` | `blocklink` | 
| `image` | `image` | 
| `text` | `text` | 
| `textgroup` | `textgroup` | 
| `paragraph` | `paragraph` | 
| `hardbreak` | `hardbreak` | 
| `softbreak` | `softbreak` | 
| `pre` | `pre` | 
| `inline` | `inline` | 
| `span` | `span` | 

# Handling Links

Links, by default, will be handled with the `import { Linking } from 'react-native';` import and `Linking.openURL(url);` call.

It is possible to overwrite this behaviour in one of two ways:

<details><summary>onLinkPress Callback</summary>
<p>

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Markdown from 'react-native-markdown-display';

const copy = `[This is a link!](https://github.com/iamacup/react-native-markdown-display/)`;

const onLinkPress = (url) => {
    if (url) {
      // some custom logic
      return false;
    }
    
    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true
  }

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
          <Markdown
             onLinkPress={onLinkPress}
          >
            {copy}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

</p>
</details>

<details><summary>Using a Custom Rule</summary>
<p>

You will need to overwrite one or both of `link` and `blocklink`, the original defenitions can be [found here](https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js)

Something like this with `yourCustomHandlerFunctionOrLogicHere`:

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';

import Markdown from 'react-native-markdown-display';

const copy = `[This is a link!](https://github.com/iamacup/react-native-markdown-display/)`;

const rules = {
  link: (node, children, parent, styles) => {
    return (
      <Text key={node.key} style={styles.link} onPress={() => yourCustomHandlerFunctionOrLogicHere(node.attributes.href) }>
        {children}
      </Text>
    );
  },
};

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
          <Markdown
             rules={rules}
          >
            {copy}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

</p>
</details>


# Disabling Specific Types of Markdown

You can dissable any type of markdown you want, which is very useful in a mobile environment, by passing the markdownit property like below. Note that for convenience we also export the `MarkdownIt` instance so you don't have to include it as a project dependency directly just to remove some types of markdown.

This example will stop images and links.

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';

import Markdown, { MarkdownIt } from 'react-native-markdown-display';

const copy = `
# This heading will show with formatting

[but this link will just](be displayed as this text)
`;

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
              markdownit={
                MarkdownIt({typographer: true}).disable([ 'link', 'image' ])
              }
            >
              {copy}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```

A full list of things you can turn off is [here](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js)


### Pre Processing

It is possible to need to pre-process the data outside of this library ([related discussion here](https://github.com/iamacup/react-native-markdown-display/issues/79)). As a result, you can pass an AST tree directly as the children like this:

```jsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';

import Markdown, { MarkdownIt, tokensToAST, stringToTokens } from 'react-native-markdown-display';

const markdownItInstance = MarkdownIt({typographer: true});

const copy = `
# Hello this is a title

This is some text with **BOLD!**
`;

const ast = tokensToAST(stringToTokens(copy, markdownItInstance))

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{height: '100%'}}
        >
            <Markdown
            >
              {ast}
            </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
```


### Other Notes

This is a fork of [react-native-markdown-renderer](https://github.com/mientjan/react-native-markdown-renderer), a library that unfortunately has not been updated for some time so i took all of the outstanding pull requests from that library and tested + merged as necessary.
