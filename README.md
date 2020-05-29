# flex admin console

This is a Flex Integration SDK application. A little more ambitious than the SDK examples, it relies on the same backend API.

This is an alternate admin console built on the Flex integration SDK. The motivation is to allow the use of FFS backend API provider in production. In effect, this is the FFS console app. Hopefully you'll prefer it to the Sharetribe console, and can use it instead of, or as well as their console app.

## Quick start (no such thing!)

You will need:

If you are using Sharetribe's backend (as oppose to FFS), you will need both the REACT_APP_FLEX_INTEGRATION_CLIENT_ID and REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET keys in .env.*. In FFS these are ignored (make them up).

If you're using FFS, you need to set REACT_APP_FLEX_INTEGRATION_BASE_URL to your FFS server's address (else it will defuault to Sharetribe's)

## Getting started with customization

You need to understand how Flex is architected. Read the FTW customization guides and the Flex SDK documentatio. 

Some familarity with javascript/React/Redux apps will be helpful in customizing this  template.

## Documentation

See the Flex Docs site: https://www.sharetribe.com/docs/ to understand what we're attempting here. Note we do not have a Flex console nor CLI implementation. Backend management is currently limited to the MongoDB shell :-)

## License

This project is licensed under the terms of the MIT license.

