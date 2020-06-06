import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const JSONEditor = ({ data }) => {
    return (
        <Editor
            allowedModes = {['text','code','form','view','tree','preview']}
            mode = 'tree'
            history = { true }
            value = { data }
            //onChange={this.handleChange}
        />
    );
}

export default JSONEditor;
