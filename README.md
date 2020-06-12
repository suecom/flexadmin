# flex admin console

This project is not endorsed, supported, or approved by Sharetribe. All design, code, bugs, problems are not in anyway Sharetribe's. Sharetribe is in no way responsible for this project, nor the maintenance and support of it. 

This is a Flex Integration SDK application. A little more ambitious than the Sharetribe SDK examples, it relies on the same backend API. This is an alternate admin console. 

The motivation is to allow the use of the FFS backend in production. In effect, this is the FFS console app. Hopefully you'll prefer it to the Sharetribe console, and can use it instead of, or as well as?

Styling is taken from CoreUIs AdminLTE template, and I apologise in advance for my lack of UI design skills. Maybe you could improve it?

NOTE: Some of the schema editing will NOT work when using the Sharetribe server
(listing's state/deleted for example), as these resources are not in the original 'update' API. They should use the open/close/approve APIs - TODO

## Quick start (no such thing!)

You will need:

If you are using Sharetribe's backend (as oppose to FFS), you will need both the REACT_APP_FLEX_INTEGRATION_CLIENT_ID and REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET keys in .env.*. In FFS these are ignored (make them up).

If you're using FFS, you need to set REACT_APP_FLEX_INTEGRATION_BASE_URL to your FFS server's address (else it will defuault to Sharetribe's)

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

## Getting started with customization

I've tried to keep the API use generic. The app doesn't depend on any custom data in our marketplace as the editor works on the raw JSON (public/protected/private/mete data structures). Still, you probably want to 'brand' the applcation (as I've done for OldenCars) and change some terms.

It helps if you understand how Flex is architected. Read the FTW customization guides and the Flex Integration SDK documentation. 

Some familarity with javascript/React/Redux apps will be helpful in significantly customizing this template.

## Documentation

See the Flex Docs site: https://www.sharetribe.com/docs/ to understand what we're attempting here. Note we do not have a Flex console nor CLI implementation. Backend management is currently limited to the MongoDB shell :-)

## License

This project is licensed under the terms of the MIT license.

