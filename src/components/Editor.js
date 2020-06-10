import React, { Component } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

import listingApi from '../api/listingApi';
import userApi from '../api/userApi';
import { UUID } from './../types.js';

import './Editor.css';

const diff = (obj1, obj2) => {
    const result = {};

    if (Object.is(obj1, obj2)) {
   			return undefined;
    }

    if (!obj2 || typeof obj2 !== 'object') {
    		return obj2;
    }

    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
		    result[key] = obj2[key];
        }

        if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        	const value = diff(obj1[key], obj2[key]);
            
            if (value !== undefined) {
            	result[key] = value;
            }
        }
    });

    return result;
}

const hasValues = (obj) => {
    var RV = false;

    for(const k in obj) {
        // Ignore prototypes...
        if(!obj.hasOwnProperty(k)) continue;

        if(typeof obj[k] === 'object') {
            RV = RV | hasValues(obj[k])
        }
        else {
            RV = true;
        }
    }

    return RV;
}

const createUpdates = (obj) => {
	var RV = {}; 
  
	for(const key in obj) {     
  		// Ignore prototypes...
        if(!obj.hasOwnProperty(key)) continue;
        
        switch(key) {
            // End names...
            case 'banned':
            case 'deleted':
            case 'emailVerified':       
            case 'firstName':
            case 'lastName':
            case 'displayName':
            case 'bio':
            case 'title':
            case 'description':
            case 'price':
            case 'amount':
            case 'state':
            case 'publicData':
            case 'privateData':
            case 'protectedData':
            case 'metadata':
                if(typeof obj[key] === 'object') {
                    if(hasValues(obj[key])) {
                        //const keyStr = root === '' ? key : root+'.'+key;

                        RV[key] = obj[key]
                    }
                }
                else {
                    //const keyStr = root === '' ? key : root+'.'+key;

          			RV[key] = obj[key]
                }				
                break;
            default:
            	if(typeof obj[key] === 'object') {
                    //const keyStr = root === '' ? key : root+'.'+key;
                	const n = createUpdates(obj[key])
                    
                    RV = Object.assign(RV, n)
                }
                break;
        }    
    }

    return RV;
}

const getJson = (json) => {
    var newData = JSON.parse(JSON.stringify(json));

    delete newData['_id'];
    delete newData['listings'];
    delete newData['clients'];
    delete newData['rentals'];
    delete newData['reviews'];
    delete newData['messages'];
    delete newData['enquires'];
    delete newData['author'];
    delete newData['authorId'];
    delete newData['authorEmail'];
    delete newData['subject'];
    delete newData['subjectId'];
    delete newData['subjectEmail'];
    delete newData['owner'];
    delete newData['ownerId'];
    delete newData['ownerEmail'];
    delete newData['provider'];
    delete newData['providerId'];
    delete newData['providerEmail'];
    delete newData['user'];
    delete newData['userId'];
    delete newData['userEmail'];
    delete newData['origin'];
    delete newData['customer'];
    delete newData['customerId'];
    delete newData['customerEmail'];
    delete newData['listing'];
    delete newData['listingId'];
    delete newData['createdAt'];
    delete newData['updatedAt'];
    delete newData['__v'];
    delete newData['url'];
    newData.attributes.createdAt = (json.attributes.createdAt instanceof Object) ? json.attributes.createdAt.toLocaleDateString() + ' ' + json.attributes.createdAt.toLocaleTimeString() : json.attributes.createdAt;

    return newData;
}

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
                'createdAt': { 'type': 'string' },
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
                        'data' : { 'type': [ 'null', 'object'] }
                    },
                    'additionalProperties': false,
                },
                'stripeAccount': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'object'] }
                    },
                    'additionalProperties': false,
                },
                'stripeCustomer': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'object'] }
                    },
                    'additionalProperties': false,
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
                'createdAt': { 'type': 'string' },
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
                        'data' : { 'type': [ 'null', 'object'] }
                    },
                    'additionalProperties': false,
                },
                'images': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'array'] }
                    },
                    'additionalProperties': false,
                },
                'additionalProperties': false,
            },
            'required': [ 'author', 'images' ],
            'additionalProperties': false     
        }    
    },    
    'required': [ 'id', 'type', 'attributes', 'relationships' ],
    'additionalProperties': false
}

