import React from 'react';
import { JsonEditor as Editor } from '../jsoneditor-react';
import Ajv from 'ajv';

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
                            'type': 'object',
                            'properties': {
                            }
                        },
                        'privateData': {
                            'type': 'object',
                            'properties': {
                            }
                        },
                        'metadata': {
                            'type': 'object',
                            'properties': {
                            }
                        },
                    },
                    'required': [ 'displayName', 'firstName', 'lastName', 'abbreviatedName', 'bio', 'publicData', 'protectedData', 'privateData', 'metadata' ],
                    'additionalProperties': false,
                }              
            },
            'required': [ 'createdAt', 'email', 'banned', 'deleted', 'emailVerified', 'stripeConnected', 'profile', 'pendingEmail' ],
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
                    'type': 'object',
                    'properties': {

                    }
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
                'metadata': {
                    'type': 'object',
                    'properties': {
                    }
                }           
            },
            'required': [ 'title', 'description', 'deleted', 'state', 'createdAt', 'geolocation', 'availabilityPlan', 'price', 'publicData', 'privateData', 'metadata' ],
            'additionalProperties': false
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

const JSONEditor = ( { data, schema } ) => {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    const schemas = {
        'user': user,
        'listing': listing,
    }

    const onEditable = (node) => {
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
    }

    const newJSON = (json) => {
        console.log(json)
    }

    // Remove working values from editor
    var newdata = Object.assign({}, data, {});
    delete newdata['listings']
    delete newdata['clients']
    delete newdata['rentals']
    delete newdata['reviews']
    delete newdata['enquires']
    delete newdata['owner']
    delete newdata['ownerId']
    delete newdata['ownerEmail']

    return (
        <Editor 
            name = { schema }
            allowedModes = { [ 'code', 'view', 'tree' ] }
            mode = 'tree'
            history = { true }
            value = { newdata }
            ajv = { ajv }
            schema = { schemas[schema] }
            onEditable = { onEditable }
            onChange = { newJSON }
            navigationBar = { false }
            enableTransform = { false }
            statusBar = { false }
        />
    );
}

export default JSONEditor; 
