# flex admin console

This project is not endorsed, supported, or approved by Sharetribe. All design, code, bugs, problems are not in anyway Sharetribe's. Sharetribe is in no way responsible for this project, nor the maintenance and support of it. 

This is a Flex Integration SDK application. A little more ambitious than the Sharetribe SDK examples, it relies entirely on the Flex Integration SDK. This is an alternate admin console, but obviously can't do all the things the console can (generate API keys, etc). 

Styling is taken from CoreUIs AdminLTE template, and I apologise in advance for my lack of UI design skills. Maybe you could improve it?

## Quick start (no such thing!)

You will need:

By using Sharetribe's backend, you will need both the REACT_APP_FLEX_INTEGRATION_CLIENT_ID and REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET keys in .env.*. You will also need your corresponding REACT_APP_SHARETRIBE_SDK_CLIENT_ID to login (the marketplace Flex SDK is uded for authorization)

We used create-react-app to bootstrap this app, so 'npm run start' is all you need to kick it off locally (at localhost:3000). If you want to deploy the build to heroku, do the following (in your local repository folder):

    npm run build

If you've already created the heroku app do:

    heroku git:remote -a <app-name>
    heroku buildpacks:set mars/create-react-app

Or you can do it all from the CLI such: 

    heroku create <app-name> --buildpack mars/create-react-app

Then simple deploy (and repeat after you make changes to the master branch):

    git push heroku master

You now have to set the REACT_APP_ environment variables for the app (see above) in the heroku app using the webportal or CLI. The app will be assecible at https://<app-name>.herokuapp.com after setting the variables and re-starting.

To login we use the Marketplace authentication API. YES, we're using BOTH SDKs in the same project! The reason for this is I didnt want to involve another auth server when we already have one! As the Integration API is hard-coded to the cleint IDs, this provides no protection when exposed externally (on the Internet). 

So, to 'login' you need a Sharetribe user with an additional attribute in the privateData structure: attributes.profile.protectedData.admin == true (boolean, not string). Do this in the console. Once you've done it for one user, you can use Flex Admin (this) to enrol other users!

## Getting started with customization

I've tried to keep the API use generic. The app doesn't depend on any custom data in our marketplace as the editor works on the raw JSON (public/protected/private/mete data structures). Still, you probably want to 'brand' the applcation (as I've done for OldenCars) and change some terms.

It helps if you understand how Flex is architected. Read the FTW customization guides and the Flex Integration SDK documentation. 

Some familarity with javascript/React/Redux apps will be helpful in significantly customizing this template.

## Documentation

See the Flex Docs site: https://www.sharetribe.com/docs/ to understand what we're attempting here. Note we do not have a Flex console nor CLI implementation. Backend management is currently limited to the MongoDB shell :-)

## License

This project is licensed under the terms of the MIT license.