const transaction = {
    'title': 'transaction',
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
        'type': { 'readonly': true, 'type': 'string', 'const': 'transaction' },
        'attributes': {
            'type': 'object',
            'properties': {
                'createdAt': { 'type': 'string' },
                'processName': { 'type': 'string', 'const': 'preauth-with-daily-booking' },
                'processVersion': { 'type': 'integer', 'const': 1 },
                'lastTransition': { 'type': 'string' },
                'lastTransitionedAt': { 'type': 'string' },
                'payinTotal': {
                    'type': 'object',
                    'readOnly': true,
                    'properties': {
                        '_sdkType': { 'type': 'string', 'const': 'Money' },
                        'amount': { 'type': [ 'number', 'null' ] },
                        'currency': { 'type': 'string' }
                    },
                    'additionalProperties': false, 
                },
                'payoutTotal': {
                    'type': 'object',
                    'readOnly': true,
                    'properties': {
                        '_sdkType': { 'type': 'string', 'const': 'Money' },
                        'amount': { 'type': [ 'number', 'null' ] },
                        'currency': { 'type': 'string' }
                    },
                    'additionalProperties': false,
                },
                'lineItems': { 
                    'type': 'array',
                },
                'transitions': {
                    'type': 'array',
                },       
                'protectedData': {
                    'type': 'object',
                    'properties': {
                    }
                }              
            },
            'additionalProperties': false,
            'required': [ 'createdAt', 'processName', 'processVersion', 'lastTransition', 'lastTransitionedAt', 'payinTotal', 'payoutTotal', 'lineItems', 'transitions' ],
        },
        'relationships' : {
            'readonly': true,
            'type': 'object',
            'properties': {
                'listing': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': 'object' }
                    },
                    'additionalProperties': false,
                },
                'provider': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'object' ] }
                    },
                    'additionalProperties': false,
                },
                'customer': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'object' ] }
                    },
                    'additionalProperties': false,
                },
                'booking': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'object' ] }
                    },
                    'additionalProperties': false,
                },
                'reviews': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'array' ] }
                    },
                    'additionalProperties': false,
                },
                'messages': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': [ 'null', 'array' ] }
                    },
                    'additionalProperties': false,
                },
                'additionalProperties': false,
            },
            'required': [ 'listing', 'provider', 'customer', 'reviews', 'messages' ],
            'additionalProperties': false     
        }    
    },    
    'required': [ 'id', 'type', 'attributes', 'relationships' ],
    'additionalProperties': false
}

const review = {
    'title': 'review',
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
        'type': { 'readonly': true, 'type': 'string', 'const': 'review' },
        'attributes': {
            'type': 'object',
            'properties': {
                'createdAt': { 'type': 'string' },
                'type': { 'type': 'string' },
                'state': { 'type': 'string' },
                'rating': { 'type': 'integer' },
                'content': { 'type': 'string' },
                'deleted': { 'type': 'boolean' },         
            },
            'additionalProperties': false,
            'required': [ 'createdAt', 'type', 'state', 'rating', 'content', 'deleted' ],
        },
        'relationships' : {
            'readonly': true,
            'type': 'object',
            'properties': {
                'author': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': 'object' }
                    },
                    'additionalProperties': false,
                },
                'listing': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': 'object' }
                    },
                    'additionalProperties': false,
                },
                'subject': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': 'object' }
                    },
                    'additionalProperties': false,
                },
                'additionalProperties': false,
            },
            'required': [ 'listing', 'author', 'subject' ],
            'additionalProperties': false     
        }    
    },    
    'required': [ 'id', 'type', 'attributes', 'relationships' ],
    'additionalProperties': false
}

const message = {
    'title': 'message',
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
        'type': { 'readonly': true, 'type': 'string', 'const': 'message' },
        'attributes': {
            'type': 'object',
            'properties': {
                'createdAt': { 'type': 'string' },
                'content': { 'type': 'string' },      
            },
            'additionalProperties': false,
            'required': [ 'createdAt', 'content' ],
        },
        'relationships' : {
            'readonly': true,
            'type': 'object',
            'properties': {
                'sender': {
                    'readonly': true,
                    'type': 'object',
                    'properties': {
                        'data' : { 'type': 'object' }
                    },
                    'additionalProperties': false,
                },
                'additionalProperties': false,
            },
            'required': [ 'sender' ],
            'additionalProperties': false     
        }    
    },    
    'required': [ 'id', 'type', 'attributes', 'relationships' ],
    'additionalProperties': false
}

