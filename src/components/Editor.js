import React, { useState, useEffect, useCallback } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
//import Ajv from 'ajv';

import './Editor.css';

const user = {
    'title': 'User',
    'type': 'object',
    'properties': {
        'id': {
            'type': 'object',
            'readOnly': true,
            'properties': {
                '_sdkType': { 'type': 'string', 'const': 'UUID' },
                'uuid': { 'type': 'string' }
            }
        },
        'type': { 'readonly': true, 'type': 'string', 'const': 'user' },
        'attributes': {
            'type': 'object',
            'properties': {
                'banned': { 'type': 'boolean' },
                'deleted': { 'type': 'boolean' },
                'emailVerified': { 'type': 'boolean' },
                'stripeConnected': { 'type': 'boolean' },
                'pendingEmail': { 'type': [ 'null', 'string' ] },
                'email': { 'type': 'string', 'format': 'email' },
                'createdAt': {
                    'type': 'object',
                    'properties': {

                    }
                },
                'profile': {
                    'type': 'object',
                    'properties': {
                        'displayName': { 'type': 'string' },
                        'firstName': { 'type': 'string' },
                        'lastName': { 'type': 'string' },
                        'abbreviatedName': { 'type': 'string', 'maxLength': 2 },
                        'bio': { 'type': [ 'null', 'string'] },
                        'publicData': {
                            'type': 'object',
                            'properties': {
                            }
                        },
                        'protectedData': {
                            'type': ['object','null'],
                            'properties': {
                            }
                        },
                        'privateData': {
                            'type': ['object','null'],
                            'properties': {
                            }
                        },
                        'metadata': {
                            'type': 'object',
                            'properties': {
                            }
                        },
                    },
                    'required': [ 'displayName', 'firstName', 'lastName', 'abbreviatedName', 'bio' ],
                    'additionalProperties': false,
                }              
            },
            'required': [ 'createdAt', 'email', 'banned', 'deleted', 'emailVerified', 'profile' ],
            'additionalProperties': false,
        },
        'relationships' :{
            'readonly': true,
            'type': 'object',
            'properties': {
                'profileImage': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                    }
                },
                'stripeAccount': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                    }
                }
            },
            'additionalProperties': false,
        },
    },    
    'required': [ 'id', 'type', 'attributes', 'relationships' ],
    'additionalProperties': false,
}

const listing = {
    'title': 'listing',
    'type': 'object',
    'properties': {
        'id': {
            'type': 'object',
            'readOnly': true,
            'properties': {
                '_sdkType': { 'type': 'string', 'const': 'UUID' },
                'uuid': { 'type': 'string' }
            }
        },
        'type': { 'readonly': true, 'type': 'string', 'const': 'listing' },
        'attributes': {
            'type': 'object',
            'properties': {
                'title': { 'type': 'string' },
                'description': { 'type': 'string' },
                'deleted': { 'type': 'boolean' },
                'state': { 'type': 'string' },
                'createdAt': {
                    'type': 'string',
                    
                },
                'geolocation': {
                    'type': 'object',
                    'properties': {
                        '_sdkType': { 'type': 'string', 'const': 'LatLng' },
                        'lat': { 'type': 'number' },
                        'lng': { 'type': 'number' }
                    }
                },
                'availabilityPlan': {
                    'type': [ 'object', 'null'],
                    'properties': {
                    }
                },
                'price': {
                    'type': 'object',
                    'properties': {
                        '_sdkType': { 'type': 'string', 'const': 'Money' },
                        'amount': { 'type': 'number' },
                        'currency': { 'type': 'string', 'const': 'GBP' }
                    }
                },
                'publicData': {
                    'type': 'object',
                    'properties': {
                    }
                },
                'privateData': {
                    'type': 'object',
                    'properties': {
                    }
                },
                'protectedData': {
                    'type': 'object',
                    'properties': {
                    }
                },
                'metadata': {
                    'type': 'object',
                    'properties': {
                    }
                }           
            },
            'required': [ 'title', 'description', 'deleted', 'state', 'createdAt', 'geolocation', 'availabilityPlan', 'price', 'publicData' ],
        },
        'relationships' : {
            'readonly': true,
            'type': 'object',
            'properties': {
                'author': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                    }
                },
                'images': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                    }
                }
            },
            'required': [ 'author', 'images' ],
            'additionalProperties': false     
        }    
    },    
    'required': [ 'id', 'type', 'attributes', 'relationships' ],
    'additionalProperties': false
}

const Editor = ( { data, validSchema } ) => {
    const [ container, setContainer ] = useState(null);
    const [ jsonEditor, setEditor ] = useState(null);
    const [ json ] = useState(data);
    const [ schema ] = useState(validSchema)
    //const ajv = new Ajv({ allErrors: true, verbose: true });
    const schemas = {
        'user': user,
        'listing': listing,
    }

    const onEditable = useCallback((node) => {
        switch (node.field) {
            case 'id':
            case 'type':
            case '_sdkType':
            case 'uuid':
            case 'profileImage':
            case 'stripeAccount':
            case 'relationships':
            case 'stripeConnected':
            case 'data':
            case 'availabilityPlan':
            case 'currency':
            case 'author':
            case 'images':
                return false
            case 'attributes':
            case 'banned':
            case 'deleted':
            case 'createdAt':
            case 'email':
            case 'emailVerified':
            case 'pendingEmail':
            case 'profile':
            case 'firstName':
            case 'lastName':
            case 'abbreviatedName':
            case 'displayName':
            case 'bio':
            case 'publicData':
            case 'privateData':
            case 'protectedData':
            case 'metadata':
            case 'title':
            case 'description':
            case 'geolocation':
            case 'price':
            case 'lat':
            case 'lng':
            case 'amount':
            case 'state':
                return {
                    field: false,
                    value: true
                }
            default:
                return true
        }
    }, [])

    const onTimeTag = ({ field, value, path }) => {
        console.log(value)
    }

    const onTimeFormat = ({ field, value, path }) => {
        console.log(value)
    }

    useEffect((props) => {
        if(jsonEditor === null && container !== null) {
            const options = {
                mode: 'tree',
                modes: [ 'code', 'view', 'tree' ],
                schema: schemas[schema],
                onEditable: onEditable,
                name: schema,
                history: true,
                navigationBar: false,
                enableTransform: false,
                statusBar: false,
                timestampTag: onTimeTag,
                timestampFormat: onTimeFormat,
            }
    
            setEditor(new JSONEditor(container, options))
        }

        if(jsonEditor !== null) {
            var newData = Object.assign({}, json, {});

            delete newData['_id']
            delete newData['listings']
            delete newData['clients']
            delete newData['rentals']
            delete newData['reviews']
            delete newData['enquires']
            delete newData['owner']
            delete newData['ownerId']
            delete newData['ownerEmail']

            jsonEditor.update(newData)
        }

        return (() => jsonEditor !== null ? jsonEditor.destroy() : null )
    }, [ schema, schemas, json, container, jsonEditor, onEditable ])
    
    return (
        <div className="jsoneditor-react-container" ref={ elem => setContainer(elem) } />
    );
}

export default Editor; 
