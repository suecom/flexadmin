# Flex Admin console

The Flex admin web application is a day-to-day Flex marketplace operation tool. It can NOT do all the things you can in the Sharetribe provided Console application (like allocate API keys, modify transaction processses, change email templates, etc.), but for 'operating' a market place it is more flexible.

It lays focus on entities in the marketplaces (users, listings, transactions, etc.) and the relationships between them. I.e. a user's listings, a listings transactions, etc. There's a video demonstrating Flex admin at: https://www.youtube.com/watch?v=OZTiHDnAX9M

This project is not endorsed, supported, or approved by Sharetribe. All design, code, bugs, problems are ours. Sharetribe is in no way responsible for this project, nor the maintenance and support of it. 

This is a Flex Integration SDK application, that also uses the Marketplace SDK for authentication (only). The application is a little more ambitious than the Integration SDK examples, but relies entirely on the same (no native calls to the API endpoints). 

Styling is taken from CoreUIs AdminLTE template, and I apologise in advance for my lack of UI design skills. Maybe you could improve it?

## Quick start

You will need:

By using Sharetribe's backend, you will need both your REACT_APP_FLEX_INTEGRATION_CLIENT_ID and REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET keys in .env file for development/testing. You will also need your corresponding REACT_APP_SHARETRIBE_SDK_CLIENT_ID to login (the Marketplace  SDK is used for authentication)

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

To 'login' you need a Sharetribe user with an attribute in the privateData structure: attributes.profile.protectedData.admin == true (boolean, not string). Do this in the Sharetribe console. Once you've done it for one user, you can use Flex Admin (this) to enrol other users!

## Usage

BEAWARE that the search filter is used in navgation between entities. Therefore, if a too restrictive entry is left in the search bar, no documents for otehr entities will be seen. Clear the search bar!

SPEED, the first time you open the app, all the users, listings, transactions, reviews, messages, and images will be loaded. This could take time!!! After the initial load, only the first page (100) of each entity is refreshed (every REACT_APP_REFRESH_INTERVAL seconds). This does mean that some older entities will not be shown as updated in real-time (require a refresh). It's a speed/network load trade-off you can change.

## Getting started with customization

I've tried to keep the API use generic. The app doesn't depend on any custom data in our marketplace as the editor works on the raw JSON (public/protected/private/mete data structures). Still, you probably want to 'brand' the applcation (as I've done for OldenCars) and change some terms.

It helps if you understand how Flex is architected. Read the FTW customization guides and the Flex Integration SDK documentation. 

Some familarity with javascript/React/Redux apps will be helpful in significantly customizing this template.

## Documentation

See the Flex Docs site: https://www.sharetribe.com/docs/ and https://sharetribe.github.io/flex-sdk-js/index.html to understand what we're attempting here.

## License

This project is licensed under the terms of the MIT license.