const image = {
    'title': 'image',
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
        'type': { 'readonly': true, 'type': 'string', 'const': 'image' },
        'attributes': {
            'type': 'object',
            'properties': {
                'variants': { 
                    'type': 'object',
                    'properties': {
                        'square-small': { 'type': 'object' },
                        'square-small2x': { 'type': 'object' },
                        'default': { 'type': 'object' },
                        'landscape-crop': { 'type': 'object' },
                        'landscape-crop2x': { 'type': 'object' },
                        'landscape-crop4x': { 'type': 'object' },
                        'landscape-crop6x': { 'type': 'object' },
                        'scaled-small': { 'type': 'object' },
                        'scaled-medium': { 'type': 'object' },
                        'scaled-large': { 'type': 'object' },
                        'scaled-xlarge': { 'type': 'object' }
                    },
                    'additionalProperties': false,
                    'required': [ 'square-small', 'square-small2x' ]
                },
                'additionalProperties': false,
            },
            'additionalProperties': false,
            'required': [ 'variants' ],
        }
    },    
    'required': [ 'id', 'type', 'attributes' ],
    'additionalProperties': false
}

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            container: null,
            json: props.data,
            schema: props.validSchema,
            editor: null,
            button: null,
            errors: 0,
        }

        this.onSave = this.onSave.bind(this);
        this.onValidationError = this.onValidationError.bind(this);
        this.onChange = this.onChange.bind(this);
    };
    
    onEditable = (node) => {
        switch (node.field) {
            case 'id':
            case 'type':
            case '_sdkType':
            case 'uuid':
            case 'profileImage':
            case 'stripeAccount':
            case 'relationships':
            case 'stripeConnected':
            case 'stripeCustomer':
            case 'data':
            case 'availabilityPlan':
            case 'currency':
            case 'author':
            case 'images':
            case 'listing':
            case 'email':
            case 'createdAt':
            case 'geolocation':
            case 'abbreviatedName':
            case 'lat':
            case 'lng':
            case 'pendingEmail':
            case 'payinTotal':
            case 'payoutTotal':
            case 'processName':
            case 'processVersion':
            case 'lastTransition':
            case 'lastTransitionedAt':
            case 'lineItems':
            case 'transitions':
            case 'content':
            case 'width':
            case 'height':
            case 'name':
            case 'url':
            case 'variants':
                return false
            case 'rating':
            case 'attributes':
            case 'banned':
            case 'deleted':
            case 'emailVerified':       
            case 'profile':
            case 'firstName':
            case 'lastName':
            case 'displayName':
            case 'bio':
            case 'title':
            case 'description':
            case 'price':
            case 'amount':
            case 'state':
            case 'publicData':
            case 'privateData':
            case 'protectedData':
            case 'metadata':
                return {
                    field: false,
                    value: true
                }
            default:
                return true
        }
    }

    onSave = (uuid, type) => {
        var api;
        const o1 = JSON.parse(JSON.stringify(getJson(this.state.json)));
        const o2 = this.state.editor.get();

        // Find any differences and create an API compatable list
        const obj = diff(o1, o2);
        const updates = createUpdates(obj);

        updates['id'] = new UUID(uuid)
        switch(type) {
            case 'listing':
                api = new listingApi();
                api.updateListing(updates).then(res => {
                    this.setState({ json: this.state.editor.get() })
                    alert("Update succeeded");
                })
                .catch(error => {
                    alert("update FAILED");
                })
                break;
            case 'user':
                api = new userApi();
                api.updateUser(updates).then(res => {
                    this.setState({ json: this.state.editor.get() })
                    alert("Update succeeded");
                })
                .catch(error => {
                    alert("update FAILED");
                })
                break;
            default:
                break;
        }

        console.log(updates)
    }

    onValidationError = (errors) => {
        if(this.state.json.type === 'listing' || this.state.json.type === 'user') {
            var button = this.state.button;

            this.setState({ errors: errors.length } );
            if(errors.length > 0) {
                button.disabled = true;
            }
            else {
                const s1 = JSON.stringify(getJson(this.state.json));
                const s2 = JSON.stringify(this.state.editor.get());
            
                if(s1 !== s2) {
                    button.disabled = false;
                }
            }
        }
    }

    onChange = () => {
        if(this.state.json.type === 'listing' || this.state.json.type === 'user') {
            var button = this.state.button;
            const s1 = JSON.stringify(getJson(this.state.json));
            const s2 = JSON.stringify(this.state.editor.get());

            if(s1 !== s2 && this.state.errors === 0) {
                button.disabled = false;
            }
            else {
                button.disabled = true;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Editor not instantiated
        if(nextState.container !== null && nextState.editor === null) {
            return true;
        }
        
        // Json changed
        if(nextState.json !== this.state.json) {
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        var editor = this.state.editor;

        if(this.state.container !== null && this.state.editor == null) {
            const schemas = {
                'user': user,
                'listing': listing,
                'transaction': transaction,
                'review': review,
                'message': message,
                'image': image,
            };
            const options = {
                mode: 'tree',
                schema: schemas[this.state.schema],
                onEditable: this.onEditable,
                onChange: this.onChange,
                onValidationError: this.onValidationError,
                name: this.state.schema,
                history: true,
                navigationBar: false,
                enableSort: false,
                enableTransform: false,
                statusBar: false,
            };

            editor = new JSONEditor(this.state.container, options)
            this.setState({ editor: editor });   
        }

        if(this.state.button === null && this.state.container !== null && 
                this.state.container.getElementsByClassName("jsoneditor-menu").length > 0) {
            const but = document.createElement('button');
            but.type = 'button';
            but.className = 'jsoneditor-modes jsoneditor-separator';
            but.innerHTML = 'Save';
            but.title = 'Save';
            but.disabled = true;
            but.onclick = (e) => {
                this.onSave(this.state.json.id.uuid, this.state.json.type);
            }
            this.setState({ button: but })

            const frame = document.createElement('div');
            frame.className = 'jsoneditor-modes';
            frame.style.position = 'relative';
            frame.appendChild(but);
        
            var menu = this.state.container.getElementsByClassName("jsoneditor-menu")[0];
            menu.appendChild(frame);
        }

        if(this.state.json !== null && editor !== null) {
            editor.set(getJson(this.state.json));
        }
    }
  
    componentWillUnmount() {
        if(this.state.editor !== null) {
            this.state.editor.destroy();
        }
    }

    render() {
        return (
            <div className="jsoneditor-react-container" ref={ elem => this.setState( {container: elem } ) } />
        )
    } 
}

export default Editor; 
